import { useState, useEffect } from "react";
import axios from "axios";

const getCountries = () => {
  const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";
  const request = axios.get(`${baseUrl}`);
  return request.then((response) => response.data);
};

const getWeather = (city) => {
  const key = import.meta.env.VITE_SOME_KEY;
  const baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
  const request = axios.get(`${baseUrl}`);
  return request.then((response) => response.data);
};

const FindCountry = ({ value, onChange }) => (
  <div>
    find countries
    <input value={value} onChange={onChange} />
  </div>
);

const CountryInfo = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const city = country.capital ? country.capital[0] : null;

  useEffect(() => {
    getWeather(city).then((weatherData) => {
      setWeather(weatherData);
      console.log(weatherData);
    });
  }, [city]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages || {}).map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      {weather && (
        <div>
          <h2>weather in {city}</h2>
          <p>Temperature {weather.main.temp} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>Wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

const ShowCountry = ({ countriesShow, handleShow }) => {
  if (countriesShow.length > 10) {
    return <p>Too many countries</p>;
  }
  if (countriesShow.length == 1) {
    const country = countriesShow[0];
    return <CountryInfo country={country} />;
  }
  if (countriesShow.length > 1) {
    return countriesShow.map((c) => (
      <div key={c.name.common}>
        <span>{c.name.common}</span>
        <button onClick={() => handleShow(c.name.common)}>show</button>
      </div>
    ));
  }
};

const App = () => {
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    getCountries().then((countriesData) => {
      setCountries(countriesData);
    });
    console.log({ countries });
  }, []);

  const handleCountry = (event) => {
    setCountry(event.target.value);
  };

  const countriesShow = country
    ? countries.filter((c) =>
        c.name.common.toLowerCase().includes(country.toLowerCase()),
      )
    : [];
  const handleShow = (name) => {
    setCountry(name);
  };

  return (
    <div>
      <FindCountry value={country} onChange={handleCountry} />
      <ShowCountry countriesShow={countriesShow} handleShow={handleShow} />
    </div>
  );
};
export default App;
