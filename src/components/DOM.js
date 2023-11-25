import elFactory from '../elFactory';
import processWeather from './api';

async function currentWeather() {
  const data = await processWeather('New York');
  console.log(data);
  const frame = document.querySelector('.currentWeather');
  Object.keys(data.currentWeatherValues).forEach((key) => {
    if (key === 'name') {
      frame.appendChild(
        elFactory('div', { class: key }, `${data.currentWeatherValues[key]},`)
      );
    } else if (key === 'temp_c') {
      frame.appendChild(
        elFactory('div', { class: key }, `${data.currentWeatherValues[key]}°C`)
      );
    } else if (key === 'feelslike_c') {
      frame.appendChild(
        elFactory(
          'div',
          { class: key },
          `Feels Like: ${data.currentWeatherValues[key]}°C`
        )
      );
    } else if (key === 'icon') {
      frame.appendChild(
        elFactory(
          'img',
          { src: `https:${data.currentWeatherValues[key]}`, class: key },
          ''
        )
      );
    } else {
      frame.appendChild(
        elFactory('div', { class: key }, data.currentWeatherValues[key])
      );
    }
  });
}

export default currentWeather;
