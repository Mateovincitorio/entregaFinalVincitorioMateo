import jwt from 'jsonwebtoken'

let secretKey="coder1234"

export const generateToken= (user)=>{
    /*param 1 = obj a almacenar(user) 
    param 2 = password
    param 3 = time to live
    */

    const  token = jwt.sign({
        first_name:user.first_name,
        email:user.email,
        rol:user.rol
    },secretKey,{expiresIn:'24h'})
    return token
}