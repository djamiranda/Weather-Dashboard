$(document).ready(function () {
    var APIKEY = "8c7df6150f9dfe4b9fc100e2519e4fd4"
    var baseURL = "https://api.openweathermap.org/data/2.5/forecast?";
    var cityData = []

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
    
      function storeCitiesData() {
        localStorage.setItem("cityData", JSON.stringify(cityData));
      }
    
      function capitalizeCity(city) {
        return city
          .replace(/(\B)[^ ]*/g, match => (match.toLowerCase()))
          .replace(/^[^ ]/g, match => (match.toUpperCase()));
      }
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
    
      function getAndRenderData(index) {
        queryURL =
          baseURL +
          "lat=" +
          cityData[index].lat +
          "&lon=" +
          cityData[index].lon +
          APIKEY;
    
        $.ajax({
          url: queryURL,
          method: "GET",
        }).then(function (response) {
          var forecast = response.list;
          var temperature = (forecast[0].main.temp - 273.15 * 1.8 + 32).toFixed(0);
          var today = dayjs(forecast[0].dt_txt).format("MM/DD/YYYY");
    
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
          $(".wind").text("Wind: " + forecast[0].wind.speed / 1.609344 + " MPH");
          $(".humidity").text("Humidity: " + forecast[0].main.humidity + "%");