import { expect, sinon, hFake } from '../../../test-helper.js';
import { usecases } from '../../../../lib/domain/usecases/index.js';
import { certificationCandidatesController } from '../../../../lib/application/certification-candidates/certification-candidates-controller.js';

describe('Unit | Controller | certifications-candidate-controller', function () {
  describe('#authorizeToStart', function () {
    it('should return a 204 status code', async function () {
      // given
      const request = {
        auth: {
          credentials: { userId: '111' },
        },
        params: {
          id: 99,
        },
        payload: { 'authorized-to-start': true },
      };

      usecases.authorizeCertificationCandidateToStart = sinon.stub().rejects();
      usecases.authorizeCertificationCandidateToStart
        .withArgs({
          certificationCandidateForSupervisingId: 99,
          authorizedToStart: true,
        })
        .resolves();

      // when
      const response = await certificationCandidatesController.authorizeToStart(request, hFake);

      // then
      expect(response.statusCode).to.equal(204);
    });
  });

  describe('#authorizeToResume', function () {
    it('should return a 204 status code', async function () {
      // given
      const request = {
        auth: {
          credentials: { userId: '111' },
        },
        params: {
          id: 99,
        },
      };

      usecases.authorizeCertificationCandidateToResume = sinon.stub().rejects();
      usecases.authorizeCertificationCandidateToResume
        .withArgs({
          certificationCandidateId: 99,
        })
        .resolves();

      // when
      const response = await certificationCandidatesController.authorizeToResume(request, hFake);

      // then
      expect(response.statusCode).to.equal(204);
    });
  });
  describe('#endAssessmentBySupervisor', function () {
    const certificationCandidateId = 2;

    it('should call the endAssessmentBySupervisor use case', async function () {
      // given
      sinon.stub(usecases, 'endAssessmentBySupervisor');
      usecases.endAssessmentBySupervisor.resolves();

      // when
      await certificationCandidatesController.endAssessmentBySupervisor({
        params: { id: certificationCandidateId },
      });

      // then
      expect(usecases.endAssessmentBySupervisor).to.have.been.calledWithExactly({
        certificationCandidateId,
      });
    });
  });
});
