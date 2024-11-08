import conn from "../config/conn.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { request } from "http";
import { response } from "express";
import createUserToken from "../helpers/create-user-token.js"
import getToken from "../helpers/get.token.js";
import jwt from "jsonwebtoken";



export const register = async (request, response) => {
    const { nome, email, telefone, senha, confirmarsenha } = request.body

    if (!nome) {//validação dos campo vazio
        response.status(400).json({ message: "O nome é obrigatorio" });
        return;
    }

    if (!email) {//validação dos campo vazio
        response.status(400).json({ message: "O email é obrigatorio" });
        return;
    }

    if (!telefone) {//validação dos campo vazio
        response.status(400).json({ message: "O telefone é obrigatorio" });
        return;
    }

    if (!senha) {//validação dos campo vazio
        response.status(400).json({ message: "A senha é obrigatorio" });
        return;
    }

    if (!confirmarsenha) {//validação dos campo vazio
        response.status(400).json({ message: "O campo confirmar senha é obrigatorio" });
        return;
    }

    if (!email.includes("@")) {//Verificar se o email é valido 
        response.status(409).json({ message: "Deve conter @ no email " });
        return;
    }
    if (senha !== confirmarsenha) { // Senha === ConfirmarSenha 
        response.status(409).json({ message: "A senha e a confirmaçao de senha devem ser iguais " });
        return;
    }
    const checkslq = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ?`
    const checkslqData = ["email", email]

    // trata erros de sintaxe 
    conn.query(checkslq, checkslqData, async (err, data) => {
        if (err) {
            console.log(err)
            response.status(500).json({ err: "Erro ao buscar email para cadastro" })
            return
        }
        // Ja te email cadastrado? 
        if (data.length > 0) {
            response.status(409).json({ err: "O email já esta em uso" })
            return
        }
        //Posso fazer registro
        const salt = await bcrypt.genSalt(12)
        console.log(salt)
        const senhaHash = await bcrypt.hash(senha, salt)


        const id = uuidv4();
        const usuario_img = "userDefault.png"
        const insertSql = /*sql*/`INSERT INTO usuarios (??, ?? ,?? , ??, ??, ??)VALUES(?, ?, ?, ?, ?, ?)`
        const insertSqlData = ["usuario_id",
            "nome",
            "email",
            "telefone",
            "senha",
            "imagem",
            id,
            nome,
            email,
            telefone,
            senhaHash,
            usuario_img,
        ];
        conn.query(insertSql, insertSqlData, (err) => {
            if (err) {
                console.log(err)
                response.status(500).json({ err: "Erro ao cadastrar usuário" });
                return;
            }
            const usuarioSql = /*sql*/`SELECT * FROM usuarios WHERE ?? = ?`
            const usuarioData = ["usuario_id", id]
            conn.query(usuarioSql, usuarioData, async (err, data) => {
                if (err) {
                    response.status(500).json({ err: "Erro ao fazer login" })
                    return
                }
                const usuario = data[0]
                const compararSenha = await bcrypt.compare(senha, usuario.senha)
                console.log("Compara senha:", compararSenha)
                if (!compararSenha) {
                    response.status(401).json({ message: "Senha invalida" })
                }

                try {
                    await createUserToken(usuario, request, response)
                } catch (error) {
                    console.error(error)
                    response.status(500).json({ err: "Erro ao processar requisição" })

                }
            })


            response.status(201).json({ message: "Usuario cadastrado" });
        })

    })
};

export const login = (request, response) => {
    const { email, senha } = request.body;
    if (!email) {
        response.status(400).json({ message: "O email é obrigatorio" });
        return;
    }
    if (!senha) {
        response.status(400).json({ message: "O senha é obrigatorio" });
        return;
    }
    const checkEmailSql = /*sql*/`SELECT * FROM usuarios WHERE ?? = ?`
    const checkEmailData = ["email", email]
    conn.query(checkEmailData, checkEmailSql, async (err, data) => {
        if (err) {
            console.error(err)
            response.status(500).json({ message: "Erro ao fazer login" });
            return;
        }
        if (data.length === 0) {
            response.status(500).json({ message: "Email não esta cadastrado" });
            return
        }
        const usuario = data[0]
        console.log(usuario)

        // comparar senhas 
        const compararSenha = await bcrypt.compare(senha, usuario.senha)
        console.log("compare senha:", compararSenha)
        if (!compararSenha) {
            response.status(401).json({ message: "Senha invalida" });

        }
        response.status(200).json({ message: "Voce esta logado!" });
        return;

    })
    response.status(200).json({ message: "Rota de login" })
}

export const checkUser = async (request, response) => {
    if (request.headers.authorization) {
        //extrair o token -> barear TOKEN 
        const token = getToken(request)
        console.log(token)
        //descriptografar o token jwt.decode
        const decoded = jwt.decode(token, "SENHASUPERSEGURA")
        console.log(decoded)

        const usuarioId = decoded.id
        const selectSql = /*sql*/` SELECT nome, email, telefone, imagem * FROM usuarios WHERE ?? = ?`
        const selectData = ["usuario_id", usuarioId]
        conn.query(selectSql, selectData, (err, data) => {
            if (err) {
                console.error(err)
                response.status(500).json({ err: "erro ao verificar usuario" })
                return
            }

            usuarioAtual = data[0]
            response.status(200).json(usuarioAtual)

        })
    } else {
        usuarioAtual = null
        response.status(200).json(usuarioAtual)
    }
}
export const getUserById = async (request, response) => {

}
export const editUser = async (request, response) => {
    const { id } = request.params;

    try {
        const token = getToken(request);

        const user = await getUserByToken(token);

        const { nome, email, telefone } = request.body
        let imagem = user.imagem
        if (request.file) {
            imagem = request.file.filename
        }

        if (!nome) {
            return response.status(400).json({ message: "O nome é obrigatorio" })

        }
        if (!email) {
            return response.status(400).json({ message: "O e-mail é obrigatorio" })
        }

        if (!telefone) {
            return response.status(400).json({ message: "O telefone é obrigatorio" })
        }

        //verificar se o usuario existe 
        const checkSql = /*sql*/`SELECT * FROM  usuarios WHERE ?? = ?`
        const checkslqData = ["usuario_id", id]

        conn.query(checkSql, checkslqData, (err, data) => {
            if (err) {
                return response.status(500).json("Erro ao verificar usuario para Update")
            }
            if (data.length === 0) {
                return response.status(404).json("usuario não encontrado")

            }

            //Evitar usuario com email repetido 
            const checkEmailSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ? AND ?? != ? `
            const checkEmailData = ["email", email, "usuario_id", id]

            conn.query(checkEmailSql, checkEmailData, (err, data) => {
                if (err) {
                    return response.status(500).json("Erro ao verificar email para Update")
                }

                if (data.length > 0) {
                    return response.status(409).json("E-mail já está em uso!")
                }


                //Atualizar o usuario 
                const updateSql = /*sql*/`UPDATE usuarios SET ? WHERE ?? = ?`
                const updateData = [{ nome, email, telefone, imagem }, "usuario_id", id]
                conn.query(updateSql, updateData, (err)=>{
                    if(err){
                        return response.status(500).json({message:"Erro ao atualizar usuário"})
                    }
                    response.status(200).json({message:"Usuario Atualizado"})
                })
            })
        })

        // console.log(nome, email, telefone); 
    } catch (error) { 
        console.error(error)
        response.status(500).json("Erro Interno do servidor")
    }
}

export const putProduct = (request, response) => {

}