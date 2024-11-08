
import "dotenv/config"
import express from "express"
import { request } from "http";
import mysql from "mysql2"
import { v4 as uuidv4 } from "uuid";

const PORT = process.env.PORT


const app = express()


app.use(express.json())

const conn = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,//Sen@iDev77!.
    database: process.env.MYSQL_DATABASE,
    port: process.env.PORT
})
conn.connect((err) => {
    if (err) {
        console.error(err)
    }
    console.log("MYSQL conectado")
    app.listen(PORT, () => {
        console.log("Servidor on PORT" + PORT)
    })
})

app.get("/funcionarios", (request, response) => {
    const sql = /*sql*/ `SELECT * FROM funcionarios`;
    conn.query(sql, (err, data) => {
        if (err) {
            console.error(err);
            response.status(500).json({ err: "Erro ao listar funcionarios" })
            return
        }
        const funcionarios = data
        response.status(200).json(funcionarios)

    })
});


app.post("/funcionarios", (request, response) => {
    const { nome, email, cargo, data_contratacao, salario } = request.body

    if (!nome) {
        return response.status(400).json({ message: "O nome é obrigatorio" })
    }
    if (!email) {
        return response.status(400).json({ message: "O email é obrigatorio" })
    }
    if (!data_contratacao) {
        return response.status(400).json({ message: "A data de contratacao é obrigatorio" })
    }
    if (!salario) {
        return response.status(400).json({ message: "O salario é obrigatorio" })
    }
    if (!email.includes("@")) {
        return response.status(400).json({ message: "Email faltando @" })
    }
    const sql = /*sql*/ `SELECT * FROM funcionarios email = "${email}"`
    conn.query(sql, (err, data)=>{
        if(err){
            console.error(err);
            response.status(500).json({ err: "Erro ao listar funcionarios" })
            return
        }
        if(data.len){

        }

        const id = uuidv4()
        const insertSql = /*sql*/ `INSERT INTO funcionarios 
        (funcionario_id, nome, email, cargo, data_contratacao, salario)
        VALUES
        ("${id}", "${nome}", "${email}", "${cargo}", "${data_contratacao}", "${salario}")
        `
        conn.query(insertSql, (err)=>{
            if(err){
                console.error(err);
                response.status(500).json({ err: "Erro ao cadastrar usuario" })
                return
            }

            
        })
    })
});


app.put("/funcionarios/:id", (request, response) => {
if(data.length === 0){
    response.status(404).json({err: "funcionarios não encontrado"})
   return
}
const checkEmailSql = /*sql*/ `SELECT * FROM funcionarios WHERE email = "${email} AND id != "${id}"`

conn.query(checkEmailSql, (err, data)=>{
  if(err){
    console.error(err);
    response.status(500).json({err: "Erro ao procurar funcionarios"})
    return  
}  

if(data.length > 0){
response.status(409).json({err: "Email já existe"}); 
return
}

//3º atualizar o email 

const updateSql = /*sql*/ ` UPDATE funcionarios SET 
nome = "${nome}", email = "${email}", cargo = "${cargo}", 
data_contratacao 
`
})


});


app.delete("/funcionarios", (request, response) => {

});


app.get("/funcionarios", (request, response) => {
const {id} = request.params 
const sql = /*sql*/ `SELECT * FROM funcionario WHERE funcionario_id = "${id}" `
conn.query(sql, (err, data)=>{
if(err){
console.error(err);
response.status(500).json({err: ""})
}
})
}); 