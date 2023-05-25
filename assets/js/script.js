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
}
)