import mongoose from 'mongoose'
const { Schema, model } = mongoose;

const cartSchema = new Schema({
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products',
            required: true
        },
        quantity: { type: Number, required: true, default: 1 }
    }],
    default:[]
})

cartSchema.pre(/^find/, function () {
    this.populate('products.product');
  });

const cartsModel = model('carts',cartSchema)

export default cartsModel;
