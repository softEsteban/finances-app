import { Schema, Types, model, models } from "mongoose";

const subcategorySchema = new Schema({
  id: Number,
  name: String,
  categoryParent: Number,
  categoryId: { type: Types.ObjectId, ref: 'Category' }
});

const Subcategory = models.Subcategory || model("Subcategory", subcategorySchema, "subcategories");
export default Subcategory;
