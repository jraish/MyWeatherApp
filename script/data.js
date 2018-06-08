var weatherData = new Vue ({
  el: "#weatherData",
  data: function() {
    return {
      "openWeatherAPI": "",
      "cityAttraction": false,
      "cityWeather": {},
      "cityChoice": "",
      "countries": [],
      "country": "",
      "choiceMade": false,
      "badCity": false,
      "APIKey": "3301fed4c180f2d8b1299ed03aee3880",
      "attractions": {
        "Berlin": "Fernsehturm",
        "Paris": "Eiffel Tower",
        "Vienna": "Opera House"
      },
      "backgroundPicture": "style/videos/mountain.gif",
    }
  },
  
  created: function(){
    this.getCities();
  },
  
  methods: {
    getCities: function() {
      var citiesAPI = "https://restcountries.eu/rest/v2/all";
      
      fetch(citiesAPI)
      .then(function(response){
        return response.json();
      })
      .then(function(response){
        response.forEach(function(element){
          var country = {
            name: element.name,
            code: element.alpha2Code          
          }
          if (country.code == "GB") {country.code = "UK"}
          
          weatherData.countries.push(country);
        })
      })
    },
    
        
    checkForAttraction: function(city){
      if (Object.keys(weatherData.attractions).includes(city)){
        Vue.set(weatherData.cityWeather, 'attraction', weatherData.attractions[city]);
        Vue.set(weatherData, 'cityAttraction', true);
      } else {
        Vue.set(weatherData, 'cityAttraction', false);
      }
    },
    
    getCity: function() {
      weatherData.openWeatherAPI = "https://api.openweathermap.org/data/2.5/weather?q=" + weatherData.cityChoice + "," + weatherData.country
      var weather = this.cityWeather
      
      fetch(weatherData.openWeatherAPI + "&appid=" + weatherData.APIKey)
        .then(function(response) {
          if (response.ok) {
            return response.json();
          } else {
            weatherData.badCity = true;
            weatherData.choiceMade = false;
            return
          }
        })
        .then(function(response) {
        Vue.set(weatherData.cityWeather, 'name', response.name.toString());
        weatherData.checkForAttraction(weather.name);
        Vue.set(weatherData.cityWeather, 'temperature', Math.floor(response.main.temp - 273.15));
        Vue.set(weatherData.cityWeather, 'humidity', response.main.humidity);
        Vue.set(weatherData.cityWeather, 'main', response.weather[0].main);
        weatherData.showWeather();
        weather.cityAttraction = false;
        weatherData.badCity = false;
        weatherData.choiceMade = true;
        })
      },
    
    showWeather: function() {
      if (weatherData.cityWeather.temperature > 35) {
        Vue.set(weatherData, "backgroundPicture", "style/videos/beachfire.gif");
        return;
      } else if (weatherData.cityWeather.main == "Rain") {
        Vue.set(weatherData, "backgroundPicture", "style/videos/rain.gif");
      } else if (weatherData.cityWeather.main == "Clouds") {
        Vue.set(weatherData, "backgroundPicture", "style/videos/clouds.gif")
      } else if (weatherData.cityWeather.main == "Snow") {
        Vue.set(weatherData, "backgroundPicture", "style/videos/snow.gif")
      }else {
        Vue.set(weatherData, "backgroundPicture", "style/videos/mountain.gif")
      }
    
    }
    
  },
  
  
    
}
                           )









