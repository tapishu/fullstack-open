//import { useShallow } from "zustand/react/shallow"
import { create } from 'zustand'

const usesStatisticsStore= create(set =>({

good:0,
neutral:0,
bad:0,

// all: good + neutral + bad,
// average: 1,
// positibe:1,
actions:{
incrementGood: ()=> set(state =>({
    good:state.good + 1
})),
incrementNeutral:()=> set(state =>({
    neutral:state.neutral + 1
})),
incrementBad:()=> set(state =>({
    bad:state.bad + 1
}))
}

}))
//export const userStatisticsCounters = ()=> usesStatisticsStore(state=>state.counters)
export const userStatisticsGood = ()=> usesStatisticsStore(state=>state.good)
export const userStatisticsNeutral = ()=> usesStatisticsStore(state=>state.neutral)
export const userStatisticsBad = ()=> usesStatisticsStore(state=>state.bad)

export const userStatisticsControls = ()=> usesStatisticsStore(state=>state.actions)