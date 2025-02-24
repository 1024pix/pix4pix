import { service } from '@ember/service';
import Route from '@ember/routing/route';

export default class ScoOrganizationParticipantsRoute extends Route {
  @service currentUser;

  beforeModel() {
    super.beforeModel(...arguments);
    if (!this.currentUser.isSCOManagingStudents) {
      return this.replaceWith('application');
    }
  }
}
