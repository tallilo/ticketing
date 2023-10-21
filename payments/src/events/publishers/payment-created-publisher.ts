import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from "@tallilotickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
