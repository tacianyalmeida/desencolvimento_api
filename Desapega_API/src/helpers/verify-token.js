import { response } from "express";
import { request } from "http";
import jwt  from "jsonwebtoken";


const verifyToken = (request, response, next) => {
if(!request.headers.authorization){
    response.status(401).json({message:"Acesso negado"});
    return; 
}


//buscar o usuario que esta logado

const token = getToken(request)
if(!token){
    response.status(401).json({message:"Acesso negado"});
    return; 
}
try{
    const verificado = jwt.verify(token, "SENHASUPERSEGURA")
    request.usuario = verificado; 
}catch(error) {
       return response.status(400).json({message:"Token Inválido"});
 

}

next();
};

export default verifyToken; 