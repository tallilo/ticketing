import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import jwt from "jsonwebtoken";
declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

jest.mock("../nats-wrapper.ts");

process.env.STRIPE_KEY =
  "sk_test_51O3FJBH5E2WMuAIfj6Fc7H0cK6W1FuB9FHIYSZ1tiqfKIZDUDe4lRKBlow1ahibbweXeVJnNvhaZ9eKCelhE3vLe00Z59JGr3Q";

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asfd";
  mongo = await MongoMemoryServer.create();

  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  collections.forEach(async (collection) => await collection.deleteMany({}));
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});
declare const global: NodeJS.Global;
global.signin = (id?: string) => {
  //Build a json web token payload {id, email}

  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  //Create the json web token
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //Build the session object {jwt: MY_JWT}
  const session = { jwt: token };
  //Turn that session into JSON
  const sessionJson = JSON.stringify(session);
  //Take JSON and encode it as  base64
  const base64 = Buffer.from(sessionJson).toString("base64");
  //return a string with the encoded data

  return [`session=${base64}`];
};
