import patientorService from "../services/patientorService.ts";
import express from "express";
import {parseNewPatient} from "../parseNewPaitient.ts";
import {parseNewEntry} from "../parseNewEntry.ts";
const router = express.Router();

router.get("/",(_req,res)=>{
    res.send(patientorService.getNonSensitivePatient());
});

router.get("/:id",(req,res)=>{
const patient = patientorService.getPatientById(req.params.id);
if(patient){
    res.send(patient);
}else{
    res.status(404).send({error:"patient not found"});
}

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

router.post("/:id/entries",(req,res)=>{

    try{       
         const newEntry = parseNewEntry(req.body);
    // 2. 安全になったデータをサービス層に渡して保存
    const addedEndtry = patientorService.addEntry(req.params.id,newEntry);
    
    res.json(addedEndtry);
    } catch (error:unknown){
let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send({ error: errorMessage });}
});


export default router;

