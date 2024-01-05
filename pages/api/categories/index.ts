import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/database/connection";
import { getCategories } from "@/controllers/categories.controller";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    connectMongo().catch(() =>
        res.status(405).json({ error: "Error in db connection" })
    );

    const { method } = req;
    switch (method) {
        case "GET":
            getCategories(req, res);
            break;
    }
}