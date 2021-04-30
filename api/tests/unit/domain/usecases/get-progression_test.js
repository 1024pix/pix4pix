const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
const getProgression = require('../../../../lib/domain/usecases/get-progression');

const Assessment = require('../../../../lib/domain/models/Assessment');

const { NotFoundError } = require('../../../../lib/domain/errors');

describe('Unit | Domain | Use Cases | get-progression', () => {

  const progressionId = 'progression-1234';
  const assessmentId = 1234;
  const userId = 9874;

  const campaignParticipationRepository = { get: () => undefined, isRetrying: () => undefined };
  const targetProfileRepository = { getByCampaignId: () => undefined };
  const knowledgeElementRepository = { findUniqByUserId: () => undefined };
  const assessmentRepository = { getByAssessmentIdAndUserId: () => undefined };
  const competenceEvaluationRepository = { getByAssessmentId: () => undefined };
  const skillRepository = { findActiveByCompetenceId: () => undefined };
  const improvementService = { filterKnowledgeElementsIfImproving: () => undefined };

  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(knowledgeElementRepository, 'findUniqByUserId').resolves([]);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#getProgression', () => {

    context('when the assessment exists and is campaign', () => {

      const assessment = domainBuilder.buildAssessment({
        id: assessmentId,
        userId,
        state: 'completed',
        type: Assessment.types.CAMPAIGN,
        campaignParticipationId: 456,
      });
      const campaignParticipation = domainBuilder.buildCampaignParticipation({
        campaignId: 123,
      });
      const targetProfile = domainBuilder.buildTargetProfile();

      beforeEach(() => {
        sandbox.stub(assessmentRepository, 'getByAssessmentIdAndUserId').withArgs(assessment.id, userId).resolves(assessment);
        sandbox.stub(campaignParticipationRepository, 'get').withArgs(assessment.campaignParticipationId).resolves(campaignParticipation);
        sandbox.stub(targetProfileRepository, 'getByCampaignId').withArgs(campaignParticipation.campaignId).resolves(targetProfile);
        sandbox.stub(campaignParticipationRepository, 'isRetrying');
        sandbox.stub(improvementService, 'filterKnowledgeElementsIfImproving');
      });

      it('should return the progression associated to the assessment', async () => {
        // given
        const expectedProgression = domainBuilder.buildProgression({
          id: progressionId,
          targetedSkills: targetProfile.skills,
          knowledgeElements: [],
          isProfileCompleted: assessment.isCompleted(),
        });

        // when
        const progression = await getProgression({
          userId,
          progressionId,
          assessmentRepository,
          campaignParticipationRepository,
          competenceEvaluationRepository,
          knowledgeElementRepository,
          skillRepository,
          targetProfileRepository,
          improvementService,
        });

        // then
        expect(progression).to.deep.equal(expectedProgression);
      });

      context('when the assessment is improving', () => {
        let knowledgeElements, knowledgeElementsFiltered;
        beforeEach(() => {
          assessment.state = 'improving';
          knowledgeElements = [
            domainBuilder.buildKnowledgeElement(),
            domainBuilder.buildKnowledgeElement(),
          ];
          knowledgeElementsFiltered = [knowledgeElements[0]];
          knowledgeElementRepository.findUniqByUserId.resolves(knowledgeElements);
          campaignParticipationRepository.isRetrying.withArgs({ campaignParticipationId: assessment.campaignParticipationId }).resolves(false);
        });

        it('should filter the knowledge elements', async () => {
          // when
          await getProgression({
            userId,
            progressionId,
            assessmentRepository,
            campaignParticipationRepository,
            competenceEvaluationRepository,
            knowledgeElementRepository,
            skillRepository,
            targetProfileRepository,
            improvementService,
          });

          // then
          expect(improvementService.filterKnowledgeElementsIfImproving).to.have.been.calledWith({ knowledgeElements, assessment, isRetrying: false });
        });

        it('should return the progression associated to the assessment', async () => {
          // given
          improvementService.filterKnowledgeElementsIfImproving.withArgs({ knowledgeElements, assessment, isRetrying: false }).returns(knowledgeElementsFiltered);
          const expectedProgression = domainBuilder.buildProgression({
            id: progressionId,
            targetedSkills: targetProfile.skills,
            knowledgeElements: knowledgeElementsFiltered,
            isProfileCompleted: assessment.isCompleted(),
          });

          // when
          const progression = await getProgression({
            userId,
            progressionId,
            assessmentRepository,
            campaignParticipationRepository,
            competenceEvaluationRepository,
            knowledgeElementRepository,
            skillRepository,
            targetProfileRepository,
            improvementService,
          });

          // then
          expect(progression).to.deep.equal(expectedProgression);
        });

      });

      context('when the assessment is improving because user is retrying campaign participation', () => {
        let knowledgeElements, knowledgeElementsFiltered;
        beforeEach(() => {
          assessment.state = 'improving';
          knowledgeElements = [
            domainBuilder.buildKnowledgeElement(),
            domainBuilder.buildKnowledgeElement(),
          ];
          knowledgeElementsFiltered = [knowledgeElements[0]];
          knowledgeElementRepository.findUniqByUserId.resolves(knowledgeElements);
          campaignParticipationRepository.isRetrying.withArgs({ campaignParticipationId: assessment.campaignParticipationId }).resolves(true);
        });

        it('should filter the knowledge elements', async () => {
          // when
          await getProgression({
            userId,
            progressionId,
            assessmentRepository,
            campaignParticipationRepository,
            competenceEvaluationRepository,
            knowledgeElementRepository,
            skillRepository,
            targetProfileRepository,
            improvementService,
          });

          // then
          expect(improvementService.filterKnowledgeElementsIfImproving).to.have.been.calledWith({ knowledgeElements, assessment, isRetrying: true });
        });

        it('should return the progression associated to the assessment', async () => {
          // given
          improvementService.filterKnowledgeElementsIfImproving.withArgs({ knowledgeElements, assessment, isRetrying: true }).returns(knowledgeElementsFiltered);

          const expectedProgression = domainBuilder.buildProgression({
            id: progressionId,
            targetedSkills: targetProfile.skills,
            knowledgeElements: knowledgeElementsFiltered,
            isProfileCompleted: assessment.isCompleted(),
          });

          // when
          const progression = await getProgression({
            userId,
            progressionId,
            assessmentRepository,
            campaignParticipationRepository,
            competenceEvaluationRepository,
            knowledgeElementRepository,
            skillRepository,
            targetProfileRepository,
            improvementService,
          });

          // then
          expect(progression).to.deep.equal(expectedProgression);
        });
      });
    });

    context('when the assessment exists and is competence evaluation', () => {

      const competenceEvaluationAssessment = domainBuilder.buildAssessment({
        id: assessmentId,
        userId,
        type: Assessment.types.COMPETENCE_EVALUATION,
      });

      const competenceEvaluation = domainBuilder.buildCompetenceEvaluation({
        competenceId: 1,
        assessmentId,
        userId,
      });
      const competenceSkills = [domainBuilder.buildSkill()];

      beforeEach(() => {
        sandbox.stub(assessmentRepository, 'getByAssessmentIdAndUserId').resolves(competenceEvaluationAssessment);
        sandbox.stub(competenceEvaluationRepository, 'getByAssessmentId').resolves(competenceEvaluation);
        sandbox.stub(skillRepository, 'findActiveByCompetenceId').resolves(competenceSkills);
        sandbox.stub(improvementService, 'filterKnowledgeElementsIfImproving')
          .withArgs({ knowledgeElements: [], assessment: competenceEvaluationAssessment }).returns([]);
      });

      it('should load the right assessment', async () => {
        // when
        await getProgression({
          userId,
          progressionId,
          assessmentRepository,
          campaignParticipationRepository,
          competenceEvaluationRepository,
          knowledgeElementRepository,
          skillRepository,
          targetProfileRepository,
          improvementService,
        });

        // then
        expect(competenceEvaluationRepository.getByAssessmentId).to.have.been.calledWith(assessmentId);
      });

      it('should return the progression associated to the assessment', async () => {
        // given
        const expectedProgression = domainBuilder.buildProgression({
          id: progressionId,
          targetedSkills: competenceSkills,
          knowledgeElements: [],
          isProfileCompleted: competenceEvaluationAssessment.isCompleted(),
        });

        // when
        const progression = await getProgression({
          userId,
          progressionId,
          assessmentRepository,
          campaignParticipationRepository,
          competenceEvaluationRepository,
          knowledgeElementRepository,
          skillRepository,
          targetProfileRepository,
          improvementService,
        });

        // then
        expect(progression).to.deep.equal(expectedProgression);
      });

      context('when the assessment is improving', () => {

        let knowledgeElements, knowledgeElementsFiltered;

        beforeEach(() => {
          competenceEvaluationAssessment.state = 'improving';
          knowledgeElements = [
            domainBuilder.buildKnowledgeElement(),
            domainBuilder.buildKnowledgeElement(),
          ];
          knowledgeElementsFiltered = [knowledgeElements[0]];
          knowledgeElementRepository.findUniqByUserId.resolves(knowledgeElements);

          improvementService.filterKnowledgeElementsIfImproving
            .withArgs({ knowledgeElements, assessment: competenceEvaluationAssessment }).returns(knowledgeElementsFiltered);
        });

        it('should filter the knowledge elements', async () => {
          // when
          await getProgression({
            userId,
            progressionId,
            assessmentRepository,
            campaignParticipationRepository,
            competenceEvaluationRepository,
            knowledgeElementRepository,
            skillRepository,
            targetProfileRepository,
            improvementService,
          });

          // then
          expect(improvementService.filterKnowledgeElementsIfImproving)
            .to.have.been.calledWith({ knowledgeElements, assessment: competenceEvaluationAssessment });

        });

        it('should return the progression associated to the assessment', async () => {
          // given
          const expectedProgression = domainBuilder.buildProgression({
            id: progressionId,
            targetedSkills: competenceSkills,
            knowledgeElements: knowledgeElementsFiltered,
            isProfileCompleted: competenceEvaluationAssessment.isCompleted(),
          });

          // when
          const progression = await getProgression({
            userId,
            progressionId,
            assessmentRepository,
            campaignParticipationRepository,
            competenceEvaluationRepository,
            knowledgeElementRepository,
            skillRepository,
            targetProfileRepository,
            improvementService,
          });

          // then
          expect(progression).to.deep.equal(expectedProgression);
        });
      });
    });

    context('when the assessment does not exist', () => {

      const assessment = domainBuilder.buildAssessment({
        id: assessmentId,
        userId,
        type: Assessment.types.CAMPAIGN,
      });

      beforeEach(() => {
        sandbox.stub(assessmentRepository, 'getByAssessmentIdAndUserId').resolves(assessment);
      });

      it('should transfer the errors', async () => {
        // given
        assessmentRepository.getByAssessmentIdAndUserId.rejects(new NotFoundError('No found Assessment for ID 1234'));

        // when
        const error = await catchErr(getProgression)({
          userId,
          progressionId,
          assessmentRepository,
          campaignParticipationRepository,
          competenceEvaluationRepository,
          knowledgeElementRepository,
          skillRepository,
          targetProfileRepository,
          improvementService,
        });

        // then
        return expect(error).to.be.instanceOf(NotFoundError);
      });
    });
  });
});
