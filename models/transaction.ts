import { Schema, Types, model, models } from "mongoose";

const TransactionTypes = {
  INCOME: 'income',
  OUTCOME: 'outcome'
};

const transactionSchema = new Schema({
  description: String,
  type: {
    type: String,
    enum: Object.values(TransactionTypes), 
  },
  amount: Number,
  userId: { type: Types.ObjectId, ref: 'User' },
  subcategoryId: { type: Types.ObjectId, ref: 'Subcategory' },
  accountId: { type: Types.ObjectId, ref: 'Account' },
  date: Date,
  createdAt: Date
});

const Transaction = models.Transaction || model("Transaction", transactionSchema, "transactions");
export default Transaction;
