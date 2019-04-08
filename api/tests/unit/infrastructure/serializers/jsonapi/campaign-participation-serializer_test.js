const { expect, domainBuilder } = require('../../../../test-helper');
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/campaign-participation-serializer');
const CampaignParticipation  = require('../../../../../lib/domain/models/CampaignParticipation');

describe('Unit | Serializer | JSONAPI | campaign-participation-serializer', function() {

  describe('#serialize', function() {

    it('should convert a CampaignParticipation model object into JSON API data', function() {
      // given
      const campaign = domainBuilder.buildCampaign();
      const campaignParticipation = domainBuilder.buildCampaignParticipation({
        id: 5,
        isShared: true,
        participantExternalId: 'mail pro',
        sharedAt: new Date('2018-02-06T14:12:44Z'),
        createdAt: new Date('2018-02-05T14:12:44Z'),
        campaign: campaign,
        campaignId: campaign.id,
        assessmentId: 67890,
        userId: 123,
      });

      const expectedSerializedCampaignParticipation = {
        data: {
          type: 'campaign-participations',
          id: '5',
          attributes: {
            'is-shared': true,
            'participant-external-id': 'mail pro',
            'shared-at': new Date('2018-02-06T14:12:44Z'),
            'created-at': new Date('2018-02-05T14:12:44Z'),
          },
          relationships: {
            campaign: {
              data: {
                id: `${ campaign.id }`,
                type: 'campaigns'
              }
            },
            user: {
              data: null
            },
            assessment: {
              links: {
                related: `/assessments/${campaignParticipation.assessmentId}`
              }
            },
            'campaign-participation-result': {
              data: null,
              links: {
                'related': '/campaign-participations/5/campaign-participation-result'
              }
            },
          },
        },
        included: [
          {
            attributes: {
              code: campaign.code,
              title: campaign.title,
            },
            id: `${ campaign.id }`,
            type: 'campaigns'
          }
        ]
      };

      // when
      const json = serializer.serialize(campaignParticipation);

      // then
      expect(json).to.deep.equal(expectedSerializedCampaignParticipation);
    });

  });

  describe('#deserialize', function() {

    it('should convert JSON API campaign participation data into a CampaignParticipation model', function() {
      // given
      const campaignId = '28346762';
      const jsonAnswer = {
        data: {
          type: 'campaign-participations',
          attributes: {
            participantExternalId: 'azerty@qwerty.net',
          },
          relationships: {
            'campaign': {
              data: {
                id: campaignId.toString(),
              }
            }
          }
        }
      };

      // when
      const promise = serializer.deserialize(jsonAnswer);

      // then
      return expect(promise).to.be.fulfilled
        .then((campaignParticipation) => {
          expect(campaignParticipation).to.be.instanceOf(CampaignParticipation);
          expect(campaignParticipation.participantExternalId).to.equal(jsonAnswer.data.attributes.participantExternalId);
          expect(campaignParticipation.campaignId).to.equal(campaignId);
        });
    });

  });

});
