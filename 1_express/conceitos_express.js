import express from "express"

// o express precisa do numero da porta 

//COMO INICIAR UMA APLICAÇÃO COM O EXPRESS 
// const PORT = 3333

const app = express()

//parte 01 - roteamento - GET, POST, PUT/PATCH, DELETE
//PARTE 02 - roteamento - Receber informações 
/** Formas
 * 1 -QUERY PARAMS-> GET ->/users?nome=Taci&cargo=Linda
 * 2- ROUTE PARAMS -> GET, PATCH, DELETE -> /users/1
 * 3- BODY PARAMS -> POST -> {json }
 * 

 */
 //RESPONSAVEL POR RECEBER JSON
  
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.get('/users',(req , res)=>{// Rota do tipo GET 
    // Exemplo simples: 
    // res.status(200).json([
    //     'Usuario 01',
    //     'Usuario 02',
    //     'Usuario 03',
    // ]) 
    // QUERY PARAMS-> GET ->/users?nome=Taci&cargo=Linda
    console.log(req)
    const {nome, cargo, idade} = req.query // desistruturando pra não escrever tanto
    // const nome = req.query.nome
    // const cargo = req.query.cargo
    // const idade = req.query.idade
    res.status(200).json({nome, cargo, idade})
})
// ROUTE PARAMS -> GET, PATCH, DELETE -> /users/1
app.post('/users/:id/:idade',(req, res)=>{ ///users/:id ele ja reconhece que vai receber um ai so por essa url 
    const {nome, cargo, idade} = req.body
    res.status(200).json({nome , cargo, idade}) 
})
app.put('/users',(req, res)=>{
    res.status(200).json(

    ) 
})
app.delete('/users',(req, res)=>{
    res.status(200).json([
        'Usuario 10',
        'Usuario 03',
        'Usuario 04',
    ]) 
})

app.listen(PORT, ()=>{
    console.log("Servidor on PORT"+PORT)
})