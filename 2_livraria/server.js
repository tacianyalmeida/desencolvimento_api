import "dotenv/config";
import express from "express";
import mysql from "mysql2";
import { v4 as uuidv4 } from "uuid";

const PORT = process.env.PORT;

const app = express();

//Receber dados no formado JSON
app.use(express.json());

//CRIAR conexão com o banco de dados
const conn = mysql.createConnection({  
  host: process.env.MYSQL_HOST, // endereço do servidor Mysql. 
  user: process.env.MYSQL_USER, // O nome do usuario paraa autenticação 
  password: process.env.MYSQL_PASSWORD, //Sen@iDev77!.
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});

//CONECTAR ao BANCO
conn.connect((err) => {
  if (err) {
    console.error(err);
  }
  console.log("MYSQL Conectado!");
  app.listen(PORT, () => {
    console.log("Servidor on PORT " + PORT);
  });
});

app.get("/livros", (request, response) => {
  const sql = /*sql*/ `SELECT * FROM livros`;
  conn.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      response.status(500).json({ err: "Erro ao buscar livros" });
      return;
    }
    const livros = data;
    response.status(200).json(livros);
  });
});

app.post("/livros", (request, response) => {
  const { titulo, autor, ano_publicacao, genero, preco } = request.body;

  //Validações
  if (!titulo) {
    response.status(400).json({ err: "O livro é obrigatório" });
    return;
  }
  if (!autor) {
    response.status(400).json({ err: "O autor é obrigatório" });
    return;
  }
  if (!ano_publicacao) {
    response.status(400).json({ err: "O ano de publicação é obrigatório" });
    return;
  }
  if (!genero) {
    response.status(400).json({ err: "O genero é obrigatório" });
    return;
  }
  if (!preco) {
    response.status(400).json({ err: "O preço é obrigatório" });
    return;
  }

  //verificar se o livro não foi cadastrado
  const checkSql = /*sql*/ `SELECT * FROM livros WHERE titulo = "${titulo}" AND autor = "${autor}" AND ano_publicacao = "${ano_publicacao}"`;
  conn.query(checkSql, (err, data) => {
    if (err) {
      console.error(err);
      response.status(500).json({ err: "Erro ao buscar livros" });
      return;
    }

    if (data.length > 0) {
      response.status(409).json({ err: "Livro já foi cadastrado" });
      return;
    }

    //Cadastrar o livro
    const id = uuidv4();
    const disponibilidade = 1;
    const insertSql = /*sql*/ `INSERT INTO livros
    (livro_id, titulo, autor, ano_publicacao, genero, preco, disponibilidade)
    VALUES
    ("${id}","${titulo}","${autor}","${ano_publicacao}","${genero}","${preco}","${disponibilidade}")
    `;
    conn.query(insertSql, (err) => {
      if (err) {
        console.error(err);
        response.status(500).json({ err: "Erro ao cadastrar livro" });
        return;
      }
      response.status(201).json({ message: "Livro Cadastrado" });
    });
  });
});

//listar 1
app.get("/livros/:id", (request, response) => {
  const { id } = request.params;

  const sql = /*sql*/ `SELECT * FROM livros WHERE livro_id = "${id}" `;
  conn.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      response.status(500).json({ err: "Erro ao buscar livro" });
      return;
    }

    if (data.length === 0) {
      response.status(404).json({ err: "Livro não encontrado" });
      return;
    }

    const livro = data[0];
    response.status(200).json(livro);
  });
});

