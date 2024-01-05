import { NextApiRequest, NextApiResponse } from "next";
import Subcategories from "../models/subcategory";
import Category from "@/models/category";

// GET - http://localhost:3000/api/subcategories
export async function getSubcategories(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { type }: { type?: 'income' | 'outcome' } = req.query;

    let subcategories: any = [];

    if (type) {
      subcategories = await Subcategories.find({}).populate("categoryId", "name type", Category);
      subcategories = subcategories.filter((sub: any) => sub.categoryId && sub.categoryId.type === type);
    } else {
      subcategories = await Subcategories.find({}).populate("categoryId", "name type", Category);
    }

    if (!subcategories || subcategories.length === 0) {
      return res.status(404).json({ error: "Subcategories not found" });
    }
    res.status(200).json(subcategories);
  } catch (error) {
    console.error('Error while fetching subcategories:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// POST - http://localhost:3000/api/subcategories
export async function createSubcategory(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, categoryId, userId } = req.body;

    // Create the subcategory
    const newSubcategory = await Subcategories.create({
      name, categoryId, userId
    });

    res.status(201).json(newSubcategory);
  } catch (error) {
    console.error('Error while creating subcategory:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

