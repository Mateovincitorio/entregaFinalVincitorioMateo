import dotenv from 'dotenv';
import passport from "passport";
import local from 'passport-local'
import { validatePass, hashPassword } from "../utils/bcrypt.js";
import userModel from "../models/users.model.js";
import GithubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import bcrypt from 'bcrypt'

dotenv.config();

const localStrategy = local.Strategy //definiendo la estrategia a implementar (local)

const JWTStrategy = jwt.Strategy
const extractJWT = jwt.ExtractJwt

const cookieExtractor = (req) => {
    
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderSession'];
    } else {
        console.log("No se encontraron cookies en la solicitud.");
    }

    return token;
};


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


      passport.use(
        'github',
        new GithubStrategy(
            {
                clientID: "Iv23liLtzLI1rf3zJZzj",
                clientSecret: "b733d01aca1ca232e285f7e4233b4f51a6e06501",
                callbackURL: "http://localhost:8080/api/sessions/githubcallback",
                scope: ['user:email'] // Asegura que GitHub proporcione el email
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log("Perfil de GitHub recibido:", profile);
    
                    let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    
                    if (!email) {
                        return done(new Error("GitHub no proporcionó un email"), null);
                    }
    
                    let user = await userModel.findOne({ email });
    
                    if (!user) {
                        user = await userModel.create({
                            first_name: profile.displayName || "Usuario de GitHub",
                            last_name: " ",
                            email,
                            password: hashPassword("coder"), // Contraseña por defecto
                            age: 18 // Edad por defecto
                        });
                    }
    
                    return done(null, user);
                } catch (error) {
                    console.error("Error en GitHub OAuth:", error);
                    return done(error, null);
                }
            }
        )
    );
    

        passport.use('jwt',new JWTStrategy({
            jwtFromRequest:extractJWT.fromExtractors([cookieExtractor]),
            secretOrKey:process.env.SECRETKEY
        },async(jwt_payload,done)=>{
            try {
                
                return done(null,jwt_payload)
            } catch (error) {
                return done(error)
            }//consulto mi cookie y ya la puedo implementar
           
        }))//quiere decir que mi token lo saco de mi cookie extractor

        //PASOS NECESARIOS PARA GENERAR UNA SESION Y MANEJARNOS VIA HTTP

        passport.serializeUser((user, done) => {
            if (!user || !user._id) {
                return done(new Error("Usuario inválido"));
            }
            done(null, user._id);
        });
        
        passport.deserializeUser(async (id, done) => {
            try {
                const user = await userModel.findById(id);
                if (!user) {
                    return done(new Error("Usuario no encontrado"));
                }
                done(null, user);
            } catch (error) {
                done(error);
            }
        });
        
}

export default initializatePassword