//atualizar
app.put("/livros/:id", (request, response) => {
  const { id } = request.params;
  const { titulo, autor, ano_publicacao, genero, preco, disponibilidade } =
    request.body;

  //Validações
  if (!titulo) {
    response.status(400).json({ err: "O livro é obrigatório" });
    return;
  }
  if (!autor) {
    response.status(400).json({ err: "O autor é obrigatório" });
    return;
  }
  if (!ano_publicacao) {
    response.status(400).json({ err: "O ano de publicação é obrigatório" });
    return;
  }
  if (!genero) {
    response.status(400).json({ err: "O genero é obrigatório" });
    return;
  }
  if (!preco) {
    response.status(400).json({ err: "O preço é obrigatório" });
    return;
  }

  if (disponibilidade === undefined) {
    response.status(400).json({ err: "A disponibilidade é obrigatório" });
    return;
  }

  const sql = /*sql*/ `SELECT * FROM livros WHERE livro_id = "${id}" `;
  conn.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      response.status(500).json({ err: "Erro ao buscar livro" });
      return;
    }

    if (data.length === 0) {
      response.status(404).json({ err: "Livro não encontrado" });
      return;
    }

    const updateSql = /*sql*/ `UPDATE livros SET 
      titulo = "${titulo}", autor = "${autor}", ano_publicacao = "${ano_publicacao}", genero = "${genero}", preco = "${preco}", disponibilidade = "${disponibilidade}" 
      WHERE livro_id = "${id}"
    `;
    conn.query(updateSql, (err, info) => {
      if (err) {
        console.error(err);
        response.status(500).json({ err: "Erro ao atualizar livro" });
        return;
      }
      console.log(info);
      response.status(200).json({ message: "Livro atualizado" });
    });
  });
});

//Delete
app.delete("/livros/:id", (request, response) => {
  const { id } = request.params;

  const deleteSql = /*sql*/ `DELETE FROM livros WHERE livro_id = "${id}"`;
  conn.query(deleteSql, (err, info) => {
    if (err) {
      console.error(err);
      response.status(500).json({ err: "Erro ao deletar livro" });
      return;
    }

    if (info.affectedRows === 0) {
      response.status(404).json({ err: "Livro não encontrado" });
      return;
    }
    response.status(200).json("Livro Deletado");
  });
});

/*************** ROTAS DE FUNCIONARIOS ****************/
/** tabela (id, nome, cargo, data_contratacao, salario, email, created_at, updated_at)
 * 1º listar todos os funcionarios
 * 2º cadastrar um funcionario (email é único)
 * 3º Listar um funcionário
 * 4º Atualizar um funcionario (não poder ter o email de outro func.)
 * 5º Deletar um funcionario
 */
app.get("/funcionarios", (request, response) => {
  //request, não existe
  const sql = /*sql*/ `SELECT * FROM funcionarios`;
  conn.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      response.status(500).json({ err: "Erro ao listar funcionarios" });
      return;
    }
    const funcionarios = data;
    response.status(200).json(funcionarios);
  });
});
app.post("/funcionarios", (request, response) => {
  const { nome, email, cargo, data_contratacao, salario } = request.body;

  if (!nome) {
    return response.status(400).json({ message: "O nome é obrigatório" });
  }
  if (!email) {
    return response.status(400).json({ message: "O Email é obrigatório" });
  }
  if (!cargo) {
    return response.status(400).json({ message: "O Cargo é obrigatório" });
  }
  if (!data_contratacao) {
    return response
      .status(400)
      .json({ message: "A data de contratação é obrigatório" });
  }
  if (!salario) {
    return response.status(400).json({ message: "O salário é obrigatório" });
  }

  if (!email.includes("@")) {
    return response.status(400).json({ message: "Email faltando @" });
  }
  //1- não existe funcionario com emails iguais
  const sql = /*sql*/ `SELECT * FROM funcionarios WHERE email = "${email}"`;
  conn.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      response.status(500).json({ err: "Erro ao castrar funcionarios" });
      return;
    }
    if (data.length > 0) {
      response.status(409).json({ err: "E-mail já está em uso" });
      return;
    }

    const id = uuidv4();
    const insertSql = /*sql*/ `INSERT INTO funcionarios
    (funcionario_id, nome, email, cargo, data_contratacao, salario)
    VALUES
    ("${id}","${nome}", "${email}", "${cargo}", 
    "${data_contratacao}", "${salario}")
    `;
    conn.query(insertSql, (err) => {
      if (err) {
        console.error(err);
        response.status(500).json({ err: "Erro ao castrar funcionarios" });
        return;
      }
      response.status(201).json({ mesaage: "Usuário cadastrado" });
    });
  });
});

