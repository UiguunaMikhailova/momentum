import playList from './playList.js';

const time = document.querySelector('.time');
const dateElement = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const input = document.querySelector('.name');

const slidePrev = document.querySelector('.slide-prev');
const slideNext = document.querySelector('.slide-next');

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const weatherWind = document.querySelector('.weather-wind');
const weatherHumidity = document.querySelector('.weather-humidity');
const inputCity = document.querySelector('.city');

const quoteButton = document.querySelector('.change-quote');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');

const audio = new Audio();
const playButton = document.querySelector('.play');
const playPrevBtn = document.querySelector('.play-prev');
const playNextBtn = document.querySelector('.play-next');
const playListContainer = document.querySelector('.play-list');


let num;
let numQuotes = getRandomNumQuote();
var last = 1;
let isPlay = false;
let playNum = 0;

const showTime = () => {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.innerText = currentTime;
    showDate();
    showGreeting();
    setTimeout(showTime, 1000);
}

const showDate = () => {
    const date = new Date();
    const currentDate = date.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'});
    dateElement.textContent = currentDate;
}

const showGreeting = () => {
    const timeOfDay = getTimeOfDate();

    greeting.textContent = `Good ${timeOfDay}, `;
}

const getTimeOfDate = () => {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 0 && hours < 5) return 'night';
    if (hours >= 5 && hours < 12) return 'morning';
    if (hours >= 12 && hours < 17) return 'day';
    if (hours >= 17 && hours <= 23) return 'evening';
}

function setLocalStorage() {
    localStorage.setItem('name', input.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
  if(localStorage.getItem('name')) {
    input.value = localStorage.getItem('name');
  }
}
window.addEventListener('load', getLocalStorage);

showTime();

function getRandomNum() {
    const max = 20;
    const min = 1;
    num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

function setBg() {
    num = getRandomNum();
    const timeOfDay = getTimeOfDate();
    const img = new Image();
    img.src = `./../assets/img/${timeOfDay}/${num}.jpg`;
    img.onload = () => {
        document.body.style.backgroundImage = `url(${img.src})`
    };
}

setBg();

function getSlideNext() {
    if (num < 20) {
        num++;
    } else {
        num = 1;
    }
    setBg();
}

function getSlidePrev() {
    if (num > 1) {
        num--;
    } else {
        num = 20;
    }
    setBg();
}

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

inputCity.value = 'Moscow';

window.onload = function () {
    const o = ymaps.geolocation;
    inputCity.value = o.city;
}

async function getWeather(city) {
    const apiKey = '57a298fde127e956f9b98a9331bfd02d';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=en&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round((data.main.temp))}°C`;
    weatherDescription.textContent = data.weather[0].description;
    weatherWind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
    weatherHumidity.textContent = `Humidity: ${data.main.humidity} %`;
}

getWeather(inputCity.value);

inputCity.addEventListener('change', () => {
    getWeather(inputCity.value);
})

async function getQuotes(num) {
    const quotes = 'data.json';
    const res = await fetch(quotes);
    const data = await res.json();
    quote.textContent = data[num].text;
    author.textContent = data[num].author;
}

getQuotes(getRandomNumQuote());

quoteButton.addEventListener('click', () => {
    numQuotes = getRandomNumQuote();
    getQuotes(numQuotes);
})

function getRandomNumQuote() {
    const max = 3;
    const min = 0;
    let random;
    do {
        random = Math.floor(Math.random() * (max - min)) + min;
    } while (random === last);
    last = random;
    return random;
}

function toggleAudioBtn() {
    if (isPlay) {
        audio.pause();
        isPlay = false;
        playButton.classList.remove('pause');
    } else {
        isPlay = true;
        playAudio();
    }
}

function playAudio() {
    playButton.classList.add('pause');
    const list = playListContainer.children;
    for (const item of list) {
        if (item.getAttribute('name') === playList[playNum].title) {
            item.classList.add('item-active');
        } else {
            item.classList.remove('item-active');
        }
    }
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    audio.play();
}

playButton.addEventListener('click', toggleAudioBtn);

playList.forEach(el => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.setAttribute('name', el.title);
    li.textContent = el.title;
    playListContainer.append(li);
})

function playNext() {
    if (playNum < 3) {
        playNum++;
    } else {
        playNum = 0;
    }
    playAudio();
}

function playPrev() {
    if (playNum > 0) {
        playNum--;
    } else {
        playNum = 3;
    }
    playAudio();
}

playPrevBtn.addEventListener('click', playPrev);
playNextBtn.addEventListener('click', playNext);


