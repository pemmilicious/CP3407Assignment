
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()
const mysql = require('mysql')

const city = 'Townsville'
const apiKey = 'e44c166edbf14fc31a59ead146573952';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')



//MySQL Connection
const db = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password: '',
  database: 'weather'
});

//connect
db.connect((err) => {
  if(err){
    console.log('Error Connection')
  } 
  console.log('MySQL Connected....')
});

app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE weather'
  db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('database created....');

  });
});


app.get('/', function (req, res, resp) {
      res.render('index', {weather: null, error: null});
      let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
      request(url, function (err, response, body) {
        let weath = JSON.parse(body)
        let post = {Temp: ((weath.main.temp - 32) * 5/9), Humidity: weath.main.humidity, tempmin : ((weath.main.temp_min - 32) * 5/9), tempmax : ((weath.main.temp_max - 32) * 5/9), pressure : weath.main.pressure, sunset : weath.sys.sunrise, sunrise : weath.sys.sunset, windspeed : weath.wind.speed, winddeg : weath.wind.deg};
        let sql = 'INSERT INTO weatherinfo SET ?';
        let query = db.query(sql, post, (err, result) => {
          if(err) throw err;
          console.log(result);
        });
      });
})

app.post('/', function (req, res) {
  // let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let tempText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('index', {weather: tempText, error: null});
      }
    }
  });
})
 
//create the weather table
app.get('/createweathertable', (req, res) =>{
  let sql = 'CREATE TABLE weatherinfo(id int AUTO_INCREMENT, PRIMARY KEY (id), Temp int, Humidity int, tempmin int, tempmax int, pressure int, sunset int, sunrise int, windspeed int, winddeg int)';
  db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('weather table created')
  });
});

//insert data into table
app.get('/addData1', (req, res)=> {
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
  request(url, function (err, response, body) {
    let weath = JSON.parse(body)
    let post = {Temp: weath.main.temp, Humidity: weath.main.humidity, tempmin : weath.main.temp_min, tempmax : weath.main.temp_max, pressure : weath.main.pressure, sunset : weath.sys.sunrise, sunrise : weath.sys.sunset, windspeed : weath.wind.speed, winddeg : weath.wind.deg};
    let sql = 'INSERT INTO weatherinfo SET ?';
    let query = db.query(sql, post, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('weather data added');
    });
  });
});

app.listen(3000, function () {
  console.log('Server started on port 3000!')
})