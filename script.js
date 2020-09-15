$(document).ready(function () {
    //history var on global scope
    var history = [];

    //on click event to search button
    $("#search-button").on("click", function () {

        //have the search value be the text content of the input element (sibling element)
        var searchValue = $(this).siblings("#search-value").val();
        
        //make a row
        makeRow(searchValue);

        //call searchWeather function
        searchWeather(searchValue);

    });


    //on click event to history buttons from search history
    $(".history").on("click", "li", function () {
        //insert code here
    });

    //add to search history (makeRow function)
    function makeRow(text) {
        var text = $("#search-value").val();
        console.log(text);
        var liEl = $("<li>").addClass("list-group-item list-group-item-action").text(text);
        $(".history").append(liEl);
    };

    //search for weather
    function searchWeather(searchValue) {
        //set search value to input of user 
        var searchValue = $("#search-value").val();
        console.log(searchValue);

        // add searchValue to history if it is not already there 
        if (history.indexOf(searchValue) === -1) {
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

        }
        });

    }

    //obtain the forecast

    //obtain UV index



    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!! when load page:
    //get current history from local storage, if any
    var history = JSON.parse(window.localStorage.getItem("history")) || [];

    if (history.length > 0) {
        searchWeather(history[history.length - 1]);
    }
    console.log(history);

    for (var i = 0; i < history.length; i++) {
        makeRow(hisotry[i]);
    }


});











