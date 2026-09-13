
const Header = (props) =>{
    console.log(props)
  return(
    <div>
      <p>
        Course name is {props.course.name}
      </p>
    </div>
  )
}

const Content = (props)=>{

return(
  <div>
    {props.parts.map((item)=>(
      <Part part ={item}/>
    ))}
  </div>
)
}

const Total = (props)=>{
  let total = 0
  props.parts.forEach(p => {total += p.exercises})
  return(
      <div>
        <p>Number of exercises is {total}</p>
  </div>
  )

}

const Part = (props) =>{
  return (
    <p>{props.part.name} {props.part.exercises}</p>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }




  return (
    <div>
      <Header course ={course}/>
      <Content 
        parts ={course.parts}
      />
      <Total 
        parts={course.parts} 
      />
    </div>
  )
}

export default App