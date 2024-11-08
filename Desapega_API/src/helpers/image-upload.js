import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";




const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//Estruturar onde guardar as imagens 
const imageStorege = multer.diskStorage({
    destination: (request, file, cb) => {
        let folder = ""; 
        if(request.baseUrl.includes()){
            folder = "usuarios";

        }else if (request.baseUrl.includes("objetos")){
            folder = "objetos";

        }
        cb(null, path.join(__dirname, `../public/${folder}`))
    },


    filename: (request, file, cb)=>{
                //nome do arquivo
        cb(null, Date.now() + String(Math.floor(Math.random()* 1000)) + path.extname(file.originalname))
    }
})

//Excutar a função para guardar imagem 

const imageUpload = multer({
    storage:imageStorege, 
    fileFilter(request, file, cb){
        if(!file.originalname.match(/\.(png||jpg)$/)){
          return cb(new Error("Por favor, envie apenas jpg ou png!"));

        } 
        cb(null, true)
    }
})

export default imageUpload; 