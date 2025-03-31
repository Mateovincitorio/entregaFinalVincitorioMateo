import mongoose from 'mongoose'
const { Schema, model } = mongoose;



const ticketCollection = 'tickets';

const tickeSchema = new Schema({
    code:{
        type:String,
        unique:true,
        required:true
    },
    purchase_datatime:{
        type:Date,
        default:Date.now
    },
    amount:{
        type:Number,
        required:true
    },
    purchaser:{
        type:String,
        required:true
    },
    products:{
        type:Object
    }
})

const ticketModel = model("ticket",tickeSchema)
export default ticketModel

