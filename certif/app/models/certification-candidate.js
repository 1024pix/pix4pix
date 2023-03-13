import Model, { attr } from '@ember-data/model';
import { inject as service } from '@ember/service';

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
  @attr complementaryCertifications;

  get complementaryCertificationsList() {
    return this.complementaryCertifications.map(({ label }) => label).join(', ');
  }

  get sexLabel() {
    if (this.sex === 'M') {
      return 'Homme';
    }
    if (this.sex === 'F') {
      return 'Femme';
    }
    return null;
  }

  get complementaryCertificationsList() {
    return this.complementaryCertifications.map(({ label }) => label).join(', ');
  }

  get billingModeLabel() {
    const candidateBillingMode = this.billingMode;
    if (candidateBillingMode) {
      return this.intl.t(
        `pages.sessions.detail.candidates.informations.billing-mode.${candidateBillingMode.toLowerCase()}`
      );
    }

    return '-';
  }
}