app.put("/funcionarios/:id", (request, response) => {
  const { id } = request.params;
  const { nome, email, cargo, data_contratacao, salario } = request.body;

  if (!nome) {
    return response.status(400).json({ message: "O nome é obrigatório" });
  }
  if (!email) {
    return response.status(400).json({ message: "O Email é obrigatório" });
  }
  if (!cargo) {
    return response.status(400).json({ message: "O Cargo é obrigatório" });
  }
  if (!data_contratacao) {
    return response
      .status(400)
      .json({ message: "A data de contratação é obrigatório" });
  }
  if (!salario) {
    return response.status(400).json({ message: "O salário é obrigatório" });
  }

  if (!email.includes("@")) {
    return response.status(400).json({ message: "Email faltando @" });
  }

  //1º verificar se funcionario existe
  const checkSql = /*sql*/ `SELECT * FROM funcionarios WHERE funcionario_id = "${id}"`;
  conn.query(checkSql, (err, data) => {
    if (err) {
      console.error(err);
      response.status(500).json({ err: "Erro ao procurar funcionarios" });
      return;
    }

    if (data.length === 0) {
      response.status(404).json({ err: "funcionario não encontrado" });
      return;
    }

    //2º - Se o email está disponível
    const checkEmailSql = /*sql*/ `SELECT * FROM funcionarios 
    WHERE email = "${email}" AND funcionario_id != "${id}"
    `;
    conn.query(checkEmailSql, (err, data) => {
      if (err) {
        console.error(err);
        response.status(500).json({ err: "Erro ao procurar funcionarios" });
        return;
      }

      if (data.length > 0) {
        response.status(409).json({ err: "Email já existe" });
        return;
      }

      //3º Atualizar o email
      const updateSql = /*sql*/ ` UPDATE funcionarios SET
        nome = "${nome}", email = "${email}", cargo = "${cargo}",
        data_contratacao = "${data_contratacao}", salario = "${salario}"
        WHERE
        funcionario_id = "${id}"
        `;
      conn.query(updateSql, (err) => {
        if (err) {
          console.error(err);
          response.status(500).json({ err: "Erro ao atualizar funcionarios" });
          return;
        }
        response.status(200).json({ message: "Funcionário atualizado" });
      });
    });
  });
});

app.delete("/funcionarios/:id", (request, response) => {
  const { id } = request.params;
  const sql = /*sql*/ `DELETE FROM funcionarios WHERE funcionario_id = "${id}"`;
  conn.query(sql, (err, info) => {
    if (err) {
      console.error(err);
      response.status(500).json({ err: "Erro ao deletar funcionarios" });
      return;
    }
    if(info.affectedRows){
      response.status(404).json({ err: "Funcinário não encontrado" });
      return;
    }
    response.status(200).json({message: "Funcionario Deletado"})
  });
});
app.get("/funcionarios/:id", (request, response) => {
  const { id } = request.params;
  const sql = /*sql*/ `SELECT * FROM funcionario WHERE funcionario_id = "${id}"`;
  conn.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      response.status(500).json({ err: "Erro ao selecionar funcionarios" });
      return;
    }

    const funcionario = data[0]
    response.status(200).json(funcionario);
  });
});



// 1º listar todos os clientes 
// 2º cadastrar um cliente (email é único)
// 3º listar um cliente 
// 4º Atulizar um cliente (não pode ter email de outro func.)
// 5º Deletar um cliente 

import { response } from "express";
import { appendFile } from "fs";
import { request } from "http";

//ROTA DE CLIENTES

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