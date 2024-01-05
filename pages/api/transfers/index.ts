import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/database/connection";
import { createAccount, getAccounts } from "@/controllers/accounts.controller";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectMongo();
    } catch (error) {
        return res.status(405).json({ error: "Error in db connection" });
    }

    const { method, query } = req;
    switch (method) {
        case "GET":
            const { userId } = query;
            getAccounts(userId, req, res);
            break;
        case "POST":
            createAccount(req, res);
            break;
        default:
            res.status(405).json({ error: "Method Not Allowed" });
            break;
    }
}
