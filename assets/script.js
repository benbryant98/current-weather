// ensure all html elements have loaded before executing JavaScript
$( document ).ready(function() {

    var searchForm = $('#search-form');
    var weatherCard = $('#weather-card');
    var currentWeather = $('#current-weather');
    var fiveDay = $('#five-day');
    var cityNameInput = $('#city-input');
    
    // handles search submission and runs function to convert name to coordinates
    searchForm.on("submit", function (event) {
        event.preventDefault();
        cityName = cityNameInput.val();
        console.log(cityName);
        getCoordinates(cityName);
    });

    // converts city name string into coordinates using openweathermap geolocation API
    var getCoordinates = function (cityName) {
        let apiURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=b87e30ca575aaba2c00121e487cdcd6c';

        fetch(apiURL)
            .then(function(response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        // saves coordinate values from API response to variables for use in weather functions
                        cityLat = data[0].lat;
                        cityLon = data[0].lon;
                        getCurrentWeather(cityLat, cityLon, cityName);
                        getFiveDay();
                    })
                } else {
                    alert('Error: ' + response.statusText);
                }
            });
    };

    var getCurrentWeather = function () {
        let apiURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + cityLat + '&lon=' + cityLon + '&units=imperial&appid=b87e30ca575aaba2c00121e487cdcd6c';

        fetch(apiURL)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function(data) {
                        console.log(data);

                        // create elements for data values
                        let cityHeader = $('<h3>');
                        cityHeader.text(cityName);
                        currentWeather.append(cityHeader);
                        let tempData = $('<p>');
                        let windData = $('<p>');
                        let humidityData = $('<p>');

                        // set text to data value from weather API response
                        tempData.text('Temperature: ' + data.main.temp +  '\u00b0F');
                        windData.text('Wind: ' + data.wind.speed + 'mph');
                        humidityData.text('Humidity: ' + data.main.humidity + '%');

                        // append elements to div
                        currentWeather.append(tempData);
                        currentWeather.append(windData);
                        currentWeather.append(humidityData);
                        weatherCard.append(currentWeather);
                    });
                };
            });
    }
});
