import { NextApiRequest, NextApiResponse } from "next";
import Categories from "../models/category";

// GET - http://localhost:3000/api/categories
export async function getCategories(req: NextApiRequest, res: NextApiResponse) {
  try {
    const categories = await Categories.find({});
    if (!categories) {
      return res.status(404).json({ error: "Categories not found" });
    }
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error while fetching categories:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

