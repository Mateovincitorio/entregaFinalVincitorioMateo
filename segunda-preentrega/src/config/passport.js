import passport from "passport";
import local from 'passport-local'
import { validatePass, hashPassword } from "../utils/bcrypt.js";
import userModel from "../models/users.model.js";
import GithubStrategy from 'passport-github2'

const localStrategy = local.Strategy //definiendo la estrategia a implementar (local)

const initializatePassword = () =>{
    passport.use('register',new localStrategy({
        passReqToCallback:true,
        usernameField:'email'
    },async(req,username,password,done)=>{
        try{
                const {
                    first_name,
                    last_name,
                    email,
                    password:plainPassword,
                    age
                } = req.body;

                const newUser = await userModel.create({
                    first_name:first_name,
                    last_name:last_name,
                    email:email,
                    password:hashPassword(plainPassword),
                    age:age
                    });
                        return done(null,newUser)//se ejecuto correctamente y envio al usuario creado
            }catch(error){
                return done(error)
            }
    }))

    passport.use('login', new localStrategy({
        usernameField:'email'}, async(username,password,done)=>{
             try {
                    /*const { email, password } = req.body;*/
                    const user = await userModel.findOne({ email:username });
                    if (!user) {
                        return res.status(401).send("Usuario o contraseña incorrectos");
                    }
            
                    // Si todo está bien, guardar la sesión
                    if(validatePass(password,user?.password)){
                        return done(null, user)
                    }else{
                        return done(null, false)//no hubo ningunn error pero no se pudo loguear
                    };
                } catch (error) {
                    done(error)
                }
        }))


        passport.use('github',new GithubStrategy({
            clientID:"Iv23liLtzLI1rf3zJZzj",
            clientSecret:"b733d01aca1ca232e285f7e4233b4f51a6e06501",
            callbackUrl:"http://localhost:8080/api/sessions/githubcallback"

        },async(accessToken, refreshToken,profile,done)=>{
            try {
                let user = await userModel.findOne({email: profile._json.email})

                if(!user){//si no existe lo creo
                    user = await userModel.create({
                        first_name: profile._json.name,
                        laste_name:"",
                        email:profile._json.email,
                        password:hashPassword("coder"),//por defecto
                        age:18 //por defecto
                     })
                }
                    done(null,user)//si existe lo logueo
                
            } catch (error) {
                
            }
        }))
        //PASOS NECESARIOS PARA GENERAR UNA SESION Y MANEJARNOS VIA HTTP

        passport.serializeUser((user,done)=>{
            done(null,user._id)
        })

        passport.deserializeUser(async(id,done)=>{
            const user = await userModel.findById(id)
            done(null,user)
        })
}

export default initializatePassword