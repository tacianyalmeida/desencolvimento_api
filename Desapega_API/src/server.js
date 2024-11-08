import "dotenv/config"
import express, { response } from "express"
import { request } from "http"
import cors from "cors"
//Importar a conexao com o banco
import conn from "./config/conn.js"
//Importar as rotas 

import usuarioRouter from "./routes/usuarioRouter.js"
import objetoRouter from "./routes/objetoRouter.js"
import path from "node:path";
import { fileURLToPath } from "node:url";


import "./models/objetoModel.js"
import "./models/objetoImagesModel.js"
const PORT = process.env.PORT || 3883

const app = express()
//Apontar para pasta public 
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//3 middleware 

app.use(cors())
app.use(express.urlencoded({extended:true})) // pernite receber arquivos do tipo imagem 
app.use(express.json())

console.log("filename:", __filename)
console.log("dirname:", __dirname)


//Pasta para os arquivos estáticos 
app.use("/public", express.static(path.join(__dirname, "public"))) // configurando meu arquivo server para receber as imagens



//Utilizar as rotas 
app.use("/usuarios", usuarioRouter)
app.use("/objetos", objetoRouter)

app.use((request, response)=>{
    response.status(404).json({message:"Rota não encontrada"})
})



app.listen(PORT,()=>{
    console.log(`Servidor on port ${PORT}`)
})

