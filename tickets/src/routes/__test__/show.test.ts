import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
declare const global: NodeJS.Global;
it("returns 404 if the tickets is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});
it("returns the ticket if the ticket is founs", async () => {
  const title = "concert";
  const price = 20;
  const {
    body: { id: Ticketid },
  } = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${Ticketid}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
