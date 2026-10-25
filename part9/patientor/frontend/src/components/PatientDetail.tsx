import patientService from "../services/patients";
import { useEffect,useState } from "react";
import { Patient,Entry } from "../types";
import { useParams } from "react-router-dom"; 
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
// import diagnosesService from "../services/diagnoses";
import EntryDetails from "./EntryDetails";
import EntryForm from "./EntryForm";

const PatientDetail= () => {
const [patient,setPatient] =useState<Patient | null>(null);
const { id } = useParams<{ id: string }>();
// const [diagnoses,setDiagnoses] =useState<Diagnosis[]>([]);
const [showAddEntry,setShowAddEntry] = useState<boolean>(false);
const renderGenderIcon = (gender: Patient['gender']) => {
  switch (gender) {
    case 'male':
      return <MaleIcon />;
    case 'female':
      return <FemaleIcon />;
    default:
      return <TransgenderIcon />; // またはその他のアイコン
  }
};

  // useEffect(() => {
  //   const fetchDiagnoses = async () => {
  //     try{
  //     const data:Diagnosis[] = await diagnosesService.getDiagnoses();
  //     setDiagnoses(data);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };
  //   void fetchDiagnoses();
  // }, []);

  useEffect(() => {
    const fetchPatientList = async () => {
      if (!id) return;
      try{
      const data:Patient = await patientService.getPatient(id);
      setPatient(data);
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatientList();
  }, [id]);

  if (!patient ||!id) {
    return <div>Loading...</div>;
  }

const handleAddEntry = (newEntry: Entry) => {
  if (!patient) return;
  setPatient({
    ...patient,
    entries: patient.entries.concat(newEntry) // または [...patient.entries, newEntry]
  });
};

  return(
    <div>
      <h2>{patient.name} {renderGenderIcon(patient.gender)}</h2>
      {showAddEntry === true ?
       (<button type="button" onClick={()=>setShowAddEntry(!showAddEntry)}>Cancel Entry</button>) : 
      (<button type="button" onClick={()=>setShowAddEntry(!showAddEntry)}>Add New Entry</button>
)}
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      {showAddEntry && (<EntryForm id={id} onAdd={handleAddEntry}/>)}
      <h4>entries</h4>
      {patient.entries.length === 0 ? (<p>No entries</p>) :
      (
        patient.entries.map((entry) =>(
          <div key={entry.id}>
            <EntryDetails entry={entry}/>
          {/* <p>{entry.date} {entry.description}</p>
          <ul>
           {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
            entry.diagnosisCodes.map((code)=>{
              const diagnosis = diagnoses.find((d) => d.code === code);
              return(
              <li key={code}>
              {code} {diagnosis ? `- ${diagnosis.name}` : ''}
            </li>
              );})
          )}
          </ul> */}
          </div>
        ))
      )

      }
    
    </div>
  );

};

export default PatientDetail;
