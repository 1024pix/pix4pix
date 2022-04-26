const dependencies = {
  accountRecoveryDemandRepository: require('../../infrastructure/repositories/account-recovery-demand-repository'),
  adminMemberRepository: require('../../infrastructure/repositories/admin-member-repository'),
  algorithmDataFetcherService: require('../../domain/services/algorithm-methods/data-fetcher'),
  answerRepository: require('../../infrastructure/repositories/answer-repository'),
  areaRepository: require('../../infrastructure/repositories/area-repository'),
  assessmentRepository: require('../../infrastructure/repositories/assessment-repository'),
  assessmentResultRepository: require('../../infrastructure/repositories/assessment-result-repository'),
  authenticationMethodRepository: require('../../infrastructure/repositories/authentication-method-repository'),
  authenticationService: require('../../domain/services/authentication-service'),
  badgeAcquisitionRepository: require('../../infrastructure/repositories/badge-acquisition-repository'),
  badgeCriteriaService: require('../../domain/services/badge-criteria-service'),
  badgeCriteriaRepository: require('../../infrastructure/repositories/badge-criteria-repository'),
  badgeRepository: require('../../infrastructure/repositories/badge-repository'),
  campaignAnalysisRepository: require('../../infrastructure/repositories/campaign-analysis-repository'),
  campaignAssessmentParticipationRepository: require('../../infrastructure/repositories/campaign-assessment-participation-repository'),
  campaignAssessmentParticipationResultListRepository: require('../../infrastructure/repositories/campaign-assessment-participation-result-list-repository'),
  campaignAssessmentParticipationResultRepository: require('../../infrastructure/repositories/campaign-assessment-participation-result-repository'),
  campaignCreatorRepository: require('../../infrastructure/repositories/campaign-creator-repository'),
  campaignParticipantActivityRepository: require('../../infrastructure/repositories/campaign-participant-activity-repository'),
  campaignCollectiveResultRepository: require('../../infrastructure/repositories/campaign-collective-result-repository'),
  campaignManagementRepository: require('../../infrastructure/repositories/campaign-management-repository'),
  campaignParticipationInfoRepository: require('../../infrastructure/repositories/campaign-participation-info-repository'),
  campaignParticipantRepository: require('../../infrastructure/repositories/campaign-participant-repository'),
  campaignParticipationOverviewRepository: require('../../infrastructure/repositories/campaign-participation-overview-repository'),
  campaignParticipationRepository: require('../../infrastructure/repositories/campaign-participation-repository'),
  campaignParticipationResultRepository: require('../../infrastructure/repositories/campaign-participation-result-repository'),
  campaignParticipationsStatsRepository: require('../../infrastructure/repositories/campaign-participations-stats-repository'),
  campaignProfilesCollectionParticipationSummaryRepository: require('../../infrastructure/repositories/campaign-profiles-collection-participation-summary-repository'),
  campaignProfileRepository: require('../../infrastructure/repositories/campaign-profile-repository'),
  campaignReportRepository: require('../../infrastructure/repositories/campaign-report-repository'),
  campaignRepository: require('../../infrastructure/repositories/campaign-repository'),
  campaignToJoinRepository: require('../../infrastructure/repositories/campaign-to-join-repository'),
  campaignCsvExportService: require('../../domain/services/campaign-csv-export-service'),
  certificationAssessmentRepository: require('../../infrastructure/repositories/certification-assessment-repository'),
  certificationAttestationRepository: require('../../infrastructure/repositories/certification-attestation-repository'),
  certificationAttestationPdf: require('../../infrastructure/utils/pdf/certification-attestation-pdf'),
  certificationBadgesService: require('../../domain/services/certification-badges-service'),
  certificationCandidateRepository: require('../../infrastructure/repositories/certification-candidate-repository'),
  certificationCandidateForSupervisingRepository: require('../../infrastructure/repositories/certification-candidate-for-supervising-repository'),
  certificationCandidatesOdsService: require('../../domain/services/certification-candidates-ods-service'),
  certificationCenterMembershipRepository: require('../../infrastructure/repositories/certification-center-membership-repository'),
  certificationCenterRepository: require('../../infrastructure/repositories/certification-center-repository'),
  certificationChallengeRepository: require('../../infrastructure/repositories/certification-challenge-repository'),
  certificationChallengesService: require('../../domain/services/certification-challenges-service'),
  certificationCourseRepository: require('../../infrastructure/repositories/certification-course-repository'),
  certificationCpfCityRepository: require('../../infrastructure/repositories/certification-cpf-city-repository'),
  certificationCpfCountryRepository: require('../../infrastructure/repositories/certification-cpf-country-repository'),
  certificationIssueReportRepository: require('../../infrastructure/repositories/certification-issue-report-repository'),
  certificationLsRepository: require('../../infrastructure/repositories/certification-livret-scolaire-repository'),
  certificationOfficerRepository: require('../../infrastructure/repositories/certification-officer-repository'),
  certificationPointOfContactRepository: require('../../infrastructure/repositories/certification-point-of-contact-repository'),
  certificationReportRepository: require('../../infrastructure/repositories/certification-report-repository'),
  certificationRepository: require('../../infrastructure/repositories/certification-repository'),
  certificationCpfService: require('../../domain/services/certification-cpf-service'),
  certificationResultRepository: require('../../infrastructure/repositories/certification-result-repository'),
  challengeRepository: require('../../infrastructure/repositories/challenge-repository'),
  challengeForPixAutoAnswerRepository: require('../../infrastructure/repositories/challenge-for-pix-auto-answer-repository'),
  cleaCertificationResultRepository: require('../../infrastructure/repositories/clea-certification-result-repository'),
  competenceEvaluationRepository: require('../../infrastructure/repositories/competence-evaluation-repository'),
  competenceMarkRepository: require('../../infrastructure/repositories/competence-mark-repository'),
  competenceRepository: require('../../infrastructure/repositories/competence-repository'),
  competenceTreeRepository: require('../../infrastructure/repositories/competence-tree-repository'),
  complementaryCertificationHabilitationRepository: require('../../infrastructure/repositories/complementary-certification-habilitation-repository'),
  complementaryCertificationRepository: require('../../infrastructure/repositories/complementary-certification-repository'),
  complementaryCertificationSubscriptionRepository: require('../../infrastructure/repositories/complementary-certification-subscription-repository'),
  correctionRepository: require('../../infrastructure/repositories/correction-repository'),
  countryRepository: require('../../infrastructure/repositories/country-repository'),
  courseRepository: require('../../infrastructure/repositories/course-repository'),
  divisionRepository: require('../../infrastructure/repositories/division-repository'),
  encryptionService: require('../../domain/services/encryption-service'),
  endTestScreenRemovalService: require('../services/end-test-screen-removal-service'),
  flashAssessmentResultRepository: require('../../infrastructure/repositories/flash-assessment-result-repository'),
  flashAlgorithmService: require('../../domain/services/algorithm-methods/flash'),
  frameworkRepository: require('../../infrastructure/repositories/framework-repository'),
  getCompetenceLevel: require('../../domain/services/get-competence-level'),
  sessionForSupervisorKitRepository: require('../../infrastructure/repositories/sessions/session-for-supervisor-kit-repository'),
  groupRepository: require('../../infrastructure/repositories/group-repository'),
  finalizedSessionRepository: require('../../infrastructure/repositories/sessions/finalized-session-repository'),
  higherSchoolingRegistrationRepository: require('../../infrastructure/repositories/higher-schooling-registration-repository'),
  improvementService: require('../../domain/services/improvement-service'),
  juryCertificationRepository: require('../../infrastructure/repositories/jury-certification-repository'),
  juryCertificationSummaryRepository: require('../../infrastructure/repositories/jury-certification-summary-repository'),
  jurySessionRepository: require('../../infrastructure/repositories/sessions/jury-session-repository'),
  knowledgeElementRepository: require('../../infrastructure/repositories/knowledge-element-repository'),
  mailService: require('../../domain/services/mail-service'),
  membershipRepository: require('../../infrastructure/repositories/membership-repository'),
  obfuscationService: require('../../domain/services/obfuscation-service'),
  organizationMemberIdentityRepository: require('../../infrastructure/repositories/organization-member-identity-repository'),
  organizationForAdminRepository: require('../../infrastructure/repositories/organization-for-admin-repository'),
  organizationRepository: require('../../infrastructure/repositories/organization-repository'),
  organizationInvitationRepository: require('../../infrastructure/repositories/organization-invitation-repository'),
  organizationInvitedUserRepository: require('../../infrastructure/repositories/organization-invited-user-repository'),
  organizationTagRepository: require('../../infrastructure/repositories/organization-tag-repository'),
  organizationsToAttachToTargetProfileRepository: require('../../infrastructure/repositories/organizations-to-attach-to-target-profile-repository'),
  participantResultRepository: require('../../infrastructure/repositories/participant-result-repository'),
  participationsForCampaignManagementRepository: require('../../infrastructure/repositories/participations-for-campaign-management-repository'),
  partnerCertificationScoringRepository: require('../../infrastructure/repositories/partner-certification-scoring-repository'),
  passwordGenerator: require('../../domain/services/password-generator'),
  pickChallengeService: require('../services/pick-challenge-service'),
  pixPlusDroitMaitreCertificationResultRepository: require('../../infrastructure/repositories/pix-plus-droit-maitre-certification-result-repository'),
  pixPlusDroitExpertCertificationResultRepository: require('../../infrastructure/repositories/pix-plus-droit-expert-certification-result-repository'),
  placementProfileService: require('../../domain/services/placement-profile-service'),
  poleEmploiSendingRepository: require('../../infrastructure/repositories/pole-emploi-sending-repository'),
  poleEmploiTokensRepository: require('../../infrastructure/repositories/pole-emploi-tokens-repository'),
  prescriberRepository: require('../../infrastructure/repositories/prescriber-repository'),
  privateCertificateRepository: require('../../infrastructure/repositories/private-certificate-repository'),
  resetPasswordService: require('../../domain/services/reset-password-service'),
  resetPasswordDemandRepository: require('../../infrastructure/repositories/reset-password-demands-repository'),
  schoolingRegistrationRepository: require('../../infrastructure/repositories/schooling-registration-repository'),
  schoolingRegistrationsCsvService: require('../../domain/services/schooling-registrations-csv-service'),
  schoolingRegistrationsXmlService: require('../../domain/services/schooling-registrations-xml-service'),
  scoAccountRecoveryService: require('../services/sco-account-recovery-service'),
  scoCertificationCandidateRepository: require('../../infrastructure/repositories/sco-certification-candidate-repository'),
  scorecardService: require('../../domain/services/scorecard-service'),
  scoringCertificationService: require('../../domain/services/scoring/scoring-certification-service'),
  sessionAuthorizationService: require('../../domain/services/session-authorization-service'),
  sessionForAttendanceSheetRepository: require('../../infrastructure/repositories/sessions/session-for-attendance-sheet-repository'),
  sessionPublicationService: require('../../domain/services/session-publication-service'),
  sessionRepository: require('../../infrastructure/repositories/sessions/session-repository'),
  sessionForSupervisingRepository: require('../../infrastructure/repositories/sessions/session-for-supervising-repository'),
  sessionJuryCommentRepository: require('../../infrastructure/repositories/sessions/session-jury-comment-repository'),
  sessionSummaryRepository: require('../../infrastructure/repositories/sessions/session-summary-repository'),
  settings: require('../../config'),
  shareableCertificateRepository: require('../../infrastructure/repositories/shareable-certificate-repository'),
  skillRepository: require('../../infrastructure/repositories/skill-repository'),
  skillSetRepository: require('../../infrastructure/repositories/skill-set-repository'),
  stageRepository: require('../../infrastructure/repositories/stage-repository'),
  studentRepository: require('../../infrastructure/repositories/student-repository'),
  supervisorAccessRepository: require('../../infrastructure/repositories/supervisor-access-repository'),
  tagRepository: require('../../infrastructure/repositories/tag-repository'),
  TargetProfileForSpecifierRepository: require('../../infrastructure/repositories/campaign/target-profile-for-specifier-repository'),
  targetProfileRepository: require('../../infrastructure/repositories/target-profile-repository'),
  targetProfileForUpdateRepository: require('../../infrastructure/repositories/target-profile-for-update-repository'),
  targetProfileShareRepository: require('../../infrastructure/repositories/target-profile-share-repository'),
  targetProfileWithLearningContentRepository: require('../../infrastructure/repositories/target-profile-with-learning-content-repository'),
  thematicRepository: require('../../infrastructure/repositories/thematic-repository'),
  tokenService: require('../../domain/services/token-service'),
  refreshTokenService: require('../../domain/services/refresh-token-service'),
  tubeRepository: require('../../infrastructure/repositories/tube-repository'),
  tutorialEvaluationRepository: require('../../infrastructure/repositories/tutorial-evaluation-repository'),
  tutorialRepository: require('../../infrastructure/repositories/tutorial-repository'),
  userEmailRepository: require('../../infrastructure/repositories/user-email-repository'),
  userOrgaSettingsRepository: require('../../infrastructure/repositories/user-orga-settings-repository'),
  userReconciliationService: require('../services/user-reconciliation-service'),
  userToCreateRepository: require('../../infrastructure/repositories/user-to-create-repository'),
  userRepository: require('../../infrastructure/repositories/user-repository'),
  userService: require('../../domain/services/user-service'),
  userTutorialRepository: require('../../infrastructure/repositories/user-tutorial-repository'),
  verifyCertificateCodeService: require('../../domain/services/verify-certificate-code-service'),
};

