import patientorService from "../services/patientorService.ts";
import express from "express";
import {parseNewPatient} from "../parseNewPaitient.ts";

const router = express.Router();

router.get("/",(_req,res)=>{
    res.send(patientorService.getNonSensitivePatient());
});

router.post("/",(req,res)=>{

    try{       
         const newPatient = parseNewPatient(req.body);
    // 2. 安全になったデータをサービス層に渡して保存
    const addedPatient = patientorService.addPatient(newPatient);
    
    res.json(addedPatient);
    } catch (error:unknown){
let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send({ error: errorMessage });
    }
    // const {name,dateOfBirth,ssn,gender,occupation} = req.body;
    // const addedPatient = patientorService.addPatient({
    //     name,
    //     dateOfBirth,
    //     ssn,
    //     gender,
    //     occupation
    // });
    // res.json(addedPatient)
});

export default router;

