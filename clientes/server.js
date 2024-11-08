import "dontenv/config";
import express from "express";
import mysql from "mysql2";
import { v4 as uuidv4 } from "uuid"; 



// 1º listar todos os clientes 
// 2º cadastrar um cliente (email é único)
// 3º listar um cliente 
// 4º Atulizar um cliente (não pode ter email de outro func.)
// 5º Deletar um cliente 

import { response } from "express";
import { appendFile } from "fs";
import { request } from "http";

const PORT = process.env.PORT; 
const app = express();

app.use(express.json()); 



app.get("/clientes",(request, response)=>{


});

app.post("/clientes", (request, response)=>{

})

app.get("/clientes/id", (request, response)=>{

})

app.put("/clientes/id", (request, response)=>{

})
app.delete("/clientes/id", (request, response)=>{

})