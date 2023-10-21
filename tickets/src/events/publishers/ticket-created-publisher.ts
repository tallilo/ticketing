import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@tallilotickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
