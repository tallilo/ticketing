import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@tallilotickets/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

declare const global: NodeJS.Global;

//jest.mock("../../stripe");

it("returns a 404  when purchasing an order that doesnt exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
      token: "sfsd",
    })
    .expect(404);
});
it("returns 401 when purchasing a order that doesnt belong to user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      orderId: order.id,
      token: "sfsd",
    })
    .expect(401);
});
it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({ orderId: order.id, token: "fsdfsd" })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 10000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({ token: "tok_visa", orderId: order.id })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });

  const stripeCharge = stripeCharges.data.find(
    (charge) => charge.amount === price * 100
  );
  expect(stripeCharge).toBeDefined();
  expect(stripeCharge?.currency).toEqual("usd");

  const payment = await Payment.findOne({
    stripeId: stripeCharge!.id,
    orderId: order.id,
  });

  expect(payment).not.toBeNull();

  //   const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  //   expect(chargeOptions.source).toEqual("tok_visa");
  //   expect(chargeOptions.amount).toEqual(20 * 100);
  //   expect(chargeOptions.currency).toEqual("usd");
});
