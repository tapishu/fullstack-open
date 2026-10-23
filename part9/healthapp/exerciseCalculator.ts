interface exerciseValues {
  dailyHours: number[];
  target: number; 
}

const parseArgumentsForexerciseValues = (args: string[]): exerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

const target = Number(args[2]);
const dailyHours = args.slice(3).map(Number);

    if (isNaN(target) || dailyHours.some(isNaN)) {
    throw new Error('Provided values were not numbers!');
  }
      return {
dailyHours,
target
      };
};

interface ExerciseResult{
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}


export const calculateExercises =(a: number[], b:number): ExerciseResult =>{
const sum = a.reduce((x,value ) => x + value,0);
const average = sum/a.length;
const rating = average >= b ? 3 : (average >= b * 0.8 ? 2 : 1);
const ratingDescription = rating === 3 ? 'not too bad but could be better' : (rating === 2 ? 'good' : 'bad');
    return{
    periodLength: a.length,
  trainingDays: a.filter(n=>n>0).length,
  success: average >= b,
  rating,
  ratingDescription,
  target: b,
  average,
    };
};

if (process.argv[1] === import.meta.filename) {
try {
    const { dailyHours, target } = parseArgumentsForexerciseValues(process.argv);
    console.log(calculateExercises(dailyHours, target));
}catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
}