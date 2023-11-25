import elFactory from '../elFactory';
import processWeather from './api';
import humidity from '../../asset/humidity.svg';
import wind from '../../asset/wind_kph.svg';
import precip from '../../asset/precip_mm.svg';
import cloud from '../../asset/cloud.svg';
import pressure from '../../asset/pressure_mb.svg';
import searchImage from '../../asset/search.svg';
import githubImage from '../../asset/github.svg';

async function populateCards(area) {
  try {
    const data = await processWeather(area);
    // all the cards to be populated
    currentWeatherCard(data);
    extraInfoCard(data);
    hourlyInfoCard(data);
    resetTemperatureSwitch();
  } catch (error) {
    console.log(error);
    errorHandling();
  }
}

function currentWeatherCard(data) {
  const frame = document.querySelector('.currentWeather');
  frame.innerHTML = '';
  document.querySelector('.errorMessage').textContent = '';
  Object.keys(data.currentWeatherValues).forEach((key) => {
    if (key === 'name') {
      frame.appendChild(
        elFactory('div', { class: key }, `${data.currentWeatherValues[key]},`)
      );
    } else if (key === 'temp_c') {
      frame.appendChild(
        elFactory('div', { class: key }, `${data.currentWeatherValues[key]}°C`)
      );
      frame.appendChild(
        elFactory(
          'div',
          { class: key, id: 'displayToggle' },
          `${data.fahrenheitValues.temp_f}°F`
        )
      );
    } else if (key === 'feelslike_c') {
      frame.appendChild(
        elFactory(
          'div',
          { class: key },
          `Feels Like: ${data.currentWeatherValues[key]}°C`
        )
      );
      frame.appendChild(
        elFactory(
          'div',
          { class: key, id: 'displayToggle' },
          `Feels Like: ${data.fahrenheitValues.feelslike_f}°F`
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

function extraInfoCard(data) {
  let frameElements = document.querySelector('.extraInfo').children;
  frameElements = Array.from(frameElements);
  const extraInfoImages = [humidity, wind, precip, cloud, pressure];
  let count = 0;
  Object.keys(data.extraInfoValues).forEach((key) => {
    frameElements.forEach((element) => {
      if (key === element.classList.value) {
        const img = element.children[0];
        img.setAttribute('src', extraInfoImages[count]);
        img.setAttribute('alt', key);
        count++;

        const val = element.children[2];
        val.textContent = data.extraInfoValues[key];
      }
    });
  });
}

function hourlyInfoCard(data) {
  const frame = document.querySelector('.hourlyInfo');
  frame.innerHTML = '';
  let currentTime = data.hourlyInfoValues.localtime.split(' ')[1].split(':')[0];
  let session = 'am';
  let displayTime;

  for (let i = 1; i < 6; i++) {
    // stupid conversion of 24hr to 12hr clock
    if (parseInt(currentTime, 10) + i >= 24) {
      displayTime = parseInt(currentTime, 10) - 24;
      currentTime = 0 - i;
      session = 'am';
      if (displayTime + i === 0) {
        displayTime = 12 - i;
      }
    } else if (parseInt(currentTime, 10) + i >= 12) {
      displayTime = parseInt(currentTime, 10) - 12;
      session = 'pm';
      if (displayTime + i === 0) {
        displayTime = 12 - i;
        session = 'pm';
      }
    } else {
      displayTime = parseInt(currentTime, 10);
      session = 'am';
    }
    const div = document.createElement('div');
    div.appendChild(elFactory('div', {}, `${displayTime + i} ${session}`));

    div.appendChild(
      elFactory('img', {
        src: `http:${
          data.hourlyInfoValues.hour[parseInt(currentTime, 10) + i].condition
            .icon
        }`,
      })
    );
    div.appendChild(
      elFactory(
        'div',
        { class: 'forcastValues' },
        `${data.hourlyInfoValues.hour[parseInt(currentTime, 10) + i].temp_c}°C`
      )
    );
    div.appendChild(
      elFactory(
        'div',
        { class: 'forcastValues', id: 'displayToggle' },
        `${data.hourlyInfoValues.hour[parseInt(currentTime, 10) + i].temp_f}°F`
      )
    );

    frame.appendChild(div);
  }
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
  const area = document.querySelector('.searchBar').value;
  populateCards(area);
  document.querySelector('.searchBar').value = '';
}

// eslint-disable-next-line
const temperateSwitch = (() => {
  const btn = document.querySelector('.temperatureSwitch');
  btn.addEventListener('click', () => {
    btn.children[0].classList.toggle('toggle');
    btn.children[1].classList.toggle('toggle');

    let mainTempChange = document.querySelectorAll('.temp_c');
    mainTempChange = Array.from(mainTempChange);
    let feelsTempChange = document.querySelectorAll('.feelslike_c');
    feelsTempChange = Array.from(feelsTempChange);
    let forecastChange = document.querySelectorAll('.forcastValues');
    forecastChange = Array.from(forecastChange);

    const allChange = mainTempChange.concat(feelsTempChange, forecastChange);
    allChange.forEach((element) => {
      if (element.id === 'displayToggle') {
        element.setAttribute('id', '');
      } else {
        element.setAttribute('id', 'displayToggle');
      }
    });
  });
})();

function resetTemperatureSwitch() {
  const btn = document.querySelector('.temperatureSwitch');
  // to reset the color when new city is
  btn.children[0].classList.add('toggle');
  btn.children[1].classList.remove('toggle');
}

function errorHandling() {
  const span = document.querySelector('.errorMessage');
  span.textContent = '*Please enter a valid city';
}

// eslint-disable-next-line
const settingImage = (() => {
  const search = document.querySelector('.search');
  const github = document.querySelector('.github');

  search.setAttribute('src', searchImage);
  github.setAttribute('src', githubImage);
})();
export default populateCards;
