import { useState, useEffect } from "react";
import axios from "axios";
import personService from "./services/persons";

const Persons = ({ persons, onClick }) => {
  return persons.map((person) => (
    <div key={person.id}>
      <p>
        {person.name} {person.number}
        <button onClick={() => onClick(person.id)}>delete</button>
      </p>
    </div>
  ));
};

const Notification = ({ message, isError }) => {
  const errorStyle = {
    color: isError ? "red" : "green",
    backgroundColor: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  if (message === null) {
    return null;
  }

  return <div style={errorStyle}>{message}</div>;
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
  // const [persons, setPersons] = useState([
  //   { name: "Arto Hellas", number: "39-33-5325323" },
  // ]);
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newKey, setNewKey] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  // const hook = () => {
  //   axios.get("http://localhost:3001/persons").then((response) => {
  //     setPersons(response.data);
  //   });
  // };

  // useEffect(hook, []);
  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const add = (event) => {
    event.preventDefault();
    const nameExists = persons.find((person) => person.name === newName);
    if (nameExists) {
      const ok = window.confirm(
        `${newName} is already added to phonebook. replace the old number with a new one?`,
      );

      if (ok) {
        const updateObject = { ...nameExists, number: newNumber };
        personService
          .update(nameExists.id, updateObject)
          .then((returnObject) => {
            setPersons(
              persons.map((person) =>
                person.id === nameExists.id ? returnObject : person,
              ),
            );
            setErrorMessage(`Changed ${newName}'s number`);
            setNewName("");
            setNewNumber("");
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          })
          .catch((error) => {
            setIsError(true);
            setErrorMessage(
              `Information of ${newName} has already been removed from server`,
            );
            setPersons(persons.filter((p) => p.id !== nameExists.id));
            setTimeout(() => {
              setErrorMessage(null);
              setIsError(false);
            }, 5000);
          });
      }
      return;
    }
    const nameObject = { name: newName, number: newNumber };
    personService.create(nameObject).then((returnObject) => {
      setPersons(persons.concat(returnObject));
      setErrorMessage(`Added ${newName}`);
      setNewName("");
      setNewNumber("");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    });
  };

  const handleDeleteUser = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          setIsError(true);
          setErrorMessage(`${person.name} is no longer registrered on server`);
          setPersons(persons.filter((p) => p.id !== id));
          setTimeout(() => {
            setErrorMessage(null);
            setIsError(false);
          }, 5000);
        });
    }
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
      <Notification message={errorMessage} isError={isError} />
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
      <Persons persons={filteredPeople} onClick={handleDeleteUser} />
    </div>
  );
};

export default App;
