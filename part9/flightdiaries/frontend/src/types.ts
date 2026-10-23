
export const Weather ={
  Sunny:"sunny",
  Rainy:"rainy",
  Windy:"windy",
  Cloudy:"cloudy"
} as const

export type Weather = typeof Weather[keyof typeof Weather];

export const Visibility = {
  Great: 'great',
  Good: 'good',
  Ok: 'ok',
  Poor: 'poor',
} as const;

export type Visibility = typeof Visibility[keyof typeof Visibility];

export interface Diary {
  id: string,
  date: string,
  weather: Weather,
  visibility: Visibility,
  comment:string

}

export type NewDiary = Omit<Diary, 'id'>
