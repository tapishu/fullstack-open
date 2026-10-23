import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import {calculateExercises} from "./exerciseCalculator.ts";
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get("/bmi",(req,res) =>{
  const height=Number(req.query.height);
  const weight = Number(req.query.weight);
if (!req.query.height || !req.query.weight || isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    return res.status(400).json({
      error: "malformatted parameters"
    });}
const bmi = calculateBmi(height, weight);

return res.json({
    weight,
    height,
    bmi
  });
});

app.post("/exercises",(req,res)=>{
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment 
const {daily_exercises,target}=req.body;
    if (!target||!daily_exercises) {
     return res.status(400).send({ error: "parameters missing"});  
  }

const exercisesArray = Array.isArray(daily_exercises) ? daily_exercises.map(Number) : [];
//配列かのチェックと中身を数字に変えて配列に
const targetValue = Number(target);
    if (isNaN(targetValue) || exercisesArray.some(isNaN)) {
     return res.status(400).send({ error: "malformatted parameters"});  
  }

  const result = calculateExercises(exercisesArray,targetValue);
  return res.send(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
