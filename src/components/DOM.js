import elFactory from '../elFactory';
import processWeather from './api';

async function populateCards(area) {
  const data = await processWeather(area);

  // all the cards to be populated
  currentWeatherCard(data);
  extraInfoCard(data);
  hourlyInfoCard(data);
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

function extraInfoCard(data) {
  let frameElements = document.querySelector('.extraInfo').children;
  frameElements = Array.from(frameElements);
  Object.keys(data.extraInfoValues).forEach((key) => {
    frameElements.forEach((element) => {
      if (key === element.classList.value) {
        const img = element.children[0];
        img.setAttribute('src', `../asset/${key}.svg`);
        img.setAttribute('alt', key);

        const val = element.children[2];
        val.textContent = data.extraInfoValues[key];
      }
    });
  });
}

function hourlyInfoCard(data) {
  const frame = document.querySelector('.hourlyInfo');
  frame.innerHTML = '';
  const currentTime = data.hourlyInfoValues.localtime
    .split(' ')[1]
    .split(':')[0];
  let session = 'am';
  let displayTime;

  for (let i = 1; i < 6; i++) {
    // stupid conversion of 24hr to 12hr clock
    if (parseInt(currentTime, 10) + i >= 24) {
      displayTime = parseInt(currentTime, 10) - 24;
      session = 'am';
      console.log(displayTime + i);
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
        src: `http:${data.hourlyInfoValues.hour[i].condition.icon}`,
      })
    );

    div.appendChild(
      elFactory('div', {}, `${data.hourlyInfoValues.hour[i].temp_c}°C`)
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
  document.querySelector('.currentWeather').innerHTML = '';
  const area = document.querySelector('.searchBar').value;
  populateCards(area);
  document.querySelector('.searchBar').value = '';
}

// to populate when the window opens
populateCards('chennai');

export default populateCards;
