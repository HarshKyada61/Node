const request = require('request');

const forecast = (long, lat, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=73321b3c838cf9c5bb8d61cde6b0ff88&query='+lat+','+long;
    request({url, json:true}, (err, {body}) => {
        if(err){
            callback('unable to connect to weather forcast service')
        }
    
        else if(body.error){
            callback('unable to find location')
        }
        else{
            callback(undefined,`it's ${body.current.temperature} degree out. but it feels like ${body.current.feelslike} degree out.`);
        }
    })
}

module.exports = forecast;