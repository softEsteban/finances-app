import { getUserById, deleteUserById } from "../../../controllers/users.controller"
import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/database/connection";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    connectMongo().catch(() =>
        res.status(405).json({ error: "Error in db connection" })
    );
    const { method } = req;
    const userId = req.query.id;
    switch (method) {
        case "GET":
            getUserById(userId as any, req, res);
            break;
        case "DELETE":
            deleteUserById(userId as any, req, res);
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method}`);
            break;
    }
}
