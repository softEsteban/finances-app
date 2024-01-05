import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/database/connection";
import { createSubcategory, getSubcategories } from "@/controllers/subcategories.controller";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    connectMongo().catch(() =>
        res.status(405).json({ error: "Error in db connection" })
    );

    const { method } = req;
    switch (method) {
        case "GET":
            getSubcategories(req, res);
            break;
        case "POST":
            createSubcategory(req, res);
    }
}