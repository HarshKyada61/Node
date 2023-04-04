const request = require("request");
const geoCode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const inputLocation = process.argv[2];

if(inputLocation){
    geoCode(inputLocation.toString(), (err, {lat,long,location}) => {
        if(err){
          return console.log(err);
        }
        forecast(long, lat, (error, forecastdata) => {
          if(error){
              return console.log(err);
          }
          console.log(location);
          console.log(forecastdata);
        });
      });
}
else {
    console.log('please provide address')
}
