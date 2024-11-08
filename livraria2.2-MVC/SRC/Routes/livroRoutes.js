import { Router } from "express";
import {
    atualizarLivro,
    deletarLivro,
    getLivros,
    pegarUmLivro,
    cadastrarLivros
} from "../controllers/livrosController";



const router = Router();


//Livros
router.get("/", getLivros);

router.post("/cadastrar", cadastrarLivros);

//listar 1
router.get("/pegar/:id", pegarUmLivro);

//atualizar
router.put("/atulizar/:id", atualizarLivro);

//Delete
router.delete("/deletar/:id", deletarLivro); 
