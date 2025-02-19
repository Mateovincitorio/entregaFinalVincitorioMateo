import userModel from '../models/users.model.js'
import { validatePass, hashPassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';

export const login = async (req, res) => {
    try {
        if(!req.user)
            return res.status(400).send('usuario o contraseña no valida')
//sesion de BDD
        req.session.user = {
            email: req.user.email,
            rol: req.user.rol,
            first_name: req.user.first_name,
        }

        //retorna un token de jwt
        return res.status(200).cookie(
            'coderSession',generateToken(req.user),{
                httpOnly:true,
                secure:false, //evita errores en https
                maxAge:8640000 //un dia en segundos
            }
        ).send('usuario logueado correctamente')

    } catch (error) {
        console.error("Error en el login:", error);
        return res.status(500).send("Error en el servidor");
    }
};


export const register = async(req,res)=>{
    try{
        if(!req.user)
            return res.status(400).send('email y contraseña son obligarorios')

        return res.status(200).send('usuario registrado correctamente')
        
    }catch(error){
        console.log(error);
    }
}

export const githubLogin = (req,res)=>{
    try {
        req.session.user = {
            email: req.user.email,
            rol: req.user.rol,
            first_name: req.user.first_name
        }
        return res.status(200).cookie(
            'coderSession',generateToken(req.user),{
                httpOnly:true,
                secure:false, //evita errores en https
                maxAge:8640000 //un dia en segundos
            }
        ).send('usuario logueado correctamente')
    } catch (error) {
        res.status(500).send(e)
    }
}