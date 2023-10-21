import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@tallilotickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
