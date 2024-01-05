import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/database/connection";
import { deleteTransaction, getTransactionById, updateTransaction } from "@/controllers/transactions.controller";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectMongo();
    } catch (error) {
        return res.status(405).json({ error: "Error in db connection" });
    }

    const { method, query } = req;
    const transactionId = query.id;
    switch (method) {
        case "GET":
            getTransactionById(transactionId as any,req, res);
            break;
        case "PUT":
            updateTransaction(transactionId as any, req, res);
            break;
        case "DELETE":
            deleteTransaction(transactionId as any, req, res);
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method}`);
            break;
    }
}
