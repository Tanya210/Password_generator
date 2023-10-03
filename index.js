var usertab=document.querySelector(".button1");
var searchtab=document.querySelector(".button2");
var weathercontainer=document.querySelector(".loading");
var grantAcess= document.getElementById("grant");
var loadingscreen=document.getElementById("section4");
var grantacesscontainer=document.getElementById("section3");
var weatherinformationcontainer=document.querySelector(".section5");
var currentWeatherPlace=document.querySelector(".heading3");
var currentWeatherMain=document.querySelector(".heading4");
var currentWeatherTemp=document.querySelector(".temp");
var currentWeatherWind=document.querySelector(".value1");
var currentWeatherMainHumidity=document.querySelector(".value2");
var currentWeatherCloud=document.querySelector(".value3");
var secondTab=document.querySelector(".search");
var cityInput=document.querySelector(".searchcity");
var searchbtn=document.querySelector(".btn");
const API_KEY="f9b78b883d04b5d732dfcee696a1a0ad";

function getLocation(){
    var latitude;
    var longitude;
    return new  Promise((resolve, reject) => {
        if("geolocation" in navigator) { //navigator means browser geolocations mean location ko dekho browser me hai ya nhi
          navigator.geolocation.getCurrentPosition(
            (position) => {
              latitude = position.coords.latitude;
              longitude = position.coords.longitude;
              const coordinates = [latitude, longitude];
              resolve(coordinates);
            },
            () => {
              reject(new Error("Unable to detect Location"));
            }
          );
        } 
        else{
          reject(new Error("Geolocation is not supported by this browser."));
        }
      });


    }
grantAcess.addEventListener("click", function(){
    grantacesscontainer.classList.remove("visible");
    grantacesscontainer.classList.add("invisible");
    loadingscreen.classList.remove("invisible");
    loadingscreen.classList.add("visible");
    
    const location=getLocation();
    location.then((coordinate)=> {
        console.log(coordinate);
        let latitude = coordinate[0];
        let longitude = coordinate[1];
        const weather = getWeather(latitude , longitude);
        weather.then((value)=>{
            showWeather(value);
        })  
        weather.catch((e)=>{
            alert(e);
        })
    })
});

async function getWeather(latitude , longitude){
  try{
      let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
      let data = await result.json()
      // console.log(result);
      // console.log(data);
      return updateData(data);
  }
  catch(e){
      alert(e);
  }
 
}

function showWeather(value){
  loadingscreen.classList.remove("visible");
  loadingscreen.classList.add("invisible");
  weatherinformationcontainer.classList.remove("invisible");
  weatherinformationcontainer.classList.add("visible");

  currentWeatherPlace.innerText=value[0];
  currentWeatherMain.innerText=value[1];
  currentWeatherTemp.innerText=value[2];
  currentWeatherWind.innerText=value[3] + "m/s";
  currentWeatherMainHumidity.innerText=value[4] + "%";
  currentWeatherCloud.innerText=value[5] + "%";

}

searchtab.addEventListener("click", function(){
  grantacesscontainer.classList.remove("visible");
  grantacesscontainer.classList.add("invisible");
  secondTab.classList.remove("invisible");
  secondTab.classList.add("visible");
  weatherinformationcontainer.classList.remove("visible");
  weatherinformationcontainer.classList.add("invisible");
});

usertab.addEventListener("click", function(){
  secondTab.classList.remove("visible");
  secondTab.classList.add("invisible");
  grantacesscontainer.classList.remove("invisible");
  grantacesscontainer.classList.add("visible");
  weatherinformationcontainer.classList.remove("visible");
  weatherinformationcontainer.classList.add("invisible");
});

searchbtn.addEventListener("click", function(){
  var city=cityInput.value;
  // console.log(city);
  // getWeatherCity(city);
  const cityWeather=getWeatherCity(city);
  cityWeather.then((value)=>{
    showWeather(value);
  })
  cityWeather.catch((e)=>{
    alert(e);
  })

  });

async function getWeatherCity(city){
  try{
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    console.log(response);
    let cityData=await response.json()
    console.log(cityData);
    return updateData(cityData);
  }
  catch(e){
    alert(e);
  }

}

function updateData(data){
  let temp = data.main.temp;
      let place = data.name;
      let humidity = data.main.humidity;
      let windSpeed = data.wind.speed;
      let clouds = data.clouds.all;
      let main = data.weather[0].main;
      return[place , main , temp , windSpeed , humidity , clouds];
}