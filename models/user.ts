import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: String,
  lastname: String,
  userType: String,
  email: String,
  password: String,
  avatar: String,
  createdAt: Date,
});

const User = models.User || model("User", userSchema, "users");
export default User;
