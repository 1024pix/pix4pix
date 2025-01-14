const archiveCampaignFromCampaignCode = async function ({ campaignCode, userId, campaignForArchivingRepository }) {
  const campaign = await campaignForArchivingRepository.getByCode(campaignCode);
  campaign.archive(new Date(), userId);
  await campaignForArchivingRepository.save(campaign);
};

export { archiveCampaignFromCampaignCode };
