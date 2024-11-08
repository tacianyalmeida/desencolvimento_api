import { create } from "domain";
import { Router } from "express";

import {} from "../controllers/objetoControllers.js" 


const router = Router();

//helpers 
import verifyToken from "../helpers/verify-token.js";

router.post("/", create)

export default router