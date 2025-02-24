import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class LearningMorePanel extends Component {
  @service featureToggles;

  get hasLearningMoreItems() {
    const learningMoreTutorials = this.args.learningMoreTutorials || [];
    return learningMoreTutorials.length > 0;
  }
}
