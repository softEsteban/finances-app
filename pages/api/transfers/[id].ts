import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/database/connection";
import { deleteAccount, updateAccount } from "@/controllers/accounts.controller";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectMongo();
    } catch (error) {
        return res.status(405).json({ error: "Error in db connection" });
    }

    const { method, query } = req;
    const accountId = query.id;
    switch (method) {
        case "PUT":
            updateAccount(accountId as any, req, res);
            break;
        case "DELETE":
            deleteAccount(accountId as any, req, res);
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method}`);
            break;
    }
}
