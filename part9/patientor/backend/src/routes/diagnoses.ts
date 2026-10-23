import patientorService from "../services/patientorService.ts";
import express from "express";

const router = express.Router();

router.get("/",(_req,res)=>{
    res.send(patientorService.getDiagnoses());
});

export default router;


