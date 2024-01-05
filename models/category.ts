import { Schema, model, models } from "mongoose";

const categorySchema = new Schema({
  id: Number,
  name: String,
  type: String
});

const Category = models.Category || model("Category", categorySchema, "categories");
export default Category;
