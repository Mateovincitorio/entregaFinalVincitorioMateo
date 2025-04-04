import mongoose from 'mongoose'
const { Schema, model } = mongoose;

const cartSchema = new Schema({
    products: {
        type:[
            {
                id_prod: {
                    type: Schema.Types.ObjectId,
                    ref: 'products',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true 
                }
            }
        ],
    default:[]
    }
})

cartSchema.pre('findOne', function () {
    this.populate('products.id_prod');
  });

const cartsModel = model('carts',cartSchema)

export default cartsModel;
