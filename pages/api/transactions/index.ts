import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/database/connection";
import { createTransaction, getTransactions } from "@/controllers/transactions.controller";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectMongo();
    } catch (error) {
        return res.status(405).json({ error: "Error in db connection" });
    }

    const { method, query } = req;
    switch (method) {
        case "GET":
            const { userId, limit, type } = query;
            getTransactions(userId, limit, type, req, res);
            break;
        case "POST":
            createTransaction(req, res);
            break;
        default:
            res.status(405).json({ error: "Method Not Allowed" });
            break;
    }
}
