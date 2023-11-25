import elFactory from '../elFactory';
import processWeather from './api';

async function populateCards(area) {
  const data = await processWeather(area);

  // all the cards to be populated
  currentWeatherCard(data);
}

function currentWeatherCard(data) {
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

// eslint-disable-next-line
const searchArea = (() => {
  const searchImg = document.querySelector('.search');
  const searchBar = document.querySelector('.searchBar');
  searchImg.addEventListener('click', searchEvent);
  searchBar.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      searchEvent();
    }
  });
})();

function searchEvent() {
  document.querySelector('.currentWeather').innerHTML = '';
  const area = document.querySelector('.searchBar').value;
  populateCards(area);
  document.querySelector('.searchBar').value = '';
}

// to populate when the window opens
populateCards('chennai');

export default populateCards;
