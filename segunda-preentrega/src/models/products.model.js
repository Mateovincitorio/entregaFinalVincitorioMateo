import mongoose from 'mongoose'
const { Schema, model } = mongoose;
import mongoosePaginateV2 from 'mongoose-paginate-v2'

const ProductsCollections = 'products';

const productSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    code:{
        type: Number,
        require: true,
    },
    price:{
        type: Number,
        require: true,
    },
    status:{
        type: String,
        require: true,
    },
    stock:{
        type: Number,
        require: true,
    },
    category:{
        type: String,
        require: true,
    }
})

productSchema.plugin(mongoosePaginateV2)

export const productsModel = model(ProductsCollections,productSchema)