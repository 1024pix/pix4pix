import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

const LINK_SCO = 'http://cloud.pix.fr/s/GqwW6dFDDrHezfS';
const LINK_OTHER = 'http://cloud.pix.fr/s/fLSG4mYCcX7GDRF';

export default class AuthenticatedController extends Controller {
  @tracked isBannerVisible = true;
  @service router;
  @service currentUser;
  @service featureToggles;
  @service currentDomain;
  @service intl;

  get showBanner() {
    const isOnFinalizationPage = this.router.currentRouteName === 'authenticated.sessions.finalize';
    return (
      this.currentUser.currentAllowedCertificationCenterAccess.isScoManagingStudents &&
      this.isBannerVisible &&
      !isOnFinalizationPage &&
      !this.currentUser.currentAllowedCertificationCenterAccess.isAccessRestricted
    );
  }

  get showMassImportBanner() {
    const isScoManagingStudents = this.currentUser.currentAllowedCertificationCenterAccess.isScoManagingStudents;
    const topLevelDomain = this.currentDomain.getExtension();
    const currentLanguage = this.intl.t('current-lang');
    const isOrgTldAndEnglishCurrentLanguage = topLevelDomain === 'org' && currentLanguage === 'en';

    return (
      this.featureToggles.featureToggles.isMassiveSessionManagementEnabled &&
      !isScoManagingStudents &&
      !isOrgTldAndEnglishCurrentLanguage
    );
  }

  get documentationLink() {
    if (this.currentUser.currentAllowedCertificationCenterAccess.isScoManagingStudents) {
      return LINK_SCO;
    }
    return LINK_OTHER;
  }

  get showLinkToSessions() {
    return !this.currentUser.currentAllowedCertificationCenterAccess.isAccessRestricted;
  }

  @action
  async changeCurrentCertificationCenterAccess(certificationCenterAccess) {
    this.currentUser.currentAllowedCertificationCenterAccess = certificationCenterAccess;
    this.router.replaceWith('authenticated');
  }
}
