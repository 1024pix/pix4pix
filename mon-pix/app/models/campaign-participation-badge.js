/* eslint ember/no-computed-properties-in-native-classes: 0 */

import { attr, belongsTo, hasMany } from '@ember-data/model';
import { mapBy, max } from '@ember/object/computed';
import Badge from 'mon-pix/models/badge';

export default class CampaignParticipationBadge extends Badge {
  // attributes
  @attr('boolean') isAcquired;
  @attr('boolean') isAlwaysVisible;
  @attr('boolean') isCertifiable;
  @attr('boolean') isValid;
  @attr('number') acquisitionPercentage;

  // includes
  @hasMany('skillSetResult') skillSetResults;
  @belongsTo('campaignParticipationResult') campaignParticipationResult;

  // methods
  @mapBy('skillSetResults', 'totalSkillsCount') totalSkillSetResultSkillsCounts;
  @max('totalSkillSetResultSkillsCounts') maxTotalSkillsCountInSkillSets;
}
