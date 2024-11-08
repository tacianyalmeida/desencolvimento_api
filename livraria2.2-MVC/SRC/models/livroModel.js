import conn from "../config/conn";

const tableLivros = /*sql*/`
CREATE TABLE IF NOT EXISTS livros(
    livro_id VARCHAR(60) PRIMARY KEY, 
    titulo VARCHAR(255) NOT NULL, 
)
`