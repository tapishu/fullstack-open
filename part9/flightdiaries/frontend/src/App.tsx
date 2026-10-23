import { useState,useEffect } from 'react';
import type { Diary, Weather, Visibility} from './types'
import diaryService from "./diaryService"
import axios from 'axios'; 

const App =()=>{
const [diaries, setDiaries] = useState<Diary[]>([]);
const [newdate,setNewDate] = useState("");
const [newWeather,setNewWeather] = useState<Weather>("sunny");
const [newVisibility,setNewVisibility] = useState<Visibility>("good");
const [newComment,setNewComment] = useState("");
const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    diaryService.getAll().then(initialDiaries => {
      setDiaries(initialDiaries)
    })
  }, [])


  const diaryCreation = (event: React.SyntheticEvent) => {    
    event.preventDefault()
    diaryService.create({
    // "id": diaries.length+1,
    "date": newdate,
    "weather": newWeather,
    "visibility": newVisibility,
    "comment":newComment
    })
      .then(returnedDiary => {
        setDiaries(diaries.concat(returnedDiary))
            setNewDate("")
    setNewWeather("sunny")
    setNewVisibility("good")
    setNewComment("")
      })
      .catch(error => {
        // Axiosのエラーかどうかを判定する（型ガード）
        if (axios.isAxiosError(error)) {
      // このブロックの中では、errorが AxiosError として扱われるため安全！
      console.log(error.status);          // ステータスコード
      console.error(error.response);      // レスポンスの詳細
const message = error.response?.data?.error?.[0]?.message || error.message;
          setErrorMessage(`Error: ${message}`);
    } else {
      // Axios以外の通常のエラー
      console.error(error);
  setErrorMessage("An unexpected error occurred");
    }
      })

  };
  const weatherOptions: Weather[] = ["sunny", "rainy", "cloudy", "windy"];
  const visibilityOptions: Visibility[] = ["great", "good", "ok", "poor"];

  return (
<div>
    <h2>Add new entry</h2>
    {errorMessage && (
        <div style={{ color: 'red', marginBottom: '10px', fontWeight: 'bold' }}>
          {errorMessage}
        </div>
      )}
          <form onSubmit={diaryCreation}>
            <div> Date:
        <input
        type='date'
          value={newdate}
          onChange={(event) => setNewDate(event.target.value)}
         />
         </div>
         <div> Weather:
            {weatherOptions.map(option =>(
                <label key={option}>
                    <input
                    type='radio'
                    name='weather'
                    checked={newWeather === option}
                onChange={() => setNewWeather(option)}
                    />
                    {option}
                </label>
            ))}
            {/* <select 
            value={newWeather} 
            onChange={(event) => setNewWeather(event.target.value as Weather)}
          >
            <option value="sunny">Sunny</option>
            <option value="rainy">Rainy</option>
            <option value="cloudy">Cloudy</option>
            <option value="stormy">Stormy</option>
            <option value="windy">Windy</option>
          </select> */}
         </div>
         <div> Visibility:
            {visibilityOptions.map(option =>(
                <label key={option}>
                    <input
                    type='radio'
                    name='visibility'
                    checked={newVisibility === option}
                onChange={() => setNewVisibility(option)}
                    />
                    {option}
                </label>
            ))}
{/* 
            <select 
            value={newVisibility} 
            onChange={(event) => setNewVisibility(event.target.value as Visibility)}
          >
            <option value="great">Great</option>
            <option value="good">Good</option>
            <option value="ok">Ok</option>
            <option value="poor">Poor</option>
          </select> */}
                    {/* <input
          value={newVisibility}
          onChange={(event) => setNewVisibility(event.target.value as Visibility)}
         /> */}
         </div>
         <div> Comment:
                 <input
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
         />
         </div>
        <button type='submit'>add</button>
      </form>
      <h2>Diary entries</h2>
          <ul>
        {diaries.map(diary =>
          <li key={diary.id}>
            <h3>{diary.date}</h3>
            <div>visibility: {diary.visibility}</div>
            <div>weather: {diary.weather}</div>
            {diary.comment && <div>comment: {diary.comment}</div>}
            </li>
        )}
      </ul>
</div>

  )
}

export default App
