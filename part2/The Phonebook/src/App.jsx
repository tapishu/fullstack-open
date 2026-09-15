import { useState } from "react";

const Persons = ({ persons }) => {
  return persons.map((person) => (
    <p key={person.name}>
      {person.name} {person.number}
    </p>
  ));
};

const Filter = ({ value, onChange }) => (
  <div>
    filter shown with
    <input value={value} onChange={onChange} />
  </div>
);

const PersonForm = ({
  valueName,
  nameChange,
  valueNumber,
  numberChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={valueName} onChange={nameChange} />
    </div>
    <div>
      number: <input value={valueNumber} onChange={numberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "39-33-5325323" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newKey, setNewKey] = useState("");

  const add = (event) => {
    event.preventDefault();

    const nameExists = persons.find((person) => person.name === newName);
    if (nameExists) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const nameObject = { name: newName, number: newNumber };
    setPersons(persons.concat(nameObject));
    setNewName("");
    setNewNumber("");
  };
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const handleKeyChange = (event) => {
    setNewKey(event.target.value);
  };

  const filteredPeople = persons.filter((person) =>
    person.name.toLowerCase().includes(newKey.toLowerCase()),
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={newKey} onChange={handleKeyChange} />
      <h3>add a new</h3>
      <PersonForm
        valueName={newName}
        nameChange={handleNameChange}
        valueNumber={newNumber}
        numberChange={handleNumberChange}
        onSubmit={add}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPeople} />
    </div>
  );
};

export default App;
