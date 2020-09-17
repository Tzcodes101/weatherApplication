$(document).ready(function () {
    //history var on global scope
    var history = [];

    //on click event to search button
    $("#search-button").on("click", function () {

        //have the search value be the text content of the input element (sibling element)
        var searchValue = $(this).siblings("#search-value").val();

        //call searchWeather function
        searchWeather(searchValue);

    });

    //submit on enter
    $("#search-value").keypress(function (e) {
        if (e.which === 13) {
           var searchValue = $(this).val();
           searchWeather(searchValue);
        }
      });


    //on click event to history buttons from search history
    $(".history").on("click", "li", function () {
        var searchValue = $(this).text();
        searchWeather(searchValue);
    });

    //add to search history (makeRow function)
    function makeRow(text) {

        var liEl = $("<li>").addClass("list-group-item list-group-item-action").text(text);
        $(".history").append(liEl);
    };

    //search for weather
    function searchWeather(searchValue) {
        //send ajax request
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=5eb9383515eca97bbbb3054d2a28b4fa",
            dataType: "json",
            success: function (data) {
                console.log(data);
                // add searchValue to history if it is not already there 
                if (history.indexOf(searchValue) === -1 && searchValue !== "") {
                    history.push(searchValue);
                    window.localStorage.setItem("history", JSON.stringify(history));

                    makeRow(searchValue);
                }

                //clear previous content
                $("#today").empty();

                //create HTML for today's weather
                var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
                var card = $("<div>").addClass("card");
                var cardBody = $("<div>").addClass("card-body");
                var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
                var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");

                //convert from kelvin to F
                var tempK = data.main.temp;
                var tempF = Math.round(((tempK - 273.15) * 9) / 5 + 32);
                var temp = $("<p>").addClass("card-text").text("Temperature: " + tempF + " °F");

                //create img icon
                var img = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png").attr("alt", "weather-icon");
                

                //combine then add to page
                title.append(img);
                cardBody.append(title, temp, humid, wind);
                card.append(cardBody);
                $("#today").append(card);

                //call other endpoint functions
                obtainForecast(searchValue);
                obtainUVIndex(data.coord.lat, data.coord.lon);

            }
        });

    }

    // obtain the forecast
    function obtainForecast(searchValue) {
        $.ajax({
            type: "GET",
            url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=5eb9383515eca97bbbb3054d2a28b4fa",
            dataType: "json",
            success: function (data) {

                //overwrite previous info with a title and empty row
                $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");


                //loop over forecasts in 3-hour intervals
                for (var i = 0; i < data.list.length; i++) {

                    //around 3 pm
                    if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        //create html for bootstrap cards
                        var col = $("<div>").addClass("col-md-2");
                        var card = $("<div>").addClass("card bg-primary text-white");
                        var body = $("<div>").addClass("card-body p-2");
                        var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                        var img = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png").attr("alt", "weather-icon");

                        //convert from kelvin to F    
                        var tempK = data.list[i].main.temp_max;
                        var tempF = Math.round(((tempK - 273.15) * 9) / 5 + 32);

                        //access temp and humidity
                        var p1 = $("<p>").addClass("card-text").text("Temp: " + tempF + " °F");
                        var p2 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");

                        //combine and display on page
                        col.append(card.append(body.append(title, img, p1, p2)));
                        $("#forecast .row").append(col);

                    }
                }
            }
        })
    }

    //obtain UV index
    function obtainUVIndex(lat, lon) {
        //send ajax request
        $.ajax({
            type: "GET",
            url: "http://api.openweathermap.org/data/2.5/uvi?appid=5eb9383515eca97bbbb3054d2a28b4fa&lat=" + lat + "&lon=" + lon,
            dataType: "json",
            success: function (data) {
                var uvIndex = $("<p>").text("UV Index: ");
                var btn = $("<span>").addClass("btn btn-sm").text(data.value);

                //button changes color depending on index
                if (data.value < 7) {
                    btn.addClass("btn-warning");
                } else if (data.value < 3) {
                    btn.addClass("btn-success");
                } else {
                    btn.addClass("btn-danger");
                }

                //combine and display to page
                $("#today .card-body").append(uvIndex.append(btn));

            }
        });
    }

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!! when load page:
    //get current history from local storage, if any
    var history = JSON.parse(window.localStorage.getItem("history")) || [];

    if (history.length > 0) {
        searchWeather(history[history.length - 1]);
    }

    for (var i = 0; i < history.length; i++) {
        makeRow(history[i]);
    }


});











