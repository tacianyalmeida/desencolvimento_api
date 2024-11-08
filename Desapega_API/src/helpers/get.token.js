const getToken =(request) =>{
    //extrair o token 

    const authHeader = request.headers.authorization; 
    const token = authHeader.split("")[1]; 
    return token; 
}; 

export default getToken; 
