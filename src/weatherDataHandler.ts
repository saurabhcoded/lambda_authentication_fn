import axios from "axios";
import {weatherapiToken} from "./__constants/config";

const cache = new Map(); // { city: { data, expires } }

export const getWeatherHandler = async (event: any) => {
  const { city } = event;
  if (!city) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "City required" }),
    };
  }

  // Check cache
  const cached = cache.get(city);
  if (cached && cached.expires > Date.now()) {
    return { statusCode: 200, body: JSON.stringify(cached.data) };
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherapiToken}`;

    const res = await axios.get(url);
    const kelvin = res.data.main.temp;
    const celsius = kelvin - 273.15;

    const output = {
      city,
      temp: Number(celsius.toFixed(2)),
      conditions: res.data.weather?.[0]?.main || "Unknown",
    };

    // Cache for 1 min
    cache.set(city, { data: output, expires: Date.now() + 60000 });

    return { statusCode: 200, body: JSON.stringify(output) };
  } catch (err: any) {
    return {
      statusCode: err.response?.status || 500,
      body: JSON.stringify({
        error: "WEATHER_API_FAILED",
        message: err.response?.data?.message || "API request failed",
      }),
    };
  }
};
