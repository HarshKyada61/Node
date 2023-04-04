const request = require('request')

const geoCode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ encodeURIComponent(address) +'.json?access_token=pk.eyJ1IjoiaGFyc2gta3lhZGEiLCJhIjoiY2xlNDNtaG43MDh1bTNuc2ExcWhnNDh6MCJ9.kfKxswm-yRFykKWzLMgegQ&limit=1'
    request({url, json:true}, (err, {body}) => {
            if(err){
                callback('unable to connect to location service')
            }
            else if(body.features.length === 0 ){
                callback('No match found')
            }
            else{
                callback(undefined,{
                    lat: body.features[0].center[1],
                    long : body.features[0].center[0],
                    location: body.features[0].place_name
                })
            }
        }
    )
}

module.exports = geoCode