import mongoose from "mongoose";
import { Password } from "../services/password";
//An interface that descrube the properties which are required in order to create a new user

interface UserAttrs {
  email: string;
  password: string;
}
///An inteface that describe the properties that the user model has

interface UserModal extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//An interface that the describe the properties that a User Document has

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

const User = mongoose.model<UserDoc, UserModal>("User", userSchema);

export { User };
//
