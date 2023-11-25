// no need to use try and catch block since async function returns a promise. A problem in the fetch request will directly send a reject
async function getWeather(area) {
  const APIkey = 'ac66662de5e14d8d983165313232311';
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${APIkey}&q=${area}`;
  const response = await fetch(url, {
    mode: 'cors',
  });
  const result = await response.json();
  if (response.ok) {
    return result;
  }
  throw new Error(result.error.code);
}

// consistent-return: off
async function processWeather(area) {
  try {
    const data = await getWeather(area);
    const currentWeatherValues = {
      [getKey('data.location.name')]: data.location.name,
      [getKey('data.location.region')]: data.location.region,
      [getKey('data.current.temp_c')]: data.current.temp_c,
      [getKey('data.current.feelslike_c')]: data.current.feelslike_c,
      [getKey('data.current.condition')]: data.current.condition.text,
      [getKey('data.current.condition.icon')]: data.current.condition.icon,
    };
    const extraInfoValues = {
      [getKey('data.current.humidity')]: data.current.humidity,
      [getKey('data.current.wind_kph')]: data.current.wind_kph,
      [getKey('data.current.precip_mm')]: data.current.precip_mm,
      [getKey('data.current.cloud')]: data.current.cloud,
      [getKey('data.current.pressure_mb')]: data.current.pressure_mb,
    };
    const hourlyInfoValues = {
      [getKey('data.forecast.forecastday[0].hour')]:
        data.forecast.forecastday[0].hour,
      [getKey('data.location.localtime')]: data.location.localtime,
    };
    const fahrenheitValues = {
      [getKey('data.current.temp_f')]: data.current.temp_f,
      [getKey('data.current.feelslike_f')]: data.current.feelslike_f,
    };

    return {
      currentWeatherValues,
      extraInfoValues,
      hourlyInfoValues,
      fahrenheitValues,
    };
  } catch (error) {
    throw new Error(error);
  }
}
function getKey(key) {
  const newKey = key.split('.');
  return newKey[newKey.length - 1];
}

export default processWeather;
