// no need to use try and catch block since async function returns a promise. A problem in the fetch request will directly send a reject
async function getWeather(area) {
  const url = `https://api.weatherapi.com/v1/current.json?key=ac66662de5e14d8d983165313232311&q=${area}`;
  const response = await fetch(url, {
    mode: 'cors',
  });
  const result = await response.json();
  if (response.ok) {
    return result;
  }
  throw new Error(result.error.code);
}

function processWeather(area) {
  getWeather(area)
    .then((data) => {
      console.log(data);
      const requireDataObj = {
        [getKey('data.location.name')]: data.location.name,
        [getKey('data.location.region')]: data.location.region,
        [getKey('data.current.temp_c')]: data.current.temp_c,
        [getKey('data.current.temp_f')]: data.current.temp_f,
        [getKey('data.current.feelslike_c')]: data.current.feelslike_c,
        [getKey('data.current.feelslike_fs')]: data.current.feelslike_f,
        [getKey('data.current.condition')]: data.current.condition.text,

        [getKey('data.current.humidty')]: data.current.humidty,
        [getKey('data.current.wind_kph')]: data.current.wind_kph,
        [getKey('data.current.precip_mm')]: data.current.precip_mm,
        [getKey('data.current.cloud')]: data.current.cloud,
        [getKey('data.current.pressure_mb')]: data.current.pressure_mb,
      };
      console.log(requireDataObj);
    })
    .catch((error) => console.log('ERROR:', error));
}

function getKey(key) {
  const newKey = key.split('.');
  return newKey[newKey.length - 1];
}

export default processWeather;
