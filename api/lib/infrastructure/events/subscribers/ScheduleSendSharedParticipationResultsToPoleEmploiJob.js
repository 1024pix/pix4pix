import { Event } from '../../../domain/events/CampaignParticipationResultsShared.js';

class ScheduleParticipationResultCalculationJob {
  constructor({ sendSharedParticipationResultsToPoleEmploiJob }) {
    this.sendSharedParticipationResultsToPoleEmploiJob = sendSharedParticipationResultsToPoleEmploiJob;
  }

  async handle(event) {
    await this.sendSharedParticipationResultsToPoleEmploiJob.schedule(event);
  }

  get name() {
    return 'SendSharedParticipationResultsToPoleEmploi';
  }
}

ScheduleParticipationResultCalculationJob.event = Event;

export { ScheduleParticipationResultCalculationJob };
