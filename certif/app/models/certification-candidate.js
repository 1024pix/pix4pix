import Model, { attr } from '@ember-data/model';
import { service } from '@ember/service';

export default class CertificationCandidate extends Model {
  @service intl;
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('date-only') birthdate;
  @attr('string') birthCity;
  @attr('string') birthProvinceCode;
  @attr('string') birthCountry;
  @attr('string') birthPostalCode;
  @attr('string') birthInseeCode;
  @attr('string') email;
  @attr('string') resultRecipientEmail;
  @attr('string') externalId;
  @attr('number') extraTimePercentage;
  @attr('boolean') isLinked;
  @attr('string') organizationLearnerId;
  @attr('string') sex;
  @attr('string') billingMode;
  @attr('string') prepaymentCode;
  @attr complementaryCertification;

  get genderLabel() {
    const candidateGender = this.sex;

    if (candidateGender === 'M') {
      return this.intl.t('common.labels.candidate.gender.man');
    }
    if (candidateGender === 'F') {
      return this.intl.t('common.labels.candidate.gender.woman');
    }
    return '-';
  }

  get billingModeLabel() {
    const candidateBillingMode = this.billingMode;
    if (candidateBillingMode) {
      return this.intl.t(`common.labels.billing-mode.${candidateBillingMode.toLowerCase()}`);
    }

    return '-';
  }
}
