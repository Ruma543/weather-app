import { useEffect, useState } from 'react';
import img from '../public/tree-832079_1280.jpg';
import img1 from '../public/download.jpg';
import { FaCloudShowersHeavy, FaSearch } from 'react-icons/fa';
import { IoRainySharp, IoSnowSharp } from 'react-icons/io5';
import { MdThunderstorm } from 'react-icons/md';
import { LuHaze } from 'react-icons/lu';

import { IoMdPartlySunny } from 'react-icons/io';
const api = {
  key: 'e8eb8f3896f584a692c44ca472920e62',
  base: 'https://api.openweathermap.org/data/2.5/',
};
function App() {
  const [search, setSearch] = useState('');
  const [weather, setWeather] = useState({});
  const [unit, setUnit] = useState('metric');
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    fetchWeatherByGeolocation();
  }, []);
  const fetchWeatherByGeolocation = async () => {
    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        await fetchWeatherData(latitude, longitude);
        await fetchForecastData(latitude, longitude);
      },
      error => {
        console.error('Error fetching geolocation:', error);
      }
    );
  };
  const fetchWeatherData = async (latitude, longitude) => {
    const response = await fetch(
      `${api.base}weather?lat=${latitude}&lon=${longitude}&units=${unit}&APPID=${api.key}`
    );
    const data = await response.json();
    setWeather(data);
  };
  const fetchForecastData = async (latitude, longitude) => {
    const response = await fetch(
      `${api.base}forecast?lat=${latitude}&lon=${longitude}&units=${unit}&APPID=${api.key}`
    );
    const data = await response.json();
    setForecast(data.list);
  };

  const searchPressed = () => {
    fetch(`${api.base}weather?q=${search}&units=${unit}&APPID=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setWeather(result);
        console.log(result);
        setUnit('metric');
      });
  };

  // weather icon set
  const renderWeatherIcon = () => {
    const condition = weather.weather[0].main;
    switch (condition) {
      case 'Clear':
        return <IoMdPartlySunny />;
      case 'Clouds':
        return <FaCloudShowersHeavy />;
      case 'Rain':
        return <IoRainySharp />;
      case 'Snow':
        return <IoSnowSharp />;
      case 'Thunderstorm':
        return <MdThunderstorm />;
      case 'Haze':
        return <LuHaze />;
      default:
        return null;
    }
  };
  const renderForecast = () => {
    const filteredForecast = forecast.filter((item, index) => {
      // hour of the forecast
      const date = new Date(item.dt * 1000);
      const hour = date.getHours();

      // Filter only 3-time data a day (morning, afternoon, and evening)
      return hour === 9 || hour === 15 || hour === 21;
      // adjust the hours
    });
    return filteredForecast.map((item, index) => {
      const date = new Date(item.dt * 1000);
      const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
      const time = date.toLocaleTimeString('en-US', { timeStyle: 'short' });
      return (
        <div
          key={index}
          className="text-black  px-4 py-2 flex items-center gap-4"
        >
          <div>
            <img className="h-10 w-10" src={img1} alt="" />
          </div>
          <div className="flex flex-col text-xs font-bold">
            <div className="flex gap-4">
              {' '}
              <p>{weekday}</p>
              <p>{time}</p>
            </div>
            <p>{item.weather[0].description}</p>
          </div>
        </div>
      );
    });
  };
  // temp toggole
  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  const convertTemperature = temp => {
    if (typeof temp !== 'undefined') {
      if (unit === 'metric') {
        return temp;
      } else {
        // Convert Celsius to Fahrenheit
        return (temp * 9) / 5 + 32;
      }
    } else {
      return temp;
    }
  };
  return (
    <div
      className=" relative w-11/12 md:4/5 lg:w-4/5 h-full lg:h-[90vh] my-10  mx-auto py-4 rounded-xl "
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full">
        <h2 className="text-center font-bold text-4xl text-white">
          Weather App
        </h2>
      </div>
      <div className=" w-full px-6 my-3 flex justify-center items-center gap-5">
        <div className="flex justify-center items-center my-4">
          {' '}
          <img className="w-20 h-20 rounded-xl" src={img1} alt="" />
        </div>
        <input
          type="text"
          placeholder="Enter your city"
          onChange={e => setSearch(e.target.value)}
          className=" px-5 py-7 rounded-xl outline-0 bg-white"
        />
        <button
          onClick={searchPressed}
          className=" px-5 py-7 rounded-xl bg-white"
        >
          <FaSearch />
        </button>
      </div>

      <div className="px-6 mb-3  flex justify-center items-center gap-5">
        {typeof weather.main !== 'undefined' ? (
          <div className=" bg-white rounded-xl px-5 py-5 drop-shadow-xl grid grid-cols-2 lg:flex lg:flex-row space-x-3">
            {/* Location  */}
            <p className="px-3 py-3  bg-black text-white rounded-lg">
              Location: {weather.name}
            </p>

            {/* Temperature Celsius  */}
            <div className="flex  items-center justify-between gap-5">
              <p className="px-3 py-3 bg-black text-white rounded-lg">
                Temperature: {convertTemperature(weather.main.temp)}&deg;
                {unit === 'metric' ? 'C' : 'F'}
                <span className="mx-2">
                  <button
                    onClick={toggleUnit}
                    className="rounded-lg bg-white px-3 text-black"
                  >
                    {unit === 'metric' ? 'F' : 'C'}
                  </button>
                </span>
              </p>
            </div>
            {/* Humidity */}
            <div className="flex  items-center gap-5">
              <p className="px-3 py-3 bg-black text-white rounded-lg">
                Humidity: {weather.main.humidity}%
              </p>
              {/* Condition (Sunny ) */}
              <p className="px-3 py-3 bg-black text-white rounded-lg">
                Description: {weather.weather[0].description}
              </p>
            </div>
            <div className="flex items-center gap-5">{renderWeatherIcon()}</div>
          </div>
        ) : (
          <p className="px-3 py-3 bg-black text-white rounded-lg">
            Please input the correct location
          </p>
        )}
      </div>
      {/* Render Forecast */}
      <div className="px-6  w-full flex  items-center gap-5">
        <div className="bg-white w-full rounded-xl px-5 py-5 drop-shadow-xl">
          <h3 className="text-black font-semibold">Forecast</h3>
          <div className="grid grid-cols-5 gap-2">{renderForecast()}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
