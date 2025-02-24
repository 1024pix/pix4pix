import { expect, domainBuilder } from '../../../../test-helper.js';
import * as serializer from '../../../../../lib/infrastructure/serializers/jsonapi/certification-candidate-subscription-serializer.js';

describe('Unit | Serializer | JSONAPI | certification-candidate-subscription-serializer', function () {
  describe('#serialize', function () {
    it('should return a serialized JSON data object', function () {
      const certificationCandidateSubscription = domainBuilder.buildCertificationCandidateSubscription({
        id: 123,
        sessionId: 456,
        eligibleSubscription: domainBuilder.buildComplementaryCertification({
          key: 'FIRST_COMPLEMENTARY',
          label: 'First Complementary Certification',
        }),

        nonEligibleSubscription: domainBuilder.buildComplementaryCertification({
          key: 'SECOND_COMPLEMENTARY',
          label: 'Second Complementary Certification',
        }),
      });

      const expectedSerializedResult = {
        data: {
          id: '123',
          type: 'certification-candidate-subscriptions',
          attributes: {
            'eligible-subscription': {
              id: 1,
              key: 'FIRST_COMPLEMENTARY',
              label: 'First Complementary Certification',
            },
            'non-eligible-subscription': {
              id: 1,
              key: 'SECOND_COMPLEMENTARY',
              label: 'Second Complementary Certification',
            },
            'session-id': 456,
          },
        },
      };

      // when
      const result = serializer.serialize(certificationCandidateSubscription);

      // then
      expect(result).to.deep.equal(expectedSerializedResult);
    });
  });
});
