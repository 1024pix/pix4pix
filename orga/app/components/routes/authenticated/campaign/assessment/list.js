import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class List extends Component {
  @service currentUser;

  get displayDivisionFilter() {
    return this.currentUser.isSCOManagingStudents;
  }

  get divisionOptions() {
    return this.args.campaign.divisions.map(({ name }) => ({ value: name, label: name }));
  }

  @action
  onSelectDivision(divisions) {
    this.args.triggerFiltering({ divisions });
  }
}
