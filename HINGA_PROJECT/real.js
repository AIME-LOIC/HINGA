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
  const AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

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

        document.getElementById("humidityval").textContent = `${data.main.humidity}%`;
      document.getElementById("pressureval").textContent = `${data.main.pressure} hPa`;
      document.getElementById("visibilityval").textContent = data.visibility ? `${(data.visibility / 1000).toFixed(2)} km` : "N/A";
      document.getElementById("windspeedval").textContent = `${data.wind.speed} m/s`;
      document.getElementById("feelsval").textContent = `${(data.main.feels_like - 273.15).toFixed(2)}°C`;

  
      const sunrise = new Date(data.sys.sunrise * 1000);
      const sunset = new Date(data.sys.sunset * 1000);
      document.querySelector(".sunrise-sunset .item:nth-child(1) h2").textContent = `${sunrise.getHours()}:${String(sunrise.getMinutes()).padStart(2, '0')}`;
      document.querySelector(".sunrise-sunset .item:nth-child(2) h2").textContent = `${sunset.getHours()}:${String(sunset.getMinutes()).padStart(2, '0')}`;
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

  
      displayHourlyForecast(data);
    })
    .catch(() => {
      alert("Failed to fetch weather forecast");
    });

  
  fetch(AIR_POLLUTION_API_URL)
    .then(res => res.json())
    .then(data => {
      if (!data.list || !data.list.length) {
        console.log("No air pollution data found.");
        return;
      }
      const airData = data.list[0];
  
      const aqi = airData.main.aqi;

      const aqiTextMap = {
        1: "Good",
        2: "Fair",
        3: "Moderate",
        4: "Poor",
        5: "Very Poor"
      };

      const aqiElement = document.querySelector(".air-index");
      aqiElement.textContent = aqiTextMap[aqi] || "Unknown";
      aqiElement.className = `air-index aqi-${aqi}`;

      const components = airData.components;
      const pollutants = {
        "PH2.5": components.pm2_5,
        "PH10": components.pm10,
        "SO2": components.so2,
        "CO": components.co,
        "NO": components.no,
        "NO2": components.no2,
        "NH3": components.nh3,
        "O3": components.o3
      };

      Object.keys(pollutants).forEach(key => {
        const pElements = document.querySelectorAll(".air-indices .items p");
        pElements.forEach(p => {
          if (p.textContent === key) {
            const h2 = p.nextElementSibling;
            if (h2) h2.textContent = pollutants[key].toFixed(2);
          }
        });
      });
    })
    .catch(() => {
      alert("Failed to fetch air quality data");
    });
}

function displayHourlyForecast(forecastData) {
  const hourlyForecastContainer = document.querySelector(".hourly-forecast");
  hourlyForecastContainer.innerHTML = ""; 

  
  const hoursToShow = 12;

  for (let i = 0; i < Math.min(hoursToShow, forecastData.list.length); i++) {
    let forecast = forecastData.list[i];
    let date = new Date(forecast.dt_txt);

    
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    let timeStr = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    hourlyForecastContainer.innerHTML += `
      <div class="hourly-item">
        <p class="hourly-time">${timeStr}</p>
        <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
        <p class="hourly-temp">${(forecast.main.temp - 273.15).toFixed(1)}&deg;C</p>
      </div>
    `;
  }
}
