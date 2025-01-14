import { buildAssessmentCampaignForSkills } from './build-assessment-campaign-for-skills.js';
import { CampaignTypes } from '../../../lib/domain/models/CampaignTypes.js';

const buildAssessmentCampaign = function (attributes, skills = [{ id: 'skill', name: 'skillName' }]) {
  attributes.type = CampaignTypes.ASSESSMENT;

  return buildAssessmentCampaignForSkills(attributes, skills);
};

export { buildAssessmentCampaign };
