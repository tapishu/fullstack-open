import { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;
const StatisticLine = ({ value, text }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

// a proper place to define a component
const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = total === 0 ? 0 : (good - bad) / total;
  const positive = total === 0 ? 0 : (good / total) * 100;

  if (total === 0) {
    return (
      <div>
        <h2>statictics</h2>
        <p>No feedback given</p>
      </div>
    );
  }

  return (
    <div>
      <h2>statictics</h2>
      <table>
        <tbody>
          <StatisticLine value={good} text="good" />
          <StatisticLine value={neutral} text="neutral" />
          <StatisticLine value={bad} text="bad" />
          <StatisticLine value={total} text="all" />
          <StatisticLine value={average} text="average" />
          <StatisticLine value={positive} text="positive" />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const allClicks = (value, setValue) => {
    const updatedValue = value + 1;
    setValue(updatedValue);
  };

  return (
    <div>
      <h1>give feedBack</h1>
      <Button onClick={() => allClicks(good, setGood)} text="good" />
      <Button onClick={() => allClicks(neutral, setNeutral)} text="neutral" />
      <Button onClick={() => allClicks(bad, setBad)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
