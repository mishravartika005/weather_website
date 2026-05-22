// API KEY
const apiKey = "bf3fe82808a68bb832c98caada5c11b5";

const weatherUrl =
  "https://api.openweathermap.org/data/2.5/weather";

const forecastUrl =
  "https://api.openweathermap.org/data/2.5/forecast";


// SEARCH
const searchForm =
  document.querySelector(".search-box");

const searchInput =
  document.querySelector(".search-input");


// CURRENT WEATHER
const cityName =
  document.querySelector(".city-name");

const mainTemp =
  document.querySelector(".main-temp");

const mainDesc =
  document.querySelector(".main-desc");

const weatherIcon =
  document.querySelector(".main-weather-icon");

const feelsLike =
  document.querySelector(".feels-like");

const windSpeed =
  document.querySelector(".wind-speed");

const humidityValue =
  document.querySelector(".humidity-value");


// HOURLY
const hourlyContainer =
  document.querySelector(".hourly-line");


// WEEKLY
const weekDays =
  document.querySelector(".week-days");

const tempPath =
  document.getElementById("tempPath");

const chartDots =
  document.getElementById("chartDots");

const chartLabels =
  document.getElementById("chartLabels");


// CURRENT WEATHER
async function fetchCurrentWeather(city) {

  try {

    const response = await fetch(
      `${weatherUrl}?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    updateCurrentWeather(data);

  } catch (error) {

    alert(error.message);

  }

}


// UPDATE CURRENT WEATHER
function updateCurrentWeather(data) {

  cityName.textContent =
    data.name;

  mainTemp.textContent =
    `${Math.round(data.main.temp)}°C`;

  mainDesc.textContent =
    data.weather[0].main;

  feelsLike.textContent =
    `Feels like ${Math.round(data.main.feels_like)}°C`;

  windSpeed.textContent =
    `${data.wind.speed} km/h`;

  humidityValue.textContent =
    `${data.main.humidity}%`;

  const iconCode =
    data.weather[0].icon;

  weatherIcon.src =
    `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}


// FORECAST
async function fetchForecast(city) {

  try {

    const response = await fetch(
      `${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    updateHourlyForecast(data.list);

    updateWeeklyForecast(data.list);

  } catch (error) {

    console.log(error);

  }

}


// HOURLY FORECAST
function updateHourlyForecast(forecastList) {

  hourlyContainer.innerHTML = "";

  forecastList.slice(0, 8).forEach((item) => {

    const time =
      item.dt_txt.split(" ")[1].slice(0, 5);

    const temp =
      Math.round(item.main.temp);

    const icon =
      item.weather[0].icon;

    hourlyContainer.innerHTML += `

      <div class="hourly-item">

        <span class="hourly-time">
          ${time}
        </span>

        <img
          src="https://openweathermap.org/img/wn/${icon}@2x.png"
          class="hourly-icon"
        >

        <span class="hourly-temp">
          ${temp}°
        </span>

      </div>

    `;
  });

}


function updateWeeklyForecast(forecastList) {

  // TAKE 8 HOURLY DATA
  const hourlyData =
    forecastList.slice(0, 8);

  weekDays.innerHTML = "";

  chartDots.innerHTML = "";

  chartLabels.innerHTML = "";

  let pathD = "";

  const startX = 60;

  const gap = 110;

  hourlyData.forEach((item, index) => {

    const temp =
      Math.round(item.main.temp);

    const x =
      startX + (index * gap);

    const y =
      260 - (temp * 5);

    // LINE
    if (index === 0) {

      pathD += `M ${x} ${y}`;

    } else {

      pathD += ` L ${x} ${y}`;

    }

    // DOTS
    chartDots.innerHTML += `

      <circle
        cx="${x}"
        cy="${y}"
        r="8"
        class="chart-dot"
      />

    `;

    // TEMP LABELS
    chartLabels.innerHTML += `

      <text
        x="${x - 15}"
        y="${y - 15}"
        class="temp-label"
      >
        ${temp}°
      </text>

    `;

    // TIME
    const time =
      item.dt_txt
        .split(" ")[1]
        .slice(0, 5);

    weekDays.innerHTML += `
      <span>${time}</span>
    `;

  });

  tempPath.setAttribute("d", pathD);

}

// SEARCH
searchForm.addEventListener(
  "submit",
  function (e) {

    e.preventDefault();

    const city =
      searchInput.value.trim();

    if (city !== "") {

      fetchCurrentWeather(city);

      fetchForecast(city);

    }

  }
);


// DEFAULT CITY
fetchCurrentWeather("Kanpur");

fetchForecast("Kanpur");