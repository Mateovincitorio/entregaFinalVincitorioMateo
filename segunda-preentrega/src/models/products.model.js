import mongoose from "mongoose";
const { Schema, model } = mongoose;
import mongoosePaginateV2 from "mongoose-paginate-v2";

const ProductsCollections = "products";

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  thumbnail: {
    default: [],
  },
});

productSchema.plugin(mongoosePaginateV2);

export const productsModel = model(ProductsCollections, productSchema);
