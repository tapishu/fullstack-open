import axios from "axios";
import { Patient, PatientFormValues,Diagnosis,EntryWithoutId } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};


const getPatient = async (id: string) => {
  const { data } = await axios.get<Patient>(
    `${apiBaseUrl}/patients/${id}`
  );

  return data;
};

const getDiagnoses = async () => {
  const { data } = await axios.get<Diagnosis>(
    `${apiBaseUrl}/diagnoses`
  );

  return data;
};


const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const addEntry = async (id:string, object: EntryWithoutId) => {
  const { data } = await axios.post<EntryWithoutId>(
    `${apiBaseUrl}/patients/${id}/entries`,
    object
  );

  return data;
};

export default {
  getAll, create,getPatient,getDiagnoses,addEntry
};

