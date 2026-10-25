import patientService from "../services/patients";
import { useEffect,useState } from "react";
import { Patient,Diagnosis,Entry,HealthCheckEntry,OccupationalHealthcareEntry, HospitalEntry} from "../types";
import diagnosesService from "../services/diagnoses";
import { Paper } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { yellow } from "@mui/material/colors";


const getHeartColor=(rating:number) =>{
  switch(rating){
    case 0: return "green";
    case 1 : return "yellow";
    case 2 : return "orange";
    case 3 : return "red";
    default : return "grey";
  }
};


const HospitalEntryDetails = ({entry}:{entry:HealthCheckEntry}) =>(
  <Paper variant="outlined" style={{ 
    padding: '1em', 
    marginBottom: '1em', 
    border: '1px solid black'
  }}>
    <p>{entry.date} <MonitorHeartIcon/></p>
    <p>{entry.type} {entry.description}</p>
    <p>diagnosed by {entry.specialist}</p>
    {entry.healthCheckRating !== undefined && (<FavoriteIcon style={{color : getHeartColor(entry.healthCheckRating)}}/>)}
  </Paper>
);

const OccupationalHealthcareDetails = ({entry}:{entry:OccupationalHealthcareEntry}) =>(
  <Paper variant="outlined" style={{ 
    padding: '1em', 
    marginBottom: '1em', 
    border: '1px solid black' 
  }}>
    <p>{entry.date} <WorkIcon/></p>
    <p>{entry.type} {entry.description}</p>
    <p>diagnosed by {entry.specialist}</p>

  </Paper >
  );

const HospitalDetails = ({entry}:{entry:HospitalEntry}) =>(
  <Paper variant="outlined" style={{ 
    padding: '1em', 
    marginBottom: '1em', 
    border: '1px solid black' 
  }}>
    <p>{entry.date} <LocalHospitalIcon/> </p>
    <p>{entry.type} {entry.description}</p>
    <p>diagnosed by {entry.specialist}</p>
    <p>discharge:</p>
    <p>date:{entry.discharge.date}</p>
    <p>criteria:{entry.discharge.criteria}</p>
  </Paper>
  );


const EntryDetails= ({entry}:{entry:Entry}) => {
const [diagnoses,setDiagnoses] =useState<Diagnosis[]>([]);


  useEffect(() => {
    const fetchDiagnoses = async () => {
      try{
      const data:Diagnosis[] = await diagnosesService.getDiagnoses();
      setDiagnoses(data);
      } catch (e) {
        console.error(e);
      }
    };
    void fetchDiagnoses();
  }, []);

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

  if (!entry) {
    return <div>Loading...</div>;
  }

  switch(entry.type){
    case "HealthCheck":
      return <HospitalEntryDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareDetails entry={entry} />;
    case "Hospital":
      return <HospitalDetails entry={entry} />;
    default:
      return assertNever(entry);

  }

  // return(
  //   <div>
  //     <h4>entries</h4>

  //     {/* {patient.entries.length === 0 ? (<p>No entries</p>) :
  //     (
  //       patient.entries.map((entry) =>(
  //         <div key={entry.id}>
  //         <p>{entry.date} {entry.description}</p>
  //         <ul>
  //          {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
  //           entry.diagnosisCodes.map((code)=>{
  //             const diagnosis = diagnoses.find((d) => d.code === code);
  //             return(
  //             <li key={code}>
  //             {code} {diagnosis ? `- ${diagnosis.name}` : ''}
  //           </li>
  //             );})
  //         )}
  //         </ul> */}
  //         {/* </div>
  //       ))
  //     )

  //     } */}
    
  //   </div>
  // );

};

export default EntryDetails;
