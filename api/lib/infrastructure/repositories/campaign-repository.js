import _ from 'lodash';
import { NotFoundError } from '../../domain/errors.js';
import { knex } from '../../../db/knex-database-connection.js';
import { Campaign } from '../../domain/models/Campaign.js';
import * as skillRepository from './skill-repository.js';

const CAMPAIGNS_TABLE = 'campaigns';

const isCodeAvailable = async function (code) {
  return !(await knex('campaigns').first('id').where({ code }));
};

const getByCode = async function (code) {
  const campaign = await knex('campaigns').first().where({ code });
  if (!campaign) return null;
  return new Campaign({ ...campaign, organization: { id: campaign.organizationId } });
};

const get = async function (id) {
  const campaign = await knex('campaigns').where({ id }).first();
  if (!campaign) {
    throw new NotFoundError(`Not found campaign for ID ${id}`);
  }
  return new Campaign({
    ...campaign,
    organization: { id: campaign.organizationId },
    targetProfile: { id: campaign.targetProfileId },
    creator: { id: campaign.creatorId },
  });
};

const save = async function (campaign, dependencies = { skillRepository }) {
  const trx = await knex.transaction();
  const campaignAttributes = _.pick(campaign, [
    'name',
    'code',
    'title',
    'type',
    'idPixLabel',
    'customLandingPageText',
    'creatorId',
    'ownerId',
    'organizationId',
    'targetProfileId',
    'multipleSendings',
  ]);
  try {
    const [createdCampaignDTO] = await trx(CAMPAIGNS_TABLE).insert(campaignAttributes).returning('*');
    const createdCampaign = new Campaign(createdCampaignDTO);
    if (createdCampaign.isAssessment()) {
      const cappedTubes = await trx('target-profile_tubes')
        .select('tubeId', 'level')
        .where('targetProfileId', campaignAttributes.targetProfileId);
      const skillData = [];
      for (const cappedTube of cappedTubes) {
        const allLevelSkills = await dependencies.skillRepository.findActiveByTubeId(cappedTube.tubeId);
        const rightLevelSkills = allLevelSkills.filter((skill) => skill.difficulty <= cappedTube.level);
        skillData.push(...rightLevelSkills.map((skill) => ({ skillId: skill.id, campaignId: createdCampaign.id })));
      }
      await trx.batchInsert('campaign_skills', skillData);
    }
    await trx.commit();
    return createdCampaign;
  } catch (err) {
    await trx.rollback();
    throw err;
  }
};

const update = async function (campaign) {
  const editedAttributes = _.pick(campaign, [
    'name',
    'title',
    'customLandingPageText',
    'archivedAt',
    'archivedBy',
    'ownerId',
  ]);

  const [editedCampaign] = await knex('campaigns').update(editedAttributes).where({ id: campaign.id }).returning('*');

  return new Campaign(editedCampaign);
};

const checkIfUserOrganizationHasAccessToCampaign = async function (campaignId, userId) {
  const campaign = await knex('campaigns')
    .innerJoin('memberships', 'memberships.organizationId', 'campaigns.organizationId')
    .innerJoin('organizations', 'organizations.id', 'campaigns.organizationId')
    .where({ 'campaigns.id': campaignId, 'memberships.userId': userId, 'memberships.disabledAt': null })
    .first('campaigns.id');
  return Boolean(campaign);
};

const checkIfCampaignIsArchived = async function (campaignId) {
  const { archivedAt } = await knex('campaigns').where({ id: campaignId }).first('archivedAt');
  return Boolean(archivedAt);
};

const getCampaignTitleByCampaignParticipationId = async function (campaignParticipationId) {
  const campaign = await knex('campaigns')
    .select('title')
    .join('campaign-participations', 'campaign-participations.campaignId', 'campaigns.id')
    .where({ 'campaign-participations.id': campaignParticipationId })
    .first();

  if (!campaign) return null;
  return campaign.title;
};

const getCampaignCodeByCampaignParticipationId = async function (campaignParticipationId) {
  const campaign = await knex('campaigns')
    .select('code')
    .join('campaign-participations', 'campaign-participations.campaignId', 'campaigns.id')
    .where({ 'campaign-participations.id': campaignParticipationId })
    .first();

  if (!campaign) return null;
  return campaign.code;
};

const getCampaignIdByCampaignParticipationId = async function (campaignParticipationId) {
  const campaign = await knex('campaigns')
    .select('campaigns.id')
    .join('campaign-participations', 'campaign-participations.campaignId', 'campaigns.id')
    .where({ 'campaign-participations.id': campaignParticipationId })
    .first();

  if (!campaign) return null;
  return campaign.id;
};

const findSkillIds = async function ({ campaignId, domainTransaction, filterByStatus = 'operative' }) {
  if (filterByStatus === 'all') {
    return _findSkillIds({ campaignId, domainTransaction });
  }
  const skills = await this.findSkills({ campaignId, domainTransaction, filterByStatus });
  return skills.map(({ id }) => id);
};

const findSkills = function ({ campaignId, domainTransaction, filterByStatus }) {
  return _findSkills({ campaignId, domainTransaction, filterByStatus });
};

const findSkillsByCampaignParticipationId = async function ({ campaignParticipationId, domainTransaction }) {
  const knexConn = domainTransaction?.knexTransaction ?? knex;
  const [campaignId] = await knexConn('campaign-participations')
    .where({ id: campaignParticipationId })
    .pluck('campaignId');
  return this.findSkills({ campaignId });
};

const findSkillIdsByCampaignParticipationId = async function ({ campaignParticipationId, domainTransaction }) {
  const skills = await this.findSkillsByCampaignParticipationId({ campaignParticipationId, domainTransaction });
  return skills.map(({ id }) => id);
};

export {
  isCodeAvailable,
  getByCode,
  get,
  save,
  update,
  checkIfUserOrganizationHasAccessToCampaign,
  checkIfCampaignIsArchived,
  getCampaignTitleByCampaignParticipationId,
  getCampaignCodeByCampaignParticipationId,
  getCampaignIdByCampaignParticipationId,
  findSkillIds,
  findSkills,
  findSkillsByCampaignParticipationId,
  findSkillIdsByCampaignParticipationId,
};

async function _findSkills({ campaignId, domainTransaction, filterByStatus = 'operative' }) {
  const skillIds = await _findSkillIds({ campaignId, domainTransaction });
  switch (filterByStatus) {
    case 'operative':
      return skillRepository.findOperativeByIds(skillIds);
    case 'all':
      return skillRepository.findByRecordIds(skillIds);
    default:
      throw new TypeError(`unknown filterByStatus value "${filterByStatus}", use "operative" or "all"`);
  }
}

async function _findSkillIds({ campaignId, domainTransaction }) {
  const knexConn = domainTransaction?.knexTransaction ?? knex;
  return knexConn('campaign_skills').where({ campaignId }).pluck('skillId');
}
