import type{NewPatient} from "./types.ts";
import { Gender } from "./types.ts";
import { z } from 'zod';


// const isString = (text: unknown): text is string => {
//   return typeof text === 'string' || text instanceof String;
// };

// const parseName = (name:unknown): string =>{
//     if (!name || !isString(name)) {
//     throw new Error('Incorrect or missing name');
//   }
//   return name;
// }

// const isDate = (date: string): boolean => {
//   return Boolean(Date.parse(date));
// };

// const parseDateOfBirth = (date: unknown): string => {
//   if (!date || !isString(date) || !isDate(date)) {
//       throw new Error('Incorrect or missing date: ' + date);
//   }
//   return date;
// };

// const parseSsn = (ssn:unknown): string =>{
//     if (!ssn || !isString(ssn)) {
//     throw new Error('Incorrect or missing ssn');
//   }
//   return ssn;
// }

// const parseOccupation = (occupation:unknown): string =>{
//     if (!occupation || !isString(occupation)) {
//     throw new Error('Incorrect or missing occupation');
//   }
//   return occupation;
// }

// const isGender = (param: string): param is Gender =>{
//   return (Object.values(Gender) as string[]).includes(param);
// }

// const parseGender = (gender:unknown): Gender =>{
//   if(!gender || !isString(gender)||!isGender(gender)){
//         throw new Error('Incorrect or missing gender: ' + gender);
//   }
//   return gender
// }


// const parseNewPatient = (object: unknown): NewPatient => {  
//       if ( !object || typeof object !== 'object' ) {
//     throw new Error('Incorrect or missing data');
//   }
  
//   if ('name' in objectc && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && "occupation" in object){
//     const newPatient: NewPatient = {
//       name: parseName(object.name),
//       dateOfBirth: parseDateOfBirth(object.dateOfBirth),
//       ssn: parseSsn(object.ssn),
//       gender: parseGender(object.gender),
//       occupation :parseOccupation(object.occupation)
// };

//     return newPatient; // ⭕ if 文の中でちゃんと返す
//   }

//   // ⭕ if文の条件を満たさなかった場合にエラーを投げる処理を追加する
//   throw new Error('Incorrect data: some fields are missing');
// }

const parseNewPatientSchema = z.object({
  name:z.string(),
  dateOfBirth:z.iso.date(),
  ssn: z.string(),
  gender:z.enum(Gender),
  occupation:z.string()
});
 
export const parseNewPatient = (object:unknown): NewPatient =>{
  return parseNewPatientSchema.parse(object);
};


// export default parseNewPatient;
