import { Schema, Types, model, models } from "mongoose";

const accountSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User' },
  name: String,
  amount: Number
});

const Account = models.Account || model("Account", accountSchema, "accounts");
export default Account;
