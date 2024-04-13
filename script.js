function getWeather() {
  // get api key from 'https://openweathermap.org'
  const apiKey = "0a118db40b67c7c8cf7465eb010b305c";
  // get the value of the input element
  const city = document.getElementById("city").value;
  // return if input is empty
  if (!city) {
    alert("Enter a city");
    return;
  }

  // get the url to fetch the data from city and api key

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  // make requests to the OpenWeatherMap API
  fetch(currentWeatherUrl)
    // if responses receive parse it as JSON
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
    })
    // handle error
    .catch((error) => {
      console.error("Error fetching current weather data: ", error);
      alert("Error fetching current weather data. Please try again.");
    });
  // make requests to the OpenWeatherMap API
  fetch(forecastUrl)
    // if responses receive parse it as JSON
    .then((response) => response.json())
    .then((data) => {
      displayHourlyForecast(data.list);
    })
    // handle error
    .catch((error) => {
      console.error("Error fetching hourly forecast data: ", error);
      alert("Error fetching hourly forecast data. Please try again.");
    });
}
function displayCurrentDateTime() {
  const dateTimeDiv = document.getElementById("date-time");
  const currentDate = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

  dateTimeDiv.innerText = formattedDate;
}

// processing the data after getting a response
function displayWeather(data) {
  const tempDivInfo = document.getElementById("temp-div");
  const weatherInfoDiv = document.getElementById("weather-info");
  const weatherIcon = document.getElementById("weather-icon");
  const hourlyForecastDiv = document.getElementById("hourly-forecast");

  weatherInfoDiv.innerHTML = "";
  hourlyForecastDiv.innerHTML = "";
  tempDivInfo.innerHTML = "";

  if (data.cod === "404") {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
  } else {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const temperatureHTML = `<p>${temperature}°C</p>`;
    const weatherHTML = `<h1 class="city-name">${cityName}</h1> <h2>${description}</h2>`;

    displayCurrentDateTime();
    setInterval(displayCurrentDateTime, 1000);
    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHTML;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;

    showImage();
  }
}

function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById("hourly-forecast");
  const next24hours = hourlyData.slice(0, 8);
  next24hours.forEach((item) => {
    const dateTime = new Date(item.dt * 1000);
    let hour = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const amOrPm = hour >= 12 ? "PM" : "AM";
    // Convert to 12-hour format
    hour = hour % 12 || 12; // Handle 0 as 12
    const formattedHour = hour < 10 ? "0" + hour : hour; // Add leading zero for single-digit hours
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes; // Add leading zero for single-digit minutes

    const temperature = Math.round(item.main.temp - 273.15);
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const hourlyItemHTML = `
      <div class="hourly-item">
          <span>${formattedHour}:${formattedMinutes} ${amOrPm}</span>
          <img src="${iconUrl}" alt="hourly weather icon">
          <span>${temperature}°C</span>
      </div>
    `;
    hourlyForecastDiv.innerHTML += hourlyItemHTML;
  });
}

function showImage() {
  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.style.display = "block";
}
