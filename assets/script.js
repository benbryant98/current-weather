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
        let apiCoord = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=b87e30ca575aaba2c00121e487cdcd6c';

        fetch(apiCoord)
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
        let apiCurrent = 'https://api.openweathermap.org/data/2.5/weather?lat=' + cityLat + '&lon=' + cityLon + '&units=imperial&appid=b87e30ca575aaba2c00121e487cdcd6c';

        fetch(apiCurrent)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function(data) {
                        console.log(data);

                        // create elements for data values
                        let cityHeader = $('<h3>');
                        cityHeader.text(cityName);
                        currentWeather.append(cityHeader);
                        let iconData = $('<img>')
                        let tempData = $('<p>');
                        let windData = $('<p>');
                        let humidityData = $('<p>');

                        // set text to data value from weather API response
                        iconData.attr('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png')
                        tempData.text('Temperature: ' + data.main.temp.toString().slice(0,2) +  '\u00b0F');
                        windData.text('Wind: ' + data.wind.speed.toString().slice(0,2) + 'mph');
                        humidityData.text('Humidity: ' + data.main.humidity + '%');

                        // append elements to div
                        currentWeather.append(iconData);
                        currentWeather.append(tempData);
                        currentWeather.append(windData);
                        currentWeather.append(humidityData);
                        weatherCard.append(currentWeather);
                    });
                };
            });
    };
    var getFiveDay = function () {
        let apiFiveDay = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat + '&lon=' + cityLon + '&units=imperial&appid=b87e30ca575aaba2c00121e487cdcd6c';

        fetch(apiFiveDay)
            .then(function(response) {
                if(response.ok) {
                    response.json().then(function(data) {
                        console.log(data);

                        let fiveDayHeader = $('<h3>');
                        fiveDayHeader.text('5 Day Forecast:');
                        fiveDay.append(fiveDayHeader);
                        
                        var fiveDayData = [];
                        for(i=0;i<5;i++) {
                            fiveDayData[i] = {
                                date: data.list[i].dt_txt.slice(0,10),
                                icon: data.list[i].weather[0].icon,
                                temp: data.list[i].main.temp.toString().slice(0,2),
                                wind: data.list[i].wind.speed.toString().slice(0,2),
                                humidity: data.list[i].main.humidity
                            };

                            console.log(fiveDayData[i]);
                            let dayDiv = $('<div>');
                            dayDiv.addClass('day-div');

                            let fiveDate = $('<p>');
                            let fiveIcon = $('<img>');
                            let fiveTemp = $('<p>');
                            let fiveWind = $('<p>');
                            let fiveHumidity = $('<p>');

                            fiveDate.text(fiveDayData[i].date);
                            fiveIcon.attr('src','http://openweathermap.org/img/w/' + fiveDayData[i].icon + '.png');
                            fiveTemp.text('Temp: ' + fiveDayData[i].temp + '\u00b0F');
                            fiveWind.text('Wind: ' + fiveDayData[i].wind + 'mph');
                            fiveHumidity.text('Humidity: ' + fiveDayData[i].humidity + '%');

                            dayDiv.append(fiveDate);
                            dayDiv.append(fiveIcon);
                            dayDiv.append(fiveTemp);
                            dayDiv.append(fiveWind);
                            dayDiv.append(fiveHumidity);
                            weatherCard.append(dayDiv);
                        };
                    })
                }
            })
    }
});
