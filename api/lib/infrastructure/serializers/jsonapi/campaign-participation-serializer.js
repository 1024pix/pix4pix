import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer, Deserializer } = jsonapiSerializer;

import { Campaign } from '../../../domain/models/Campaign.js';
import { CampaignParticipation } from '../../../domain/models/CampaignParticipation.js';

const serialize = function (campaignParticipation) {
  return new Serializer('campaign-participation', {
    transform: (campaignParticipation) => {
      const campaignParticipationForSerialization = new CampaignParticipation(campaignParticipation);
      if (campaignParticipation.lastAssessment) {
        campaignParticipationForSerialization.assessment = { id: campaignParticipation.lastAssessment.id };
      }
      campaignParticipationForSerialization.trainings = null;
      return campaignParticipationForSerialization;
    },

    attributes: [
      'isShared',
      'sharedAt',
      'createdAt',
      'participantExternalId',
      'campaign',
      'assessment',
      'deletedAt',
      'trainings',
    ],
    campaign: {
      ref: 'id',
      attributes: ['code', 'title', 'type'],
    },
    assessment: {
      ref: 'id',
      ignoreRelationshipData: true,
      relationshipLinks: {
        related(record) {
          return `/api/assessments/${record.assessment.id}`;
        },
      },
    },
    trainings: {
      ref: 'id',
      ignoreRelationshipData: true,
      relationshipLinks: {
        related(record, current, parent) {
          return `/api/campaign-participations/${parent.id}/trainings`;
        },
      },
    },
  }).serialize(campaignParticipation);
};

const deserialize = function (json) {
  return new Deserializer({ keyForAttribute: 'camelCase' }).deserialize(json).then((campaignParticipation) => {
    let campaign;
    if (json.data?.relationships?.campaign) {
      campaign = new Campaign({ id: json.data.relationships.campaign.data.id });
    }

    return new CampaignParticipation({ ...campaignParticipation, campaign });
  });
};

export { serialize, deserialize };
