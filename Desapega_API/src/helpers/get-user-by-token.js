import { response } from "express"
import conn from "../config/conn.js"

const getUserByToken = async (token) =>{
    return new Promise((resolve, reject)=>{
        if(!token){
            response.status(401).json({message: "Acesso Negado"})
            return
        }
        const decoded = jwt.verify(token, "SENHASUPERSEGURA")
        const userId = decoded.id
        const checkSql = /*sql*/`SELECT * FROM usuarios WHERE ?? = ?`
        const checkslqData = ["usuarios_id", userId]; 
        conn.query(checkSql, checkslqData, (err, data) =>{
            if(err){
                reject({status: 500, message: "Erro ao buscar usuario"});
            }else{
                resolve(data[0]); 
            }
        })
    })
}

export default getUserByToken