const _ = require('lodash');
const { types } = require('../models/Campaign');

class CampaignReport {
  constructor({
    id,
    name,
    code,
    title,
    idPixLabel,
    createdAt,
    customLandingPageText,
    archivedAt,
    type,
    creatorId,
    creatorLastName,
    creatorFirstName,
    targetProfileId,
    targetProfileImageUrl,
    targetProfileForSpecifier = {},
    participationsCount,
    sharedParticipationsCount,
    averageResult,
    badges = [],
    stages = [],
    multipleSendings,
  } = {}) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.title = title;
    this.type = type;
    this.idPixLabel = idPixLabel;
    this.customLandingPageText = customLandingPageText;
    this.createdAt = createdAt;
    this.archivedAt = archivedAt;
    this.creatorId = creatorId;
    this.creatorLastName = creatorLastName;
    this.creatorFirstName = creatorFirstName;
    this.participationsCount = participationsCount;
    this.sharedParticipationsCount = sharedParticipationsCount;
    this.averageResult = averageResult;
    this.badges = badges;
    this.stages = stages;
    this.multipleSendings = multipleSendings;
    this.targetProfileImageUrl = targetProfileImageUrl;

    this.targetProfileId = targetProfileId;
    this.targetProfileDescription = targetProfileForSpecifier.description;
    this.targetProfileName = targetProfileForSpecifier.name;
    this.targetProfileTubesCount = targetProfileForSpecifier.tubeCount;
    this.targetProfileThematicResultCount = targetProfileForSpecifier.thematicResultCount;
    this.targetProfileHasStage = targetProfileForSpecifier.hasStage;
  }

  get isAssessment() {
    return this.type === types.ASSESSMENT;
  }

  get isProfilesCollection() {
    return this.type === types.PROFILES_COLLECTION;
  }

  get isArchived() {
    return Boolean(this.archivedAt);
  }

  computeAverageResult(masteryRates) {
    const totalMasteryRates = masteryRates.length;
    if (totalMasteryRates > 0) {
      this.averageResult = _.sum(masteryRates) / totalMasteryRates;
    } else this.averageResult = null;
  }
}

module.exports = CampaignReport;
