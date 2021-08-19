const _ = require('lodash');
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
const completeAssessment = require('../../../../lib/domain/usecases/complete-assessment');
const Assessment = require('../../../../lib/domain/models/Assessment');
const { AlreadyRatedAssessmentError } = require('../../../../lib/domain/errors');
const AssessmentCompleted = require('../../../../lib/domain/events/AssessmentCompleted');

describe('Unit | UseCase | complete-assessment', function() {
  const scoringCertificationService = { calculateCertificationAssessmentScore: _.noop };
  const assessmentRepository = {
    get: _.noop,
    completeByAssessmentId: _.noop,
  };
  const assessmentResultRepository = { save: _.noop };
  const certificationCourseRepository = { changeCompletionDate: _.noop };
  const competenceMarkRepository = { save: _.noop };
  const now = new Date('2019-01-01T05:06:07Z');
  let clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers(now);
  });

  afterEach(function() {
    clock.restore();
  });

  context('when assessment is already completed', function() {
    const assessmentId = 'assessmentId';

    beforeEach(function() {
      const completedAssessment = domainBuilder.buildAssessment({
        id: assessmentId,
        state: 'completed',
      });
      sinon.stub(assessmentRepository, 'get').withArgs(assessmentId).resolves(completedAssessment);
    });

    it('should return an AlreadyRatedAssessmentError', async function() {
      // when
      const err = await catchErr(completeAssessment)({
        assessmentId,
        assessmentRepository,
        assessmentResultRepository,
        certificationCourseRepository,
        competenceMarkRepository,
        scoringCertificationService,
      });

      // then
      expect(err).to.be.an.instanceof(AlreadyRatedAssessmentError);
    });
  });

  context('when assessment is not yet completed', function() {
    [
      _buildCompetenceEvaluationAssessment(),
      _buildCampaignAssessment(),
      _buildCertificationAssessment(),
    ]
      .forEach((assessment) => {

        context(`common behavior when assessment is of type ${assessment.type}`, function() {

          beforeEach(function() {
            sinon.stub(assessmentRepository, 'get').withArgs(assessment.id).resolves(assessment);
            sinon.stub(assessmentRepository, 'completeByAssessmentId').resolves();
          });

          it('should complete the assessment', async function() {
            // when
            await completeAssessment({
              assessmentId: assessment.id,
              assessmentRepository,
              assessmentResultRepository,
              certificationCourseRepository,
              competenceMarkRepository,
              scoringCertificationService,
            });

            // then
            expect(assessmentRepository.completeByAssessmentId.calledWithExactly(assessment.id)).to.be.true;
          });

          it('should return a AssessmentCompleted event', async function() {
            // when
            const result = await completeAssessment({
              assessmentId: assessment.id,
              assessmentRepository,
              assessmentResultRepository,
              certificationCourseRepository,
              competenceMarkRepository,
              scoringCertificationService,
            });

            // then
            expect(result).to.be.an.instanceof(AssessmentCompleted);
            expect(result.userId).to.equal(assessment.userId);
            expect(result.assessmentId).to.equal(assessment.id);
          });
        });
      });

    context('when assessment is of type CAMPAIGN', function() {
      it('should return a AssessmentCompleted event with a userId and targetProfileId', async function() {
        const assessment = _buildCampaignAssessment();

        sinon.stub(assessmentRepository, 'get').withArgs(assessment.id).resolves(assessment);
        sinon.stub(assessmentRepository, 'completeByAssessmentId').resolves();
        // when
        const result = await completeAssessment({
          assessmentId: assessment.id,
          assessmentRepository,
          assessmentResultRepository,
          certificationCourseRepository,
          competenceMarkRepository,
          scoringCertificationService,
        });

        // then
        expect(result.campaignParticipationId).to.equal(assessment.campaignParticipationId);
      });
    });

    context('when assessment is of type CERTIFICATION', function() {
      it('should return a AssessmentCompleted event with certification flag', async function() {
        const assessment = _buildCertificationAssessment();

        sinon.stub(assessmentRepository, 'get').withArgs(assessment.id).resolves(assessment);
        sinon.stub(assessmentRepository, 'completeByAssessmentId').resolves();
        // when
        const result = await completeAssessment({
          assessmentId: assessment.id,
          assessmentRepository,
          assessmentResultRepository,
          certificationCourseRepository,
          competenceMarkRepository,
          scoringCertificationService,
        });

        // then
        expect(result.isCertificationType).to.equal(true);
      });
    });
  });
});

function _buildCompetenceEvaluationAssessment() {
  return domainBuilder.buildAssessment.ofTypeCompetenceEvaluation({
    id: Symbol('assessmentId'),
    state: 'started',
  });
}

function _buildCampaignAssessment() {
  return domainBuilder.buildAssessment(
    {
      id: Symbol('assessmentId'),
      state: 'started',
      type: Assessment.types.CAMPAIGN,
      userId: Symbol('userId'),
      campaignParticipationId: Symbol('campaignParticipationId'),
    },
  );
}

function _buildCertificationAssessment() {
  return domainBuilder.buildAssessment({
    id: Symbol('assessmentId'),
    certificationCourseId: Symbol('certificationCourseId'),
    state: 'started',
    type: Assessment.types.CERTIFICATION,
  });
}
