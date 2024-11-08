//PRODUTOS 
export const adicionaProduto = (request, response) => {
    const { nome, tipo, descricao, idUsuario } = request.body;

    if (!nome) {
        response.status(400).json({ message: "O nome do produto é obrigatorio" })
        return
    }
    if (!tipo) {
        response.status(400).json({ message: "O tipo do produto é obrigatorio" })
        return;
    }
    if (!descricao) {
        response.status(400).json({ message: "A descrição do produto é obrigatoria" })
        return;
    }

    if (!idUsuario) {
        response.status(400).json({ message: "O id do usuario é obrigatorio" })
        return;
    }

    const checkslq = /*sql*/`SELECT * FROM produtos WHERE ?? = ?`
    const checksqlData = ["nome", nome, "usuario_id", idUsuario]

    conn.query(checkslq, checksqlData, async (err, data)=>{
        if(err){
            console.log(err)
            response.status(500).json({message: "Erro ao cadastrar"}); 
            return; 
        }
        if(data.length.id === 0){
            response.status(500).json({message: "Usuario não existe"}); 
            return; 
        }

        const produto = data[0]
        const concatenaProdutoAoArrayDoUsuario = /*sql*/`SELECT  usuarios_id || ' ' || produto_dono || ' ' || produto_id AS nova_coluna FROM produtos; `

    })


    response.status(200).json({ message: "Produto cadastrado" })
}


// Eu posso atribuir o Id do produto ao usuario,
// Ou posso, concatenar no cadastro


// quando o produto for cadastrado do id desse usuario,
// as informaçoes do produto se conectam com o array desse usuario 
export default adicionaProduto