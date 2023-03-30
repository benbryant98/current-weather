$( document ).ready(function() {

    var searchForm = $('#search-form');
    var currentWeather = $('#current-weather');
    var fiveDay = $('#five-day');
    var cityNameInput = $('#city-input');

    searchForm.on("submit", function (event) {
        event.preventDefault();
        cityName = cityNameInput.val();
        console.log(cityName);
});
})