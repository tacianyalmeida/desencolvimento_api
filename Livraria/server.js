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
//CONECTAR AO BANCO DE DADOS
conn.connect((err) => {
    if (err) {
        console.error(err)
    }
    console.log("MYSQL conectado")
    app.listen(PORT, () => {
        console.log("Servidor on PORT" + PORT)
    })
})


app.get('/livros', (request, response) => {

    const sql = /*sql*/ `SELECT * FROM livrosapi`
    conn.query(sql, (err, data) => {
        if (err) {
            console.error(err)
            response.status(500).json({ err: "Erro so buscar livros " })
            return
        }

        response.status(200).json(data)
    })

})

app.post("/livros", (request, response) => {
    const { titulo, autor, ano_publicacao, genero, preco } = request.body

    if (!titulo) {
        response.status(400).json({ err: "o titulo é obrigatorio" })
        return
    }

    if (!autor) {
        response.status(400).json({ err: "o autor é obrigatorio" })
        return
    }

    if (!ano_publicacao) {
        response.status(400).json({ err: "o ano_publicacao é obrigatorio" })
        return
    }

    if (!genero) {
        response.status(400).json({ err: "o genero é obrigatorio" })
        return
    }

    if (!preco) {
        response.status(400).json({ err: "o preco é obrigatorio" })
        return;
    }
    const checksql = /*sql*/ `SELECT * FROM livros WHERE titulo = "${titulo} AND autor = "${autor} AND ano_publicacao = ${ano_publicacao}"`
    conn.query(checksql, (err, data) => {
        if (err) {
            console.error(err)
            response.status(500).json({ err: "Erro so buscar livros " })
            return;
        }
        const id = uuidv4()
        const disponibilidade = 1
        const insertSql =/*sql*/ `INSERT INTO livros (livro_id, titulo, autor, ano_publicaca, genero, preco, disponibilidade) VALUES("${id}", "${titulo}", "${ano_publicacao}", "${genero}", "${preco}", "${disponibilidade}")`;

        conn.query(insertSql, (err) => {
            if (err) {
                console.error(err)
                response.status(500).json({ err: "erro ao cadastrar livro" })
                return
            }
            response.status(201).json({ message: "livro Cadastrado" })
        })



    })

});

app.get("/livros/:id", (request, response) => {
    const { id } = request.params

    const sql = /*sql*/ `SELECT * FROM livros WHERE  livros_id = "${id}"`;
    conn.query(sql, (err, data) => {
        if (err) {
            console.error(err)
            response.status(500).json({ err: "erro ao buscar livro" })
            return
        }
        if (data.length === 0) {
            response.status(404).json({ err: "livro não encontrado" })
            return
        }

        const livro = data[0]
        response.status(200).json(livro)
    })
});

app.put("/livros/:id", (request, response) => {
    const { id } = request.params
    const { titulo, autor, ano_publicacao, genero, preco, disponibilidade } = request.body

    if (!titulo) {
        response.status(400).json({ err: "o titulo é obrigatorio" })
        return
    }

    if (!autor) {
        response.status(400).json({ err: "o autor é obrigatorio" })
        return
    }

    if (!ano_publicacao) {
        response.status(400).json({ err: "o ano_publicacao é obrigatorio" })
        return
    }

    if (!genero) {
        response.status(400).json({ err: "o genero é obrigatorio" })
        return
    }

    if (!preco) {
        response.status(400).json({ err: "o preco é obrigatorio" })
        return;
    }

    if (disponibilidade === undefined) {
        response.status(400).json({ err: "A disponibilidade é obrigatorio" })
        return;
    }

    const sql = /*sql*/ `SELECT * FROM livros WHERE  livros_id = "${id}"`;
    conn.query(sql, (err, data) => {
        if (err) {
            console.error(err)
            response.status(500).json({ err: "erro ao buscar livro" })
            return
        }
        if (data.length === 0) {
            response.status(404).json({ err: "livro não encontrado" })
            return
        }


        const updateSql = /*sql*/`UPDATE livros SET titulo = "${titulo}", autor = "${autor}", ano_publicacao = "${ano_publicacao}", genero = "${genero}" preco = "${preco}", disponibilidade = "${disponibilidade}" WHERE livro_id = "${id}`
        conn.query(updateSql, (err, info) => {
            if (err) {
                console.error(err)
                response.status(500).json({ err: "Erro ao atualizar livro" })
                return
            }
            console.log(info)
            response.status(200).json({ message: "Livro atulizado" })
        })
    })
});


//delete 
app.delete("/livros/:id", (request, response) => {
const deleteSql = /*sql*/`DELETE FROM livros WHERE livro_id = "${id}"`
conn.query(deleteSql, (err, info)=>{
    if (err) {
        console.error(err)
        response.status(500).json({ err: "Erro ao deletar livro" })
        return
    }
    if(info.affectedRows === 0){
     response.status(404).json({err: "livro não encontrado"})
     return
    }
    response.status(200).json({ message: "Livro Deletado" })
})
});


