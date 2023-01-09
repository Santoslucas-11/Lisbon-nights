const axios = require("axios");

const options = {
  method: 'GET',
  url: 'https://dark-sky.p.rapidapi.com/%7Blatitude%7D,%7Blongitude%7D',
  params: {units: 'auto', lang: 'en'},
  headers: {
    'X-RapidAPI-Key': '33419c2111msh6666ed072b9d557p1d7413jsnc3b0f61f375b',
    'X-RapidAPI-Host': 'dark-sky.p.rapidapi.com'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});