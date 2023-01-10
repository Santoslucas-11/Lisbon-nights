const axios = require('axios');

class ApiService {
    constructor(){
        this.api = axios.create({
            baseURL: 'https://api.tomorrow.io/v4/timelines?location=40.75872069597532,-73.98529171943665&fields=temperature&timesteps=1h&units=metric&apikey=Nx8Vy9GHOvuGUsppgMjYn7GlSm8FZDeE'
        });
    }

    getWeather = () => {
      return this.api.get('/');
  };
}

module.exports = ApiService;