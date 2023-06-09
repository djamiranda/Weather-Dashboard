$(document).ready(function () {
    var APIKEY = "&appID=79aa6f208e3465fd8b2baea62924e6e9"
    var baseURL = "https://api.openweathermap.org/data/2.5/forecast?";
    var cityData = []
// fetches locally stored data, if available
    function getStoredData(city) {
        fetchStoredData();
        var index = -1;
        for (var i=0; i<cityData.length; i++) {
    
          if (cityData[i].name == city) {
            index = i;
          }
        }
        return index;
      }
    //   fetch & render search history
      function fetchStoredData() {
        var tempCityData = localStorage.getItem("cityData");
        if (tempCityData) {
          cityData = JSON.parse(tempCityData);
          $("#history").empty();
          for (var i=0; i<cityData.length; i++) {
            $("#history").append(
                        $("<button>").attr({class: "btn btn-outline btn-xl search-button"}).text(cityData[i].name));
          }
          $("#history").prepend($("<button>").attr({class: "btn btn-outline btn-xl clear"}).text("clear history"));
        }
      }
      $(document).on("click", ".clear", function(event) {
        event.preventDefault();
        cityData = [];
        localStorage.removeItem("cityData")
        $("#history").empty();
        fetchStoredData();
      });
    
      fetchStoredData();
    // stores cities locally
      function storeCitiesData() {
        localStorage.setItem("cityData", JSON.stringify(cityData));
      }
    // gets city from search & capitalizes it
      function capitalizeCity(city) {
        return city
          .replace(/(\B)[^ ]*/g, match => (match.toLowerCase()))
          .replace(/^[^ ]/g, match => (match.toUpperCase()));
      }
    //   search button
      $(document).on("click", ".search-button", function (event) {
        event.preventDefault();
    
        var city = $("#search-input").val().trim();
        city = capitalizeCity(city);
        var savedCity = $(event.target).text(); 
        if (!city && savedCity != $("#search-button").text()) {
          city = $(event.target).text(); 
        }
        else if (!city) {
          return;
        }
        else {
          $("#search-input").val(""); 
        }
        var index = getStoredData(city); 
        if (index < 0) { 
          var queryURL = "https://api.openweathermap.org/geo/1.0/direct?q=";
    // api call for  lat & long city then stores locally
          $.ajax({ 
            url: queryURL + city + APIKEY,
            method: "GET",
          }).then(function (response) {
            cityData.push({
              name: response[0].name,
              lat: response[0].lat,
              lon: response[0].lon,
            });
            storeCitiesData();
            fetchStoredData();
            index = cityData.length - 1;
            getAndRenderData(index);
          });
        }
        
        else {
          getAndRenderData(index);
        }
      });
    // gets lat & long in imperial units
      function getAndRenderData(index) {
        queryURL =
          baseURL +
          "lat=" +
          cityData[index].lat +
          "&lon=" +
          cityData[index].lon +
          "&units=imperial" +
          APIKEY;
    
        $.ajax({
          url: queryURL,
          method: "GET",
        }).then(function (response) {
          var forecast = response.list;
          var temperature = (forecast[0].main.temp).toFixed(0);
          var today = dayjs(forecast[0].dt_txt).format("MM/DD/YYYY");
    // todays data & image
          var weatherImg =
            "<img width='50px' height='50px' src='https://openweathermap.org/img/wn/" +
            forecast[0].weather[0].icon +
            "@2x.png'>";
          $(".city").html(
            "<h2>" +
              cityData[index].name +
              " (" +
              today +
              ") " +
              weatherImg +
              "</h2>"
          );
          $(".temp").text("Temperature: " + temperature + " °F");
          $(".wind").text("Wind: " + forecast[0].wind.speed + " MPH");
          $(".humidity").text("Humidity: " + forecast[0].main.humidity + "%");
        // forecast html
          $("#forecast").empty();
        $("#forecastTitle").html("<h2>5 Day Forecast</h2>");
    //   for loop forecast section
      for (var i in forecast) {
        var date = dayjs(forecast[i].dt_txt);

        if (dayjs(date).format("HH:mm:ss") == "12:00:00") {
          var col = $("<section>").addClass("col-md-2 col-12");
          var card = $("<section>").addClass("card");
          var body = $("<section>").addClass("card-body");
          var forecastDay = $("<h6>")
            .addClass("card-title")
            .text(dayjs(date).format("dddd"))
          var forecastDate = $("<h6>").addClass("card-title").text(dayjs(date).format("MM/DD/YYYY"));
          weatherImg = $("<img>").attr({
            width: "50px",
            height: "50px",
            src:
              "https://openweathermap.org/img/wn/" +
              forecast[i].weather[0].icon +
              "@2x.png",
          });
          temperature = $("<p>")
            .addClass("card-text")
            .html(
              "Temp: " +
                (forecast[i].main.temp).toFixed(0) +
                " &#8457;"
            );
          var wind = $("<p>")
            .addClass("card-text")
            .html("Wind: " + (forecast[i].wind.speed).toFixed(2) + " MPH");
          var humidity = $("<p>")
            .addClass("card-text")
            .html("Humidity: " + forecast[i].main.humidity.toFixed(2) + "%");
          body.append(forecastDay, forecastDate, weatherImg, temperature, wind, humidity);
          card.append(body);
          col.append(card);
          $("#forecast").append(col);
        }
      }
      return;
    });
    return;
  }
});