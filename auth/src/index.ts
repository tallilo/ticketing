import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("Starting up...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must define");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must define");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.log(err);
  }
  console.log("conected to mongo DB");
  app.listen(3000, () => {
    console.log("Listen on port 3000");
  });
};
start();
