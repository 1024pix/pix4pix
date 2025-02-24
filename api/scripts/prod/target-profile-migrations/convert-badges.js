import * as dotenv from 'dotenv';

dotenv.config();
import _ from 'lodash';
import { knex, disconnect } from '../../../db/knex-database-connection.js';
import { logger } from '../../../lib/infrastructure/logger.js';
import { learningContentCache as cache } from '../../../lib/infrastructure/caches/learning-content-cache.js';
import * as skillRepository from '../../../lib/infrastructure/repositories/skill-repository.js';
import * as tubeRepository from '../../../lib/infrastructure/repositories/tube-repository.js';
import * as url from 'url';

let allSkills;
let allTubes;

async function _cacheLearningContentData() {
  allSkills = await skillRepository.list();
  allTubes = await tubeRepository.list();
}

async function main() {
  try {
    const dryRun = process.env.DRY_RUN === 'true';
    await doJob(dryRun);
  } catch (err) {
    logger.error(err);
    throw err;
  } finally {
    await disconnect();
    await cache.quit();
  }
}

async function doJob(dryRun) {
  await _cacheLearningContentData();
  const badgeIds = await _findBadgeIdsToConvert();
  if (badgeIds.length === 0) {
    logger.info('Aucun RT à convertir.');
    return;
  }
  logger.info(`${badgeIds.length} à convertir...`);
  for (const badgeId of badgeIds) {
    const trx = await knex.transaction();
    try {
      logger.info(`Conversion de ${badgeId}...`);
      const targetProfileTubes = await _findTargetProfileTubes(badgeId, trx);
      await _convertBadge(badgeId, targetProfileTubes, trx);
      await _deleteSkillSetCriteria(badgeId, trx);
      if (dryRun) await trx.rollback();
      else await trx.commit();
    } catch (err) {
      logger.error(`${badgeId} Echec. Raison : ${err}`);
      await trx.rollback();
    }
  }
}

async function _findBadgeIdsToConvert() {
  const ids = await knex('badge-criteria').pluck('badgeId').where('scope', 'SkillSet');
  return _.uniq(ids);
}

async function _findTargetProfileTubes(badgeId, trx) {
  return trx('target-profile_tubes')
    .select({
      id: 'tubeId',
      level: 'level',
    })
    .join('target-profiles', 'target-profiles.id', 'target-profile_tubes.targetProfileId')
    .join('badges', 'badges.targetProfileId', 'target-profiles.id')
    .where('badges.id', badgeId);
}

async function _convertBadge(badgeId, targetProfileTubes, trx) {
  const criteria = await trx('badge-criteria').select('threshold', 'skillSetIds').where({ scope: 'SkillSet', badgeId });
  const newCriteria = [];
  for (const { threshold, skillSetIds } of criteria) {
    for (const skillSetId of skillSetIds) {
      const skillSet = await trx('skill-sets').select('name', 'skillIds').where({ id: skillSetId }).first();
      const tubesWithLevel = await _computeTubeIdsAndLevelsForSkills(skillSet.skillIds);
      const tubesWithingTargetProfileWithLevel = _filterBadgeCriterionCappedTubesWithinTargetProfileCappedTubes(
        tubesWithLevel,
        targetProfileTubes
      );
      newCriteria.push({
        name: skillSet.name,
        threshold,
        scope: 'CappedTubes',
        cappedTubes: JSON.stringify(tubesWithingTargetProfileWithLevel),
        badgeId,
      });
    }
  }
  await trx.batchInsert('badge-criteria', newCriteria);
}

async function _computeTubeIdsAndLevelsForSkills(skillIds) {
  const skills = _findSkills(skillIds);
  const skillsGroupedByTubeId = _.groupBy(skills, 'tubeId');
  const tubes = [];
  for (const [tubeId, skills] of Object.entries(skillsGroupedByTubeId)) {
    const skillWithHighestDifficulty = _.maxBy(skills, 'difficulty');
    tubes.push({
      id: tubeId,
      level: skillWithHighestDifficulty.difficulty,
    });
  }
  return tubes;
}

function _findSkills(skillIds) {
  return skillIds.map((skillId) => {
    const foundSkill = allSkills.find((skill) => skill.id === skillId);
    if (!foundSkill) throw new Error(`L'acquis "${skillId}" n'existe pas dans le référentiel.`);
    if (!foundSkill.tubeId) throw new Error(`L'acquis "${skillId}" n'appartient à aucun sujet.`);
    const tube = allTubes.find((tube) => tube.id === foundSkill.tubeId);
    if (!tube) throw new Error(`Le sujet "${foundSkill.tubeId}" n'existe pas dans le référentiel.`);
    return foundSkill;
  });
}

function _filterBadgeCriterionCappedTubesWithinTargetProfileCappedTubes(badgeCappedTubes, targetProfileCappedTubes) {
  const badgeCappedTubesInTargetProfile = [];
  for (const badgeCappedTube of badgeCappedTubes) {
    const tubeInTargetProfile = targetProfileCappedTubes.find((cappedTube) => cappedTube.id === badgeCappedTube.id);
    if (tubeInTargetProfile) {
      badgeCappedTube.level = Math.min(badgeCappedTube.level, tubeInTargetProfile.level);
      badgeCappedTubesInTargetProfile.push(badgeCappedTube);
    }
  }
  return badgeCappedTubesInTargetProfile;
}

async function _deleteSkillSetCriteria(badgeId, trx) {
  await trx('badge-criteria').where({ badgeId, scope: 'SkillSet' }).del();
}

const modulePath = url.fileURLToPath(import.meta.url);
const isLaunchedFromCommandLine = process.argv[1] === modulePath;

if (isLaunchedFromCommandLine) {
  main();
}

export { doJob };
