import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
import cartsModel from "./cart.model.js";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    rol: {
        type: String,
        default: "Usuario"
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    }
});

userSchema.post('save', async function (userCreated) {
    try {
        const newCart = await cartsModel.create({ products: [] }); // Crea un nuevo carrito
        await model("users").findByIdAndUpdate(userCreated._id, {
            cart: newCart._id
        }); // Actualiza el usuario con el nuevo carrito
    } catch (error) {
        console.log(error);
    }
});

export default model('users', userSchema);
