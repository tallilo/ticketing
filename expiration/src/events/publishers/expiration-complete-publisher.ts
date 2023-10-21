import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@tallilotickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
