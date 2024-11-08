
import express, { response } from "express";
import { v4 as uuidv4 } from "uuid";

const PORT = 8080

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const logRoutes = (req , res, next )=>{//FUNÇÃO MILER
    const {url, method} = req
    const rota = ` [${method.toUpperCase()}] ${url}`
    console.log(rota)
    next
}
app.use(logRoutes)

const usuarios = []
app.get("/usuarios", logRoutes, (req, res)=>{
    res.status(200).json(usuarios)
    
});

app.post("/usuarios", (req, res)=>{
    const {nome, cargo } = req.body
    
    //validaçoes 

    if(!nome){
        res.status(400).json({message: "o nome é obrigatorio"})
        return
    }
    if(!cargo){
        res.status(400).json({message:"O cargo é obrigatorio"})
    }
    const novoUsuario ={
        id: uuidv4(),
        nome, 
        cargo
    }
    
    usuarios.push(novoUsuario)
    res.status(201).json({message: "usuario cadastrado", novoUsuario}); 

});

app.patch('/usuarios/:id', (req, res )=>{
    const {id} = req.params;
    const {nome, cargo} = req.body;

    const indexUsuario = usuarios.findIndex((usuario)=> usuario.id === id );

    if(indexUsuario === -1){
        res.status(404).json({message: "Usuario não encontrado"}); 
        return;
    }
    if(!nome){
        res.status(400).json({message: "O nome é obrigatorio"}); 
        return;
    }
    if(!cargo){
        res.status(404).json({message: "O cargo é obrigatorio"}); 
        return;
    }
    const updataUsuario = {
        id, 
        nome, 
        cargo 
    }
    
    usuarios[indexUsuario] = updataUsuario
    res.status(200).json({message:"usuario atualizado"}, updataUsuario)

})
 

app.delete("/usuarios/:id", (req, res)=>{
 const id = req.params.id 

 const indexUsuario = usuarios.find(usuario => usuario.id === id )
 
 if(indexUsuario === -1){
    res.status(404).json({message: "Usuario não encotrado"})
    return
 }
 usuarios.splice(indexUsuario, 1)
 res.status(200).json({message: "Usuario deletado"})

})


app.listen(PORT, ()=>{
    console.log("Servidor on PORT"+PORT)
})

