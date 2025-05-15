// const apiKey = "db8eeb27198bc75bec6ac127d6c77cf8";

// const searchBtn = document.getElementById("searchBtn");
// const locationBtn = document.getElementById("locationBtn");
// const cityInput = document.getElementById("city_input");

// searchBtn.addEventListener("click", () => {
//   const city = cityInput.value.trim();
//   if (city !== "") {
//     fetchWeatherByCity(city);
//   }
// });

// locationBtn.addEventListener("click", () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         console.log("User location:", latitude, longitude);
//         fetchWeatherByCoords(latitude, longitude);
//       },
//       (error) => {
//         alert("Location access denied or unavailable.");
//         console.error("Geolocation error:", error);
//       }
//     );
//   } else {
//     alert("Geolocation is not supported by your browser.");
//   }
// });

// // Fetch by city
// async function fetchWeatherByCity(city) {
//   try {
//     const response = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
//     );
//     const data = await response.json();
//     if (data.coord) {
//       fetchAllWeatherData(data.coord.lat, data.coord.lon, data.name);
//     } else {
//       alert("City not found!");
//     }
//   } catch (error) {
//     console.error("Error fetching city weather:", error);
//   }
// }

// // Fetch by coordinates
// async function fetchWeatherByCoords(lat, lon) {
//   try {
//     const response = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
//     );
//     const data = await response.json();
//     fetchAllWeatherData(lat, lon, data.name);
//   } catch (error) {
//     console.error("Error fetching weather by location:", error);
//   }
// }

// // Fetch all data
// async function fetchAllWeatherData(lat, lon, cityName) {
//   try {
//     const [weatherRes, airRes] = await Promise.all([
//       fetch(
//         `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${apiKey}&units=metric`
//       ),
//       fetch(
//         `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
//       ),
//     ]);

//     const weatherData = await weatherRes.json();
//     const airData = await airRes.json();

//     updateCurrentWeather(weatherData.current, cityName);
//     updateForecast(weatherData.daily);
//     updateHourlyForecast(weatherData.hourly);
//     updateSunriseSunset(weatherData.current.sunrise, weatherData.current.sunset);
//     updateAirQuality(airData.list[0]);
//   } catch (error) {
//     console.error("Error fetching full weather data:", error);
//   }
// }

// // Update current weather
// function updateCurrentWeather(current, cityName) {
//   document.querySelector(".details h2").textContent = `${current.temp}°C`;
//   document.querySelector(".details p:nth-child(3)").textContent = current.weather[0].description;
//   document.querySelector(".weather-icon img").src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
//   document.querySelector(".card-footer p:nth-child(1)").innerHTML = 
//     `<i class="fa-light fa-calendar"></i> ${new Date(current.dt * 1000).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}`;
//   document.querySelector(".card-footer p:nth-child(2)").innerHTML = 
//     `<i class="fa-light fa-location-dot"></i> ${cityName}`;
//   document.getElementById("humidityval").textContent = `${current.humidity}%`;
//   document.getElementById("pressureval").textContent = `${current.pressure} hPa`;
//   document.getElementById("visibilityval").textContent = `${current.visibility / 1000} km`;
//   document.getElementById("windspeedval").textContent = `${current.wind_speed} m/s`;
//   document.getElementById("feelsval").textContent = `${current.feels_like}°C`;
// }

// // Update 5-day forecast
// function updateForecast(daily) {
//   const forecastItems = document.querySelectorAll(".forecast-item");
//   for (let i = 0; i < 5; i++) {
//     const day = daily[i + 1]; // skip today
//     const item = forecastItems[i];
//     if (!day || !item) continue;

//     item.querySelector("img").src = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
//     item.querySelector("span").textContent = `${Math.round(day.temp.day)}°C`;
//     item.querySelectorAll("p")[0].textContent = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: 'short' });
//     item.querySelectorAll("p")[1].textContent = day.weather[0].main;
//   }
// }

// // Update hourly forecast
// function updateHourlyForecast(hourly) {
//   const cards = document.querySelectorAll(".hourly-forecast .card");
//   for (let i = 0; i < cards.length; i++) {
//     const hour = hourly[i];
//     const card = cards[i];
//     if (!hour || !card) continue;

//     card.querySelector("p").textContent = new Date(hour.dt * 1000).getHours() + ":00";
//     card.querySelector("img").src = `https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`;
//     card.querySelectorAll("p")[1].textContent = `${hour.temp}°C`;
//   }
// }

// // Update sunrise and sunset
// function updateSunriseSunset(sunrise, sunset) {
//   if (!sunrise || !sunset) return;

//   document.querySelector(".sunrise-sunset .item:nth-child(1) h2").textContent =
//     new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   document.querySelector(".sunrise-sunset .item:nth-child(2) h2").textContent =
//     new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// }

// // Update air quality
// function updateAirQuality(airData) {
//   const aqi = airData.main.aqi;
//   const qualityMap = {
//     1: "Good",
//     2: "Fair",
//     3: "Moderate",
//     4: "Poor",
//     5: "Very Poor"
//   };
//   const qualityClass = `aqi-${aqi}`;
//   const airIndexElement = document.querySelector(".air-index");
//   airIndexElement.textContent = qualityMap[aqi];
//   airIndexElement.className = `air-index ${qualityClass}`;

//   const components = airData.components;
//   const pollutants = ["pm2_5", "pm10", "so2", "co", "no", "no2", "nh3", "o3"];
//   const items = document.querySelectorAll(".air-indices .items h2");
//   pollutants.forEach((key, index) => {
//     if (items[index]) {
//       items[index].textContent = components[key];
//     }
//   });
// }
