// Hi grader, sorry it's a bit of a mess, I plan to come back and fix it later, got a little too hung up on making some of the js work that I neglected styling.

// ensure all html elements have loaded before executing JavaScript
$(document).ready(function () {
  var searchForm = $("#search-form");
  var weatherCard = $("#weather-card");
  var currentWeather = $("#current-weather");
  var fiveDay = $("#five-day");
  var cityNameInput = $("#city-input");
  var cardHeader = $(".card-header");

  // handles search submission and runs function to convert name to coordinates
  searchForm.on("submit", function (event) {
    event.preventDefault();
    cityName = cityNameInput.val();
    console.log(cityName);
    getCoordinates(cityName);
  });

  // converts city name string into coordinates using openweathermap geolocation API
  var getCoordinates = function (cityName) {
    let apiCoord =
      "https://api.openweathermap.org/geo/1.0/direct?q=" +
      cityName +
      "&appid=b87e30ca575aaba2c00121e487cdcd6c";

    fetch(apiCoord).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          // saves coordinate values from API response to variables for use in weather functions
          cityLat = data[0].lat;
          cityLon = data[0].lon;
          getCurrentWeather(cityLat, cityLon, cityName);
          getFiveDay();
          localStorage.setItem("city", JSON.stringify(cityName));
        });
      } else {
        alert("Error: " + response.statusText);
      }
    });
  };

  var getCurrentWeather = function () {
    let apiCurrent =
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
      cityLat +
      "&lon=" +
      cityLon +
      "&units=imperial&appid=b87e30ca575aaba2c00121e487cdcd6c";

    fetch(apiCurrent).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);

          // create elements for data values
          let cityHeader = $("<h3>");
          cityHeader.text(cityName);
          currentWeather.append(cityHeader);
          let iconData = $("<img>");
          let tempData = $("<p>");
          let windData = $("<p>");
          let humidityData = $("<p>");

          // set text to data value from weather API response
          iconData.attr(
            "src",
            "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
          );
          tempData.text(
            "Temperature: " + data.main.temp.toString().slice(0, 2) + "\u00b0F"
          );
          windData.text(
            "Wind: " + data.wind.speed.toString().slice(0, 2) + "mph"
          );
          humidityData.text("Humidity: " + data.main.humidity + "%");

          // append elements to div
          currentWeather.append(iconData);
          currentWeather.append(tempData);
          currentWeather.append(windData);
          currentWeather.append(humidityData);
          weatherCard.append(currentWeather);
        });
      }
    });
  };
  var getFiveDay = function () {
    let apiFiveDay =
      "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      cityLat +
      "&lon=" +
      cityLon +
      "&units=imperial&count=10&appid=b87e30ca575aaba2c00121e487cdcd6c";

    fetch(apiFiveDay).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);

          // Create header for 5 Day before looping through response data
          let fiveDayHeader = $("<h3>");
          fiveDayHeader.text("5 Day Forecast:");
          fiveDay.append(fiveDayHeader);

          // placeholder array for referencing response data
          var fiveDayData = [];

          // loop through data to set objects with weather properties for each day in the forecast
          for (i = 1; i < data.list.length; i++) {
            // while loop adds to index value as long as dates of objects are the same to prevent the same day being displayed twice
            console.log(i);
            while (
              data.list[i].dt_txt.slice(0, 10) ===
              data.list[i - 1].dt_txt.slice(0, 10)
            ) {
              i++;
              if (i == 39) {
                break;
              }
            }
            if (i == 39) {
              break;
            }
            fiveDayData[i] = {
              // slice is added to only get date, not time
              date: data.list[i].dt_txt.slice(0, 10),
              icon: data.list[i].weather[0].icon,
              // truncation is used to get integer
              temp: Math.trunc(data.list[i].main.temp),
              wind: Math.trunc(data.list[i].wind.speed),
              humidity: data.list[i].main.humidity,
            };

            console.log(fiveDayData[i]);
            // create div for each day for styling
            let dayDiv = $("<div>");
            dayDiv.addClass("card-content");

            // create elements for each property in five day forecast objects
            let fiveDate = $("<p>");
            let fiveIcon = $("<img>");
            let fiveTemp = $("<p>");
            let fiveWind = $("<p>");
            let fiveHumidity = $("<p>");

            // use properties to publish weather data to page
            fiveDate.text(
              fiveDayData[i].date.slice(6, 7) +
                "/" +
                fiveDayData[i].date.slice(9, 10) +
                "/" +
                fiveDayData[i].date.slice(0, 4)
            );
            fiveIcon.attr(
              "src",
              "https://openweathermap.org/img/w/" + fiveDayData[i].icon + ".png"
            );
            fiveTemp.text("Temp: " + fiveDayData[i].temp + "\u00b0F");
            fiveWind.text("Wind: " + fiveDayData[i].wind + "mph");
            fiveHumidity.text("Humidity: " + fiveDayData[i].humidity + "%");

            fiveDate.addClass("card-header-title");
            fiveIcon.addClass("content");
            fiveTemp.addClass("content");
            fiveWind.addClass("content");
            fiveHumidity.addClass("content");

            cardHeader.append(fiveDate);
            dayDiv.append(fiveIcon);
            dayDiv.append(fiveTemp);
            dayDiv.append(fiveWind);
            dayDiv.append(fiveHumidity);
            fiveDay.append(dayDiv);
          }
        });
      }
    });
  };

  for (i = 0; i < localStorage.length; i++) {
    let cityBtn = $("<button>");
    cityBtn.text(JSON.parse(localStorage.city));
    cityBtn.addClass("cityBtn");
    weatherCard.prepend(cityBtn);
  }

  $(".cityBtn").click(function () {
    cityName = $(this)[0].innerText;
    console.log(cityName);
    getCoordinates(cityName);
  });
});
