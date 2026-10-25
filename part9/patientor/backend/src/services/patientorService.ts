import diagnosesData from "../../data/diagnoses.json" with {type: "json"};
// import patientsData from "../../data/patients.json" with {type: "json"};
import patients from '../../data/patients.ts'; // 上記のファイル
import { v1 as uuid } from 'uuid'; 
import type{EntryWithoutId,Diagnosis,Patient,NonSensitivePatient,NewPatient, Entry} from "../types.ts";

const diagnoses: Diagnosis[] = diagnosesData;

// const patients : Patient[] = patientsData as Patient[];

const getDiagnoses = (): Diagnosis[] =>{
    return diagnoses;
};

// const getPatientById = (id:string): Patient | undefined =>{
// const patient:Patient|undefined = patients.find(p=>p.id === id);

//     return patient;
// };

const getPatientById = (id: string) => {
  return patients.find(p => p.id === id);
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

const addEntry=(id:string,entry:EntryWithoutId):Entry =>{
    const entryId = uuid();
  const patient = patients.find(p => p.id === id);

  if (!patient) {
    throw new Error(`Patient with id ${id} not found`);
  }

    const newEntry ={
        id:entryId,
        ...entry
    };
    patient.entries.push(newEntry);
    return newEntry;
};



export default {
getDiagnoses,
getNonSensitivePatient,
getPatientById,
addPatient,
addEntry

};