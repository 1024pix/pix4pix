const _ = require('lodash');

// This file implements methods useful for a CAT algorithm
// https://en.wikipedia.org/wiki/Computerized_adaptive_testing
// https://en.wikipedia.org/wiki/Item_response_theory

module.exports = {
  computeReward,
  getPredictedLevel
};

function computeReward({ challenge, predictedLevel, course, knowledgeElements }) {
  const proba = _probaOfCorrectAnswer(predictedLevel, challenge.hardestSkill.difficulty);
  const nbExtraSkillsIfSolved = _getNewSkillsInfoIfChallengeSolved(challenge, course, knowledgeElements).length;
  const nbFailedSkillsIfUnsolved = _getNewSkillsInfoIfChallengeUnsolved(challenge, course, knowledgeElements).length;

  return proba * nbExtraSkillsIfSolved + (1 - proba) * nbFailedSkillsIfUnsolved;
}

function getPredictedLevel(knowledgeElements, skills) {
  let maxLikelihood = -Infinity;
  let level = 0.5;
  let predictedLevel = 0.5;

  while (level < 8) {
    const likelihood = _computeProbabilityOfCorrectLevelPredicted(level, knowledgeElements, skills);
    if (likelihood > maxLikelihood) {
      maxLikelihood = likelihood;
      predictedLevel = level;
    }
    level += 0.5;
  }
  return predictedLevel;
}

function _computeProbabilityOfCorrectLevelPredicted(level, knowledgeElements, skills) {

  const directKnowledgeElements = _.filter(knowledgeElements, (ke)=> ke.source === 'direct');
  const extraAnswers = directKnowledgeElements.map((ke)=> {
    const skill = skills.find((skill) => skill.id === ke.skillId);
    const maxDifficulty = skill.difficulty || 2;
    const binaryOutcome = (ke.status === 'validated') ? 1 : 0;
    return { binaryOutcome, maxDifficulty };
  });

  const answerThatAnyoneCanSolve = { maxDifficulty: 0, binaryOutcome: 1 };
  const answerThatNobodyCanSolve = { maxDifficulty: 7, binaryOutcome: 0 };
  extraAnswers.push(answerThatAnyoneCanSolve, answerThatNobodyCanSolve);

  const diffBetweenResultAndProbaToResolve = extraAnswers.map((answer) =>
    answer.binaryOutcome - _probaOfCorrectAnswer(level, answer.maxDifficulty));

  return -Math.abs(diffBetweenResultAndProbaToResolve.reduce((a, b) => a + b));
}

function _getNewSkillsInfoIfChallengeSolved(challenge, course, knowledgeElements) {
  return challenge.skills.reduce((extraValidatedSkills, skill) => {
    course.findTube(skill.tubeName).getEasierThan(skill).forEach((skill) => {
      if (_skillNotTestedYet(skill, knowledgeElements)) {
        extraValidatedSkills.push(skill);
      }
    });
    return extraValidatedSkills;
  }, []);
}

function _getNewSkillsInfoIfChallengeUnsolved(challenge, course, knowledgeElements) {
  return course.findTube(challenge.hardestSkill.tubeName).getHarderThan(challenge.hardestSkill)
    .reduce((extraFailedSkills, skill) => {
      if (_skillNotTestedYet(skill, knowledgeElements)) {
        extraFailedSkills.push(skill);
      }
      return extraFailedSkills;
    }, []);
}

function _skillNotTestedYet(skill, knowledgesElements) {
  const skillsAlreadyTested = _.map(knowledgesElements, 'skillId');
  return !skillsAlreadyTested.includes(skill.id);
}

// The probability P(gap) of giving the correct answer is given by the "logistic function"
// https://en.wikipedia.org/wiki/Logistic_function
function _probaOfCorrectAnswer(userEstimatedLevel, challengeDifficulty) {
  return 1 / (1 + Math.exp(-(userEstimatedLevel - challengeDifficulty)));
}
