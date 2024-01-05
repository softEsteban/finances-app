import { NextApiRequest, NextApiResponse } from "next";
import Balances from "../models/balance";
import User from "@/models/user";

// GET - http://localhost:3000/api/balances?userId=anyuserid
export async function getBalances(userId: any, req: NextApiRequest, res: NextApiResponse) {
  try {
    let balances: any = [];

    if (userId) {
      balances = await Balances.find({ userId }).populate("userId", "name", User);
    } else {
      balances = await Balances.find({}).populate("userId", "name", User);
    }

    if (!balances || balances.length === 0) {
      return res.status(404).json({ error: "Balances not found" });
    }
    res.status(200).json(balances);
  } catch (error) {
    console.error('Error while fetching balances:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// POST - http://localhost:3000/api/balances
export async function createBalance(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, amount, name } = req.body;

    if (!userId || !amount || !name) {
      return res.status(400).json({ error: "userId, amount, and name are required" });
    }

    const newBalance = new Balances({
      userId,
      amount,
      name
    });

    await newBalance.save();

    res.status(201).json(newBalance);
  } catch (error) {
    console.error('Error while creating balance:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// PUT - http://localhost:3000/api/balances/:balanceId
export async function updateBalance(balanceId: any, req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, amount, name } = req.body;

    if (!userId || !amount || !name) {
      return res.status(400).json({ error: "userId, amount, and name are required" });
    }

    const updatedBalance = await Balances.findByIdAndUpdate(
      balanceId,
      { userId, amount, name },
      { new: true }
    );

    if (!updatedBalance) {
      return res.status(404).json({ error: "Balance not found" });
    }

    res.status(200).json(updatedBalance);
  } catch (error) {
    console.error('Error while updating balance:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// DELETE - http://localhost:3000/api/balances/:balanceId
export async function deleteBalance(balanceId: any, req: NextApiRequest, res: NextApiResponse) {
  try {
    const deletedBalance = await Balances.findByIdAndDelete(balanceId);

    if (!deletedBalance) {
      return res.status(404).json({ error: "Balance not found" });
    }

    res.status(200).json({ message: "Balance deleted successfully" });
  } catch (error) {
    console.error('Error while deleting balance:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}