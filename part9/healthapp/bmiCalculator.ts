export const calculateBmi = (height: number, weight: number): string => { 

    const bmiValue = weight / ((height/100)*(height/100));
    if(bmiValue < 18.5){
        return "Underweight range";
    }else if(bmiValue <= 24.9){
        return "Normal range";
    }else if(bmiValue <= 29.9){
        return "Overweight range";
    } else {
     return "obese";   
    }
};

interface BmiValues {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');
//コマンドでスクリプトを実行するとき、配列（args）の中身は次のような構成になっています：
//args[0]：Node.jsの実行ファイルのパス
//args[1]：実行しているスクリプトのファイルパス（例: multiplier.ts）
//args[2]：ユーザーが渡した1つ目の値（例: 計算する数字など）
//args[3]：ユーザーが渡した2つ目の値


  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

// const calcBmi=(a:number,b:number) : string =>{
//     const bmiValue = b / (a*a)
//     if(bmiValue < 18.5){
//         return "Underweight range"
//     }else if(bmiValue <= 24.9){
//         return "Normal range"
//     }else if(bmiValue <= 29.9){
//         return "Overweight range"
//     } else {
//      return "obese"   
//     }
// }
if (process.argv[1] === import.meta.filename) {

try {
    const {height,weight} = parseArguments(process.argv);
    console.log(calculateBmi(height,weight));
} catch (error:unknown){
      let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
}
//classifications are: underweight (under 18.5), normal weight (18.5 to 24.9), overweight (25 to 29.9), and obese (30 or more).[