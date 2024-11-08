import { Router } from "express";
import {putProduct, checkUser, editUser, getUserById, login, register } from "../controllers/usuarioController.js";

import verifyToken from "../helpers/verify-token.js"

//helpers 
import imageUpload from "../helpers/image-upload.js";
import { create } from "domain";


const router = Router()

router.post("/register", register) 
router.post("/login", login) 
router.get("/checkuser", checkUser)
router.get("/:id", getUserById)
router.put("/edit/:id", verifyToken, imageUpload.array("images", 10), create)
router.post("/product", putProduct)


export default router;