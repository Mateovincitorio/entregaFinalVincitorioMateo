//import { userModel } from "../models/users.model.js";
import userModel from "../models/users.model.js";


export const getUsers = ('/', async(req, res)=>{
    try{
        const users = await userModel.find();
        res.send(users)
    }catch(error){
        console.log(error);
    }
});

export const getUser = ('/:uid', async(req, res)=>{
    try{
        const uid = req.params.uid
        const user = await userModel.findById(uid);
        res.send(user)
    }catch(error){
        console.log(error);
    }
})

export const postUsers = ('/', async(req, res)=>{
    try{
        const {first_name, last_name, email, password, age} = req.body;
        const user = await userModel.create({first_name, last_name, email, password, age});
        res.send(`Usuario creado con el id: ${user?.id}`)
    }catch(error){
        console.log(error);
    }
})

export const putUser = ('/:uid', async(req, res)=>{
    try{
        const uid = req.params.uid;
        const {first_name, last_name, email, password, age} = req.body;
        const user = await userModel.findByIdAndUpdate(uid, {first_name, last_name, email, password, age});
        res.send(`Usuario actualizado con el id: ${user?.id}`)
    }catch(error){
        console.log(error);
    }
})

export const deleteUsers = ('/:uid', async(req, res)=>{
    try{
        const uid = req.params.uid;
        const user = await userModel.findByIdAndDelete(uid);
        res.send(`usuario con id "${user?.id}" eliminado`, user)
    }catch(error){
        console.log(error);
    }
})
