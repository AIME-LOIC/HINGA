let cityInput = document.getElementById("city_input"),
  searchBtn = document.getElementById("searchBtn"),
  api_key = "db8eeb27198bc75bec6ac127d6c77cf8",
  currentWeatherCard = document.querySelectorAll(".weather-left .card")[0],
  fiveDaysForecastCard = document.querySelector(".day-forecast");

searchBtn.addEventListener("click", getCityCoordinates);

function getCityCoordinates() {
  let cityName = cityInput.value.trim();
  if (!cityName) return;

  const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

  fetch(GEOCODING_API_URL)
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        alert(`City "${cityName}" not found.`);
        return;
      }
      let { name, lat, lon, country, state } = data[0];
      getWeatherDetails(name, lat, lon, country, state);
      cityInput.value = "";
    })
    .catch(() => {
      alert(`Failed to fetch coordinates of ${cityName}`);
    });
}

function getWeatherDetails(name, lat, lon, country, state) {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
  const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

  
  fetch(WEATHER_API_URL)
    .then(res => res.json())
    .then(data => {
      let date = new Date();
      currentWeatherCard.innerHTML = `
        <div class="current-weather">
          <div class="details">
            <p>Now</p>
            <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
            <p>${data.weather[0].description}</p>
          </div>
          <div class="weather-icon">
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
          </div>
        </div>
        <hr>
        <div class="card-footer">
          <p><i class="fa-light fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
          <p><i class="fa-light fa-location-dot"></i> ${name}, ${country}</p>
        </div>
      `;
    })
    .catch(() => {
      alert("Failed to fetch current weather");
    });

  
  fetch(FORECAST_API_URL)
    .then(res => res.json())
    .then(data => {
      let uniqueForecastDays = [];
      let fiveDaysForecast = data.list.filter(forecast => {
        let forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          uniqueForecastDays.push(forecastDate);
          return true;
        }
        return false;
      });

      fiveDaysForecastCard.innerHTML = "";
      for (let i = 1; i < fiveDaysForecast.length; i++) {
        let date = new Date(fiveDaysForecast[i].dt_txt);
        fiveDaysForecastCard.innerHTML += `
          <div class="forecast-item">
            <div class="icon-wrapper">
              <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="">
              <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
            </div>
            <p>${date.getDate()} ${months[date.getMonth()]}</p>
            <p>${days[date.getDay()]}</p>
          </div>
        `;
      }
    })
    .catch(() => {
      alert("Failed to fetch weather forecast");
    });
}
