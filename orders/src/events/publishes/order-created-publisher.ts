import { Subjects, OrderCreatedEvent, Publisher } from "@tallilotickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
