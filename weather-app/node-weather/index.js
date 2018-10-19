const request = require('request');

let apiKey = 'e44c166edbf14fc31a59ead146573952';
let city = 'brisbane';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

request(url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    let weather = JSON.parse(body)
    let message = weather.main.temp;
    console.log(message.units=metric);
  }
});