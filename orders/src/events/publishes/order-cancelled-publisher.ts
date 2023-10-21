import {
  Subjects,
  OrderCancelledEvent,
  Publisher,
} from "@tallilotickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
