import JWT from "jsowebtoken";

export const Auth = {
    private : async (req, res, next)=>{
        let sucess = false; 

        if(req.herders.authorization){
            const[AuthType, token ] = req.herders.authorization.split('')
        }
    }
}