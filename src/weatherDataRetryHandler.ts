import axios from "axios";
import {weatherapiToken} from "./__constants/config";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetchWithRetry = async (url: string, retries = 2) => {
  let attempt = 0;
  let backoff = 1000;

  while (attempt <= retries) {
    try {
      return await axios.get(url);
    } catch (err : any) {
      console.error("API Error:", err.message);

      if (attempt === retries) throw err;

      await delay(backoff);
      backoff *= 2;
      attempt++;
    }
  }
};

export const getWeatherWithRetryHandler = async (event: any) => {
  const { city } = event;

  if (!city) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "VALIDATION_ERROR",
        message: "City is required",
      }),
    };
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherapiToken}`;

  try {
    const res = await fetchWithRetry(url);
    if(res){
      const kelvin = res.data.main.temp;
      const celsius = kelvin - 273.15;
  
      return {
        statusCode: 200,
        body: JSON.stringify({
          city,
          temp: Number(celsius.toFixed(2)),
          conditions: res.data.weather?.[0]?.main || "Unknown",
        }),
      };
    }else{
      throw Error("error while retrying weather api")
    }
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "API_ERROR",
        message: "Weather API failed after retries",
      }),
    };
  }
};
