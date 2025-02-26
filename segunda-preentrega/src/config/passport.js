import passport from "passport";
import local from 'passport-local'
import { validatePass, hashPassword } from "../utils/bcrypt.js";
import userModel from "../models/users.model.js";
import GithubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import bcrypt from 'bcrypt'

const localStrategy = local.Strategy //definiendo la estrategia a implementar (local)

const JWTStrategy = jwt.Strategy
const extractJWT = jwt.ExtractJwt

const cookieExtractor = (req)=>{
    let token = null

    if(req.cookies){
        token = req.cookies['coderSession']//consulto especificamente estas cookies generadas con JWT
    }
    return token
}

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

    passport.use(
        "login",
        new localStrategy(
          { usernameField: "email" },
          async (email, password, done) => {
            try {
              const user = await userModel.findOne({ email });
      
              if (!user) {
                return done(null, false, { message: "Usuario o contraseña incorrectos" });
              }
      
              const isValid = await bcrypt.compare(password, user.password);
              if (!isValid) {
                return done(null, false, { message: "Usuario o contraseña incorrectos" });
              }
      
              return done(null, user);
            } catch (error) {
              return done(error);
            }
          }
        )
      );


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

        passport.use('jwt',new JWTStrategy({
            jwtFromRequest:extractJWT.fromExtractors([cookieExtractor]),
            secretOrKey:'coder1234'
        },async(jwt_payload,done)=>{
            console.log("JWT Payload recibido:", jwt_payload);
            try {
                console.log(jwt_payload);
                return done(null,jwt_payload)
            } catch (error) {
                return done(error)
            }//consulto mi cookie y ya la puedo implementar
           
        }))//quiere decir que mi token lo saco de mi cookie extractor

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