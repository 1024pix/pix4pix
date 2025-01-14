import { AssessmentEndedError } from '../errors.js';
import { FlashAssessmentAlgorithm } from '../models/FlashAssessmentAlgorithm.js';

const getNextChallengeForCampaignAssessment = async function ({
  challengeRepository,
  answerRepository,
  flashAssessmentResultRepository,
  assessment,
  pickChallengeService,
  locale,
  algorithmDataFetcherService,
  smartRandom,
}) {
  let algoResult;

  if (assessment.isFlash()) {
    const { allAnswers, challenges, estimatedLevel } = await algorithmDataFetcherService.fetchForFlashCampaigns({
      assessmentId: assessment.id,
      answerRepository,
      challengeRepository,
      flashAssessmentResultRepository,
      locale,
    });

    const assessmentAlgorithm = new FlashAssessmentAlgorithm();

    const possibleChallenges = assessmentAlgorithm.getPossibleNextChallenges({
      allAnswers,
      challenges,
      estimatedLevel,
    });

    return pickChallengeService.chooseNextChallenge(assessment.id)({ possibleChallenges });
  } else {
    const inputValues = await algorithmDataFetcherService.fetchForCampaigns(...arguments);
    algoResult = smartRandom.getPossibleSkillsForNextChallenge({ ...inputValues, locale });

    if (algoResult.hasAssessmentEnded) {
      throw new AssessmentEndedError();
    }

    return pickChallengeService.pickChallenge({
      skills: algoResult.possibleSkillsForNextChallenge,
      randomSeed: assessment.id,
      locale,
    });
  }
};

export { getNextChallengeForCampaignAssessment };
