import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CertificationsRoute extends Route {
  @service accessControl;

  beforeModel() {
    this.accessControl.restrictAccessTo(['isSuperAdmin', 'isCertif', 'isSupport'], 'authenticated');
  }
}
