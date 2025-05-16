import { useState } from "react";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiHumidity,
  WiStrongWind,
  WiThermometer,
} from "react-icons/wi";

type WeatherData = {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
};

const WeatherApp: React.FC = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "685ec8cb3f11174eaf7a7a2fb2b3d23a";

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("City not found!");
      const data: WeatherData = await res.json();
      setWeather(data);
    } catch (err) {
      console.log(err);
      setError("Could not fetch weather. Try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.startsWith("01")) return <WiDaySunny size={80} />;
    if (iconCode.startsWith("02") || iconCode.startsWith("03") || iconCode.startsWith("04"))
      return <WiCloudy size={80} />;
    if (iconCode.startsWith("09") || iconCode.startsWith("10")) return <WiRain size={80} />;
    return <WiDaySunny size={80} />; 
  };

  return (
    <div className="max-w-md w-full mx-auto mt-12 px-6 py-8 bg-white rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
        🌤 Weather App
      </h1>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={e => setCity(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={fetchWeather}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition duration-200"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-center mt-4 animate-pulse">Loading...</p>}
      {error && (
        <p className="text-center text-red-500 font-semibold mt-4">{error}</p>
      )}

      {weather && (
        <div className="mt-6 bg-blue-50 p-6 rounded-lg shadow-inner text-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">
            {weather.name}
          </h2>

          <div className="flex justify-center mb-4">
            {getWeatherIcon(weather.weather[0].icon)}
          </div>

          <p className="text-lg capitalize text-gray-700 mb-2">
            {weather.weather[0].description}
          </p>

          <div className="text-blue-900 space-y-1">
            <p className="text-3xl font-semibold">{weather.main.temp}°C</p>

            <p className="flex justify-center items-center gap-2 text-sm">
              <WiThermometer className="text-red-500" size={20} />
              Feels like: {weather.main.feels_like}°C
            </p>

            <p className="flex justify-center items-center gap-2 text-sm">
              <WiHumidity className="text-blue-500" size={20} />
              Humidity: {weather.main.humidity}%
            </p>

            <p className="flex justify-center items-center gap-2 text-sm">
              <WiStrongWind className="text-gray-600" size={20} />
              Wind: {weather.wind.speed} m/s
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
