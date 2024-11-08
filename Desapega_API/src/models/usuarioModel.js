import conn from "../config/conn.js";

const tabelaUsuario = /*sql*/`
CREATE TABLE IF NOT EXISTS usuarios(
    usuario_id VARCHAR(60) PRIMARY KEY, 
    nome VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL,
    telefone VERCHAR(50) NOT NULL, 
    senha VARCHAR(255) NOT NULL, 
    imagem VARCHAR(255) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
)`

conn.query(tabelaUsuario, (err, results, fields)=>{
    if(err){
        console.error(err)
        return
    }
    console.log("Tabela [usuarios] criada com sucesso!")
})

// const tabelaProduto = /*sql*/`
// CREATE TABLE IF NOT EXISTS produtos(
//     nome VARCHAR(255) NOT NULL, 
//     descricao VARCHAR(600) NOT NULL, 
//     tipo VARCHAR(100), 
//     produto_id VARCHAR(60) PRIMARY KEY 
// )`