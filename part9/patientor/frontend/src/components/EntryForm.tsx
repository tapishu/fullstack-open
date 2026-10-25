import patientService from "../services/patients";
import { useState,useEffect } from "react";
import { EntryWithoutId,HealthCheckRating,EntryType,Diagnosis,Entry} from "../types";
import { Paper } from '@mui/material';
import axios from "axios";
import diagnosesService from "../services/diagnoses";



import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  slotProps: {
    paper: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  },
};



interface Props {
  id: string;
  onAdd: (entry: Entry)=> void;
}

interface ErrorProps {
  message: string | null;
}
const ErrorNortification = ({message}:ErrorProps) =>{
  if(!message){
    return null;
  }
  
  return(
<h3 style={{ color: "red" }}>{message}</h3>
  );
};

const EntryForm= ({id,onAdd}:Props) => {
const [description,setDescription] =useState<string>("");
const [date,setDate] =useState<string>("");
const [type,setType] =useState<EntryType>(EntryType.HealthCheck);
const [specialist,setSpecialist] =useState<string>("");
const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
const [error, setError] = useState<string | null>(null);

const [employerName,setEmployerName] =useState<string>("");
const [startDate,setStartDate] =useState<string| undefined>("");
const [endDate,setEndDate] =useState<string | undefined>("");
const [dischargedate,setDischargedate] =useState<string>("");
const [criteria,setCriteria] =useState<string>("");

const [diagnoses,setDiagnoses] =useState<Diagnosis[]>([]);
const [selectedDiagnosisCodes, setSelectedDiagnosisCodes] = useState<Array<Diagnosis['code']>>([]);



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

useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      setError(null); // 10秒後に error を null にして消す
    }, 10000); // 10000ミリ秒 = 10秒

    return () => clearTimeout(timer);
  }, [error]);


  const handleChange = (event: SelectChangeEvent<typeof selectedDiagnosisCodes>) => {
    const {
      target: { value },
    } = event;
    setSelectedDiagnosisCodes(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };


const addEntry = async (event: React.SyntheticEvent) =>{
      event.preventDefault();
let newEntry: EntryWithoutId;

switch(type){
    case "HealthCheck":
    newEntry ={
    date,
    specialist,
    type:"HealthCheck",
    description,
    diagnosisCodes: selectedDiagnosisCodes,
    healthCheckRating        
  };
  break;
    case "OccupationalHealthcare":
    newEntry ={
    date,
    specialist,
    type:"OccupationalHealthcare",
    description,
    diagnosisCodes: selectedDiagnosisCodes,
    employerName,
    sickLeave: startDate && endDate ?{
startDate,
endDate,
    } : undefined
  };  
break;
    case "Hospital":
    newEntry ={
    date,
    specialist,
    type:"Hospital",
    description,
    diagnosisCodes: selectedDiagnosisCodes,
      discharge: {
    date : dischargedate,
    criteria,
  }  
  };
  break;
            default:
              throw new Error(`Unhandled entry type: ${type}`);
}

  try {
    const addedEntry = await patientService.addEntry(id,newEntry) as Entry;
    console.log("Added entry:", addedEntry);
onAdd(addedEntry);
    
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {

const errorData = e.response?.data;
   let errorMessage = "An unexpected error occurred";

    if (errorData && typeof errorData === 'object' && 'error' in errorData) {
      const errorStr = String((errorData as { error: unknown }).error);
      
      // 文字列の中から path と message をざっくり抽出するシンプルなアプローチ
      if (errorStr.includes("healthCheckRating")) {
        errorMessage = "healthCheckRating: Invalid input";
      } else {
        errorMessage = errorStr;
      }
    }
    setError(errorMessage);
      } else {
      console.error("Unknown error", e);
     setError("Unknown error");
    }
  }
};



return (
    <Paper variant="outlined" style={{ 
      padding: '1em', 
      marginBottom: '1em', 
border: '1px dotted black'
    }}>
<form onSubmit={addEntry}>
      <h3>New HealthCheck Entry</h3>
      <ErrorNortification message={error}/>
      <div>
          <label>Type</label>
          <select 
            value={type}
            onChange={(e) => setType((e.target.value) as EntryType)}
          >
            <option value={EntryType.HealthCheck}>HealthCheck</option>
            <option value={EntryType.OccupationalHealthcare}>OccupationalHealthcare</option>
            <option value={EntryType.Hospital}>Hospital</option>
          </select>
        </div>
<div>
    <label>Description
    <input 
      type="text"
        value={description}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}      />
    </label>
    </div>
      <div>
    <label>Date
    <input 
      type="date"
        value={date}
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}      />
</label>
</div>
      <div>
    <label>Specialist
    <input 
      type="text"
        value={specialist}
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpecialist(e.target.value)}      />
</label>
</div>

    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Code</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedDiagnosisCodes}
          onChange={handleChange}
          input={<OutlinedInput label="Code" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {diagnoses.map((d) => {
            const selected = selectedDiagnosisCodes.includes(d.code);
            const SelectionIcon = selected ? CheckBoxIcon : CheckBoxOutlineBlankIcon;

            return (
              <MenuItem key={d.code} value={d.code}>
                <SelectionIcon
                  fontSize="small"
                  style={{ marginRight: 8, padding: 9, boxSizing: 'content-box' }}
                />
                <ListItemText primary={`${d.code} - ${d.name}`} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>

{type === "HealthCheck" && (
<div>
      <label>HealthCheck rating
    <select 
         value={healthCheckRating}
onChange={(e) => setHealthCheckRating(Number(e.target.value) as HealthCheckRating)}>
<option value={HealthCheckRating.Healthy}>0 : Healthy</option>
<option value={HealthCheckRating.LowRisk}>1 : LowRisk</option>
<option value={HealthCheckRating.HighRisk}>2 : HighRisk</option>
<option value={HealthCheckRating.CriticalRisk}>3 : CriticalRisk</option>
</select>
</label>
</div>
)}

{type === "OccupationalHealthcare" && (

<div>
  <div>
<label>employerName
 <input 
      type="text"
        value={employerName}
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmployerName((e.target.value))}      />
</label>
</div>
<div>
<label>sickLeaveDate
 <input 
      type="text"
        value={startDate}
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate((e.target.value))}      />
</label>
 </div>
 <div>
  <label>sickLeaveEnd
 <input 
      type="text"
        value={endDate}
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate((e.target.value))}      />
</label>
</div>
</div>
)}

{type === "Hospital" && (
<div>
  <div>
<label>discharge
 <input 
      type="text"
        value={dischargedate}
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDischargedate((e.target.value))}      />
</label>
 </div>
   <div>
 <label>criteria
 <input 
      type="text"
        value={criteria}
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCriteria((e.target.value))}      />
</label>
</div>
</div>
)}

      <button type="submit">
        ADD
      </button>
      <button type= "button" onClick={()=> {
       setDescription("");
    setDate("");
    setType(EntryType.HealthCheck);
    setSpecialist("");
    setHealthCheckRating(HealthCheckRating.Healthy);
    setError(null);
    setEmployerName("");
    setStartDate("");
    setEndDate("");
    setDischargedate("");
    setCriteria("");
    setSelectedDiagnosisCodes([]);
      }}>
        CANCEL
      </button>
    </form>
</Paper>
);
};

export default EntryForm;

