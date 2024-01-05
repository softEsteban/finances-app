import { NextApiRequest, NextApiResponse } from "next";
import Accounts from "../models/account"; 
import User from "@/models/user";

// GET - http://localhost:3000/api/accounts?userId=anyuserid
export async function getAccounts(userId: any, req: NextApiRequest, res: NextApiResponse) { 
  try {
    let accounts: any = [];

    if (userId) {
      accounts = await Accounts.find({ userId }).populate("userId", "name", User);
    } else {
      accounts = await Accounts.find({}).populate("userId", "name", User);
    }

    if (!accounts || accounts.length === 0) {
      return res.status(404).json({ error: "Accounts not found" });
    }
    res.status(200).json(accounts);
  } catch (error) {
    console.error('Error while fetching accounts:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// POST - http://localhost:3000/api/accounts
export async function createAccount(req: NextApiRequest, res: NextApiResponse) { 
  try {
    const { userId, amount, name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ error: "userId, amount, and name are required" });
    }

    const newAccount = new Accounts({
      userId,
      amount,
      name
    });

    await newAccount.save();

    res.status(201).json(newAccount);
  } catch (error) {
    console.error('Error while creating account:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// PUT - http://localhost:3000/api/accounts/:accountId
export async function updateAccount(accountId: any, req: NextApiRequest, res: NextApiResponse) { 
  try {
    const { userId, amount, name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ error: "userId, amount, and name are required" });
    }

    const updatedAccount = await Accounts.findByIdAndUpdate(
      accountId,
      { userId, amount, name },
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.status(200).json(updatedAccount);
  } catch (error) {
    console.error('Error while updating account:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// DELETE - http://localhost:3000/api/accounts/:accountId
export async function deleteAccount(accountId: any, req: NextApiRequest, res: NextApiResponse) { // Renamed function to deleteAccount
  try {
    const deletedAccount = await Accounts.findByIdAndDelete(accountId);

    if (!deletedAccount) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error('Error while deleting account:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}
