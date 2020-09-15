$(document).ready(function () {
    //history var on global scope
    var history = [];

    //on click event to search button
    $("#search-button").on("click", function () {

        //have the search value be the text content of the input element (sibling element)
        var searchValue = $(this).siblings("#search-value").val();
        
        //make a row
        // makeRow(searchValue);

        //call searchWeather function
        searchWeather(searchValue);

    });


    //on click event to history buttons from search history
    $(".history").on("click", "li", function () {
        //insert code here
    });

    //add to search history (makeRow function)
    function makeRow(text) {
        
        var liEl = $("<li>").addClass("list-group-item list-group-item-action").text(text);
        $(".history").append(liEl);
    };

    //search for weather
    function searchWeather(searchValue) {
        //set search value to input of user 
        // var searchValue = $("#search-value").val();
        // console.log(searchValue);

        // add searchValue to history if it is not already there 
        if (history.indexOf(searchValue) === -1 && searchValue !== "") {
            history.push(searchValue);
            console.log(history);
            window.localStorage.setItem("history", JSON.stringify(history));

            makeRow(searchValue);
        }

        //send ajax request
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=5eb9383515eca97bbbb3054d2a28b4fa",
            dataType: "json",
            success: function(data) {
                console.log(data);

                //clear previous content
                $("#today").empty();

                //create HTML for today's weather
                var title = $("<h3>").addClass("card-title").text(data.main.name + " (" + new Date().toLocaleDateString) + ")";
                var card = $("<div>").addClass("card");
                var cardBody = $("<div>").addClass("card-body");
                var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
                var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
                var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " F");
                var img = $("<img>").attr("src", "http://openweather.org/img/w/" + data.weather[0].icon + "&appid=5eb9383515eca97bbbb3054d2a28b4fa");

                //combine then add to page
                // title.append(img);
                cardBody.append(title, img, temp, humid, wind);
                card.append(cardBody);
                $("#today").append(card);

                //call other endpoint functions
                obtainForecast(searchValue);

        }
        });

    }

    // obtain the forecast
    function obtainForecast(searchValue) {
        console.log(searchValue);
        $.ajax({
            type: "GET",
            url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue +"&appid=5eb9383515eca97bbbb3054d2a28b4fa",
            dataType: "json",
            success: function(data) {
                console.log(data);
                //overwrite previous info with a title and empty row
                var heading = $("<h4>").addClass("mt-3").text("5-day Forecast");
                var row = $("<div>").addClass("row");
                $("#forecast").html(heading, row);

                console.log(data.list);
                

                //loop over forecasts in 3-hour intervals
                for (var i = 0; i < data.list.length; i++) {
                    //around 3 pm
                    if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        //create html for bootstrap cards
                        var col = $("<div>").addClass("col-md-2");
                        var card = $("<div>").addClass("card bg-primary text-white");
                        var body = $("<div>").addClass("card-body p-2");

                        var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                        console.log(title);

                        var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather.icon + "&appid=5eb9383515eca97bbbb3054d2a28b4fa");

                        var p1 = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp_max + " F");

                        var p2 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.temp_max + "%");

                        //combine and put on page
                        body.append(title, img, p1, p2);
                        card.append(body);
                        col.append(card);
                        $("#forecast .row").append(col);

                    }
                }
            }
        })
    }

    //obtain UV index



    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!! when load page:
    //get current history from local storage, if any
    var history = JSON.parse(window.localStorage.getItem("history")) || [];
    console.log(history);

    if (history.length > 0) {
        searchWeather(history[history.length - 1]);
    }

    for (var i = 0; i < history.length; i++) {
        makeRow(history[i]);
    }


});











