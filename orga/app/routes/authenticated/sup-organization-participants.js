import { service } from '@ember/service';
import Route from '@ember/routing/route';

export default class SupOrganizationParticipantsRoute extends Route {
  @service currentUser;

  beforeModel() {
    if (!this.currentUser.isSUPManagingStudents) {
      return this.replaceWith('application');
    }
  }
}
