
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

////MySQL Connection
//var mysql = require('mysql');
//var connect = mysql.createConnection({
//    //properties...
//    host: 'localhost',
//    user: 'root',
//    password: '',
//    database: 'weatherDB'
//});

//connection.connect(function(error){
//    if(!!error) {
//        console.log('Error');
//    } else {
//        console.log('Mysql connection Established!')
//    }
//});


const apiKey = 'e44c166edbf14fc31a59ead146573952';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null});
      }
    }
  });
})

//app.get('/', function(req, resp){
//    // about sql DB
//    connection.query("SELECT * FROM weatherDB", function(error, rows, fields)
//    if(!!error){
//        console.log('Error in Query')
//    }else {
//        console.log('Successful Query!')
//    }
//}));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})