const { injectDependencies } = require('../../infrastructure/utils/dependency-injection');

module.exports = injectDependencies(
  {
    abortCertificationCourse: require('./abort-certification-course'),
    acceptOrganizationInvitation: require('./accept-organization-invitation'),
    acceptPixLastTermsOfService: require('./accept-pix-last-terms-of-service'),
    acceptPixCertifTermsOfService: require('./accept-pix-certif-terms-of-service'),
    acceptPixOrgaTermsOfService: require('./accept-pix-orga-terms-of-service'),
    addCertificationCandidateToSession: require('./add-certification-candidate-to-session'),
    addPixAuthenticationMethodByEmail: require('./add-pix-authentication-method-by-email'),
    addTutorialEvaluation: require('./add-tutorial-evaluation'),
    addTutorialToUser: require('./add-tutorial-to-user'),
    anonymizeUser: require('./anonymize-user'),
    attachTargetProfilesToOrganization: require('./attach-target-profiles-to-organization'),
    attachOrganizationsFromExistingTargetProfile: require('./attach-organizations-from-existing-target-profile'),
    attachOrganizationsToTargetProfile: require('./attach-organizations-to-target-profile'),
    archiveCampaign: require('./archive-campaign'),
    archiveOrganization: require('./archive-organization'),
    outdateTargetProfile: require('./outdate-target-profile'),
    assignCertificationOfficerToJurySession: require('./assign-certification-officer-to-jury-session'),
    authenticateAnonymousUser: require('./authenticate-anonymous-user'),
    authenticatePoleEmploiUser: require('./authenticate-pole-emploi-user'),
    authenticateUser: require('./authenticate-user'),
    authenticateExternalUser: require('./authenticate-external-user'),
    authenticateApplication: require('./authenticate-application'),
    authorizeCertificationCandidateToStart: require('./authorize-certification-candidate-to-start'),
    authorizeCertificationCandidateToResume: require('./authorize-certification-candidate-to-resume'),
    beginCampaignParticipationImprovement: require('./begin-campaign-participation-improvement'),
    cancelOrganizationInvitation: require('./cancel-organization-invitation'),
    cancelCertificationCourse: require('./cancel-certification-course'),
    changeUserLang: require('./change-user-lang'),
    checkScoAccountRecovery: require('./check-sco-account-recovery'),
    commentSessionAsJury: require('./comment-session-as-jury'),
    completeAssessment: require('./complete-assessment'),
    computeCampaignAnalysis: require('./compute-campaign-analysis'),
    computeCampaignCollectiveResult: require('./compute-campaign-collective-result'),
    computeCampaignParticipationAnalysis: require('./compute-campaign-participation-analysis'),
    correctAnswerThenUpdateAssessment: require('./correct-answer-then-update-assessment'),
    correctCandidateIdentityInCertificationCourse: require('./correct-candidate-identity-in-certification-course'),
    createAccessTokenFromRefreshToken: require('./create-access-token-from-refresh-token'),
    createAndReconcileUserToSchoolingRegistration: require('./create-and-reconcile-user-to-schooling-registration'),
    createBadge: require('./create-badge'),
    createCampaign: require('./create-campaign'),
    createCertificationCenter: require('./create-certification-center'),
    createCertificationCenterMembership: require('./create-certification-center-membership'),
    createCertificationCenterMembershipByEmail: require('./create-certification-center-membership-by-email'),
    createCertificationCenterMembershipForScoOrganizationMember: require('./create-certification-center-membership-for-sco-organization-member'),
    createLcmsRelease: require('./create-lcms-release'),
    createMembership: require('./create-membership'),
    createOrUpdateUserOrgaSettings: require('./create-or-update-user-orga-settings'),
    createOrganization: require('./create-organization'),
    createOrganizationInvitationByAdmin: require('./create-organization-invitation-by-admin'),
    createOrganizationInvitations: require('./create-organization-invitations'),
    createPasswordResetDemand: require('./create-password-reset-demand'),
    createProOrganizations: require('./create-pro-organizations-with-tags'),
    createSession: require('./create-session'),
    createStage: require('./create-stage'),
    createTag: require('./create-tag'),
    createTargetProfile: require('./create-target-profile'),
    createUser: require('./create-user'),
    createUserAndReconcileToSchoolingRegistrationFromExternalUser: require('./create-user-and-reconcile-to-schooling-registration-from-external-user'),
    createUserFromPoleEmploi: require('./create-user-from-pole-emploi'),
    deleteCertificationIssueReport: require('./delete-certification-issue-report'),
    deleteSessionJuryComment: require('./delete-session-jury-comment'),
    deleteUnassociatedBadge: require('./delete-unassociated-badge'),
    deleteUnlinkedCertificationCandidate: require('./delete-unlinked-certification-candidate'),
    deneutralizeChallenge: require('./deneutralize-challenge'),
    disableMembership: require('./disable-membership'),
    disableCertificationCenterMembership: require('./disable-certification-center-membership'),
    dissociateUserFromSchoolingRegistration: require('./dissociate-user-from-schooling-registration'),
    endAssessmentBySupervisor: require('./end-assessment-by-supervisor'),
    enrollStudentsToSession: require('./enroll-students-to-session'),
    finalizeSession: require('./finalize-session'),
    findAllTags: require('./find-all-tags'),
    findAnswerByAssessment: require('./find-answer-by-assessment'),
    findAnswerByChallengeAndAssessment: require('./find-answer-by-challenge-and-assessment'),
    findAssessmentParticipationResultList: require('./find-assessment-participation-result-list'),
    findAssociationBetweenUserAndSchoolingRegistration: require('./find-association-between-user-and-schooling-registration'),
    findCampaignProfilesCollectionParticipationSummaries: require('./find-campaign-profiles-collection-participation-summaries'),
    findCertificationCenterMembershipsByCertificationCenter: require('./find-certification-center-memberships-by-certification-center'),
    findCountries: require('./find-countries'),
    findCompetenceEvaluationsByAssessment: require('./find-competence-evaluations-by-assessment'),
    findComplementaryCertifications: require('./find-complementary-certifications'),
    findLatestOngoingUserCampaignParticipations: require('./find-latest-ongoing-user-campaign-participations'),
    findDivisionsByCertificationCenter: require('./find-divisions-by-certification-center'),
    findDivisionsByOrganization: require('./find-divisions-by-organization'),
    findFinalizedSessionsToPublish: require('./find-finalized-sessions-to-publish'),
    findFinalizedSessionsWithRequiredAction: require('./find-finalized-sessions-with-required-action'),
    findGroupsByOrganization: require('./find-groups-by-organization'),
    findPaginatedCampaignParticipantsActivities: require('./find-paginated-campaign-participants-activities'),
    findPaginatedCampaignManagements: require('./find-paginated-campaign-managements'),
    findPaginatedCertificationCenterSessionSummaries: require('./find-paginated-certification-center-session-summaries'),
    findPaginatedFilteredCertificationCenters: require('./find-paginated-filtered-certification-centers'),
    findPaginatedFilteredOrganizationCampaigns: require('./find-paginated-filtered-organization-campaigns'),
    findPaginatedFilteredOrganizationMemberships: require('./find-paginated-filtered-organization-memberships'),
    findPaginatedFilteredOrganizations: require('./find-paginated-filtered-organizations'),
    findPaginatedFilteredSchoolingRegistrations: require('./find-paginated-filtered-schooling-registrations'),
    findPaginatedFilteredTargetProfiles: require('./find-paginated-filtered-target-profiles'),
    findPaginatedFilteredTargetProfileOrganizations: require('./find-paginated-filtered-target-profile-organizations'),
    findPaginatedFilteredUsers: require('./find-paginated-filtered-users'),
    findPaginatedParticipationsForCampaignManagement: require('./find-paginated-participations-for-campaign-management'),
    findPaginatedRecommendedTutorials: require('./find-paginated-recommended-tutorials'),
    findPaginatedSavedTutorials: require('./find-paginated-saved-tutorials'),
    findPendingOrganizationInvitations: require('./find-pending-organization-invitations'),
    findStudentsForEnrollment: require('./find-students-for-enrollment'),
    findTargetProfileBadges: require('./find-target-profile-badges'),
    findTargetProfileStages: require('./find-target-profile-stages'),
    findTutorials: require('./find-tutorials'),
    findUserCampaignParticipationOverviews: require('./find-user-campaign-participation-overviews'),
    findUserPrivateCertificates: require('./find-user-private-certificates'),
    findUserTutorials: require('./find-user-tutorials'),
    flagSessionResultsAsSentToPrescriber: require('./flag-session-results-as-sent-to-prescriber'),
    generateUsername: require('./generate-username'),
    generateUsernameWithTemporaryPassword: require('./generate-username-with-temporary-password'),
    getAnswer: require('./get-answer'),
    getAssessment: require('./get-assessment'),
    getAttendanceSheet: require('./get-attendance-sheet'),
    getAvailableTargetProfilesForOrganization: require('./get-available-target-profiles-for-organization'),
    getBadgeDetails: require('./get-badge-details'),
    getCampaign: require('./get-campaign'),
    getCampaignDetailsManagement: require('./get-campaign-details-management'),
    getCampaignByCode: require('./get-campaign-by-code'),
    getCampaignAssessmentParticipation: require('./get-campaign-assessment-participation'),
    getCampaignAssessmentParticipationResult: require('./get-campaign-assessment-participation-result'),
    getCampaignParticipationsActivityByDay: require('./get-campaign-participations-activity-by-day'),
    getCampaignParticipationsCountByStage: require('./get-campaign-participations-counts-by-stage'),
    getCampaignParticipationsCountsByStatus: require('./get-campaign-participations-counts-by-status'),
    getCampaignProfile: require('./get-campaign-profile'),
    getCandidateImportSheetData: require('./get-candidate-import-sheet-data'),
    getCertificationAttestation: require('./certificate/get-certification-attestation'),
    getOrganizationMemberIdentities: require('./get-organization-members-identity'),
    findCertificationAttestationsForDivision: require('./certificate/find-certification-attestations-for-division'),
    getCertificationCandidate: require('./get-certification-candidate'),
    getCertificationCandidateSubscription: require('./get-certification-candidate-subscription'),
    getCertificationCenter: require('./get-certification-center'),
    getCertificationCourse: require('./get-certification-course'),
    getCertificationDetails: require('./get-certification-details'),
    getCertificationsResultsForLS: require('./certificate/get-certifications-results-for-ls'),
    getCertificationPointOfContact: require('./get-certification-point-of-contact'),
    getChallengeForPixAutoAnswer: require('./get-challenge-for-pix-auto-answer'),
    getCorrectionForAnswer: require('./get-correction-for-answer'),
    getCurrentUser: require('./get-current-user'),
    getExternalAuthenticationRedirectionUrl: require('./get-external-authentication-redirection-url'),
    getJurySession: require('./get-jury-session'),
    getJuryCertification: require('./get-jury-certification'),
    getLastChallengeIdFromAssessmentId: require('./get-last-challenge-id-from-assessment-id'),
    getNextChallengeForCampaignAssessment: require('./get-next-challenge-for-campaign-assessment'),
    getNextChallengeForCertification: require('./get-next-challenge-for-certification'),
    getNextChallengeForCompetenceEvaluation: require('./get-next-challenge-for-competence-evaluation'),
    getNextChallengeForDemo: require('./get-next-challenge-for-demo'),
    getNextChallengeForPreview: require('./get-next-challenge-for-preview'),
    getOrganizationDetails: require('./get-organization-details'),
    getOrganizationInvitation: require('./get-organization-invitation'),
    getParticipantsDivision: require('./get-participants-division'),
    getParticipantsGroup: require('./get-participants-group'),
    getAdminMembers: require('./get-admin-members'),
    getPoleEmploiSendings: require('./get-pole-emploi-sendings'),
    getPrescriber: require('./get-prescriber'),
    getPrivateCertificate: require('./certificate/get-private-certificate'),
    getProgression: require('./get-progression'),
    getScoCertificationResultsByDivision: require('./get-sco-certification-results-by-division'),
    getSchoolingRegistrationsCsvTemplate: require('./get-schooling-registrations-csv-template'),
    getScorecard: require('./get-scorecard'),
    getSession: require('./get-session'),
    getSessionCertificationCandidates: require('./get-session-certification-candidates'),
    getSessionCertificationReports: require('./get-session-certification-reports'),
    getSessionForSupervising: require('./get-session-for-supervising'),
    getSessionResults: require('./get-session-results'),
    getSessionResultsByResultRecipientEmail: require('./get-session-results-by-result-recipient-email'),
    getShareableCertificate: require('./certificate/get-shareable-certificate'),
    getStageDetails: require('./get-stage-details'),
    getSupervisorKitSessionInfo: require('./get-supervisor-kit-session-info'),
    getTargetProfileDetails: require('./get-target-profile-details'),
    getFrameworks: require('./get-frameworks'),
    getFrameworkAreas: require('./get-framework-areas'),
    getAccountRecoveryDetails: require('./account-recovery/get-account-recovery-details'),
    getParticipationsCountByMasteryRate: require('./get-participations-count-by-mastery-rate'),
    findUserAuthenticationMethods: require('./find-user-authentication-methods'),
    getUserByResetPasswordDemand: require('./get-user-by-reset-password-demand'),
    getUserCampaignAssessmentResult: require('./get-user-campaign-assessment-result'),
    getUserCampaignParticipationToCampaign: require('./get-user-campaign-participation-to-campaign'),
    getUserCertificationEligibility: require('./get-user-certification-eligibility'),
    getUserDetailsForAdmin: require('./get-user-details-for-admin'),
    getUserProfile: require('./get-user-profile'),
    getUserProfileSharedForCampaign: require('./get-user-profile-shared-for-campaign'),
    getUserWithMemberships: require('./get-user-with-memberships'),
    importCertificationCandidatesFromCandidatesImportSheet: require('./import-certification-candidates-from-candidates-import-sheet'),
    importHigherSchoolingRegistrations: require('./import-higher-schooling-registrations'),
    importSchoolingRegistrationsFromSIECLEFormat: require('./import-schooling-registrations-from-siecle'),
    improveCompetenceEvaluation: require('./improve-competence-evaluation'),
    linkUserToSessionCertificationCandidate: require('./link-user-to-session-certification-candidate')
      .linkUserToSessionCertificationCandidate,
    markTargetProfileAsSimplifiedAccess: require('./mark-target-profile-as-simplified-access'),
    manuallyResolveCertificationIssueReport: require('./manually-resolve-certification-issue-report'),
    neutralizeChallenge: require('./neutralize-challenge'),
    publishSession: require('./publish-session'),
    publishSessionsInBatch: require('./publish-sessions-in-batch'),
    reconcileHigherSchoolingRegistration: require('./reconcile-higher-schooling-registration'),
    reconcileSchoolingRegistration: require('./reconcile-schooling-registration'),
    reconcileUserToOrganization: require('./reconcile-user-to-organization'),
    rememberUserHasSeenAssessmentInstructions: require('./remember-user-has-seen-assessment-instructions'),
    rememberUserHasSeenChallengeTooltip: require('./remember-user-has-seen-challenge-tooltip'),
    rememberUserHasSeenNewDashboardInfo: require('./remember-user-has-seen-new-dashboard-info'),
    removeAuthenticationMethod: require('./remove-authentication-method'),
    replaceHigherSchoolingRegistrations: require('./replace-higher-schooling-registrations'),
    resetScorecard: require('./reset-scorecard'),
    retrieveLastOrCreateCertificationCourse: require('./retrieve-last-or-create-certification-course'),
    revokeRefreshToken: require('./revoke-refresh-token'),
    saveCertificationIssueReport: require('./save-certification-issue-report'),
    sendEmailForAccountRecovery: require('./account-recovery/send-email-for-account-recovery'),
    sendScoInvitation: require('./send-sco-invitation'),
    sendVerificationCode: require('./send-verification-code'),
    shareCampaignResult: require('./share-campaign-result'),
    startCampaignParticipation: require('./start-campaign-participation'),
    startOrResumeCompetenceEvaluation: require('./start-or-resume-competence-evaluation'),
    startWritingCampaignAssessmentResultsToStream: require('./start-writing-campaign-assessment-results-to-stream'),
    startWritingCampaignProfilesCollectionResultsToStream: require('./start-writing-campaign-profiles-collection-results-to-stream'),
    superviseSession: require('./supervise-session'),
    unarchiveCampaign: require('./unarchive-campaign'),
    unpublishSession: require('./unpublish-session'),
    reassignAuthenticationMethodToAnotherUser: require('./reassign-authentication-method-to-another-user'),
    updateBadge: require('./update-badge'),
    updateCampaign: require('./update-campaign'),
    updateCampaignDetailsManagement: require('./update-campaign-details-management'),
    updateCertificationCenter: require('./update-certification-center'),
    updateExpiredPassword: require('./update-expired-password'),
    updateLastQuestionState: require('./update-last-question-state'),
    updateMembership: require('./update-membership'),
    updateOrganizationInformation: require('./update-organization-information'),
    updateParticipantExternalId: require('./update-participant-external-id'),
    uncancelCertificationCourse: require('./uncancel-certification-course'),
    updateSchoolingRegistrationDependentUserPassword: require('./update-schooling-registration-dependent-user-password'),
    updateSession: require('./update-session'),
    updateStage: require('./update-stage'),
    updateStudentNumber: require('./update-student-number'),
    updateTargetProfile: require('./update-target-profile'),
    updateUserForAccountRecovery: require('./account-recovery/update-user-for-account-recovery'),
    updateUserDetailsForAdministration: require('./update-user-details-for-administration'),
    updateUserEmailWithValidation: require('./update-user-email-with-validation'),
    updateUserPassword: require('./update-user-password'),
  },
  dependencies
);
