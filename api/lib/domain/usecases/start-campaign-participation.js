import { CampaignParticipationStarted } from '../events/CampaignParticipationStarted.js';

const startCampaignParticipation = async function ({
  campaignParticipation,
  userId,
  campaignParticipantRepository,
  campaignParticipationRepository,
  domainTransaction,
}) {
  const campaignParticipant = await campaignParticipantRepository.get({
    userId,
    campaignId: campaignParticipation.campaignId,
    domainTransaction,
  });

  campaignParticipant.start({ participantExternalId: campaignParticipation.participantExternalId });

  const campaignParticipationId = await campaignParticipantRepository.save(campaignParticipant, domainTransaction);

  const createdCampaignParticipation = await campaignParticipationRepository.get(
    campaignParticipationId,
    domainTransaction
  );

  return {
    event: new CampaignParticipationStarted({ campaignParticipationId }),
    campaignParticipation: createdCampaignParticipation,
  };
};

export { startCampaignParticipation };
