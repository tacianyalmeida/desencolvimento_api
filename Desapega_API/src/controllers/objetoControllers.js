import { response } from "express";
import { request } from "http";
import conn from "../config/conn.js";
import { v4 as uuidv4 } from "uuid";
import getToken from "../helpers/get.token.js";
import getUserByToken from "../helpers/get-user-by-token.js";





export const create = async (request, response) => {
    const { nome, categoria, peso, cor, descricao, preco } = request.body;
    const disponivel = 1

    const token = getToken(request)
    const usuario = await getUserByToken(token)
    //buscar o token do usuario 
    if (!nome) {
        response.status(400).json({ message: "O  é obrigatorio" });
        return;
    }
    if (!categoria) {
        response.status(400).json({ message: "A categoria é obrigatorio" });
        return;
    }

    if (!cor) {
        response.status(400).json({ message: "A cor  é obrigatorio" });
        return;
    }

    if (!peso) {
        response.status(400).json({ message: "O peso é obrigatorio" });
        return;
    }

    if (!descricao) {
        response.status(400).json({ message: "A descricao é obrigatorio" });
        return;
    }

    if (!preco) {
        response.status(400).json({ message: "O Preco é obrigatorio" });
        return;
    }


 const objeto_id = uuidv4() 
 const usuario_id = usuario.usuario_id
 const objetoSql = /*sql*/` INSERT INTO objetos (??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

const objetoData = [
    "objeto_id", 
    "nome", 
    "categoria", 
    "peso",
    "cor",
    "descricao",
    "disponivel",
    "preco",
    "usuario_id",

    objeto_id, 
    nome, 
    categoria, 
    peso,
    cor,
    descricao,
    disponivel,
    preco,
    usuario_id
]
conn.query(objetoSql, objetoData, (err)=>{
    if(err){
        console.error
            response.status
        response.status(500).json({message: "Erro ao adicionar objeto"});
        return;
    }

    if(request.file){
    const insertImageSql =/*sql*/ `INSERT INTO objeto_images (image_id, image_path, objeto_id) VALUES ?`
    
const imageValues = request.file.map((file)=>[ 
    uuidv4(),
    file.filename,
    objeto_id
    
    ])
conn.query(insertImageSql, [imageValues], (err)=>{
    if(err){
        console.error(err)
        response.status(500).json({err: "Nao foi possivel adicionar imagens ao objeto"})
        return
    }
    response.status(201).json({message: "Objeto criado com sucesso!"})

})
}else{
        response.status(201).json({message:"Objeto criado com sucesso!"})
    }
})

    response.status(200).json("Chegou aqui ")
}


//Listar todos os objetos de um usuario 

export const getAllObjectUser = (request, response) =>{
    try{
        const token = getToken(request)
        const usuario = getUserByToken(token)

        const usuarioId = usuario.usuario_id 

        const selectSql =/*sql*/`
        SELECT obj.objeto_id,
        obj.usuario_id, 
        obj.nome,
        obj.categoria,
        obj.peso,
        obj.cor,
        obj.descricao,
        obj.preco, 
        GROUP_CONCAT(obj_img.image_path SEPARATOR ',') AS image_paths 
        FROM 
        objetos AS obj LEFT JOIN 
        objeto_images AS obj_img ON obj.objeto_id = obj_img.objeto_id 
        WHERE 
        obj.usuario_id = ?
        GROUP BY 
        obj.objeto_id, obj.usuario_id, obj.nome, obj.categoria, obj.descricao, obj.preco
        `

        conn.query(selectSql, [usuarioId], (err, data)=>{

        })
    }catch (error){
        
    }
}