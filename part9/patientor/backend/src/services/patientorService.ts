import diagnosesData from "../../data/diagnoses.json" with {type: "json"};
import patientsData from "../../data/patients.json" with {type: "json"};
import { v1 as uuid } from 'uuid'; 
import type{Diagnosis,Patient,NonSensitivePatient,NewPatient} from "../types.ts";

const diagnoses: Diagnosis[] = diagnosesData;

const patients : Patient[] = patientsData as Patient[];

const getDiagnoses = (): Diagnosis[] =>{
    return diagnoses;
};

const getNonSensitivePatient = (): NonSensitivePatient[] =>{
    return patients.map(({id,name,dateOfBirth,gender,occupation})=>({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
    }));
};


const addPatient=(profile:NewPatient):Patient =>{
    const id = uuid();

    const newPatient ={
        id,
        ...profile
    };
    patients.push(newPatient);
    return newPatient;
};

export default {
getDiagnoses,
getNonSensitivePatient,
addPatient

};