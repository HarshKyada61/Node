const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geoCode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

//Define Pah for express config
const viewsDirectoryPath = path.join(__dirname, "../templates/views");
const publicDirectoryPath = path.join(__dirname, "../public");
const partialsPath = path.join(__dirname, "../templates/partials");

//setup handelbar engine and view path
app.set("view engine", "hbs");
app.set("views", viewsDirectoryPath);
hbs.registerPartials(partialsPath);

//setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "weather",
    name: "Harsh",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helptext: "this page is to help you",
    title: "Help",
    name: "Harsh",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Harsh",
  });
});

app.get("/weather", (req, res) => {
  if(!req.query.address){
    return res.send({
      err: "You must provid address"
    })
  }
  
  geoCode(req.query.address, (err,{lat, long, location} = {}) => {
    if(err){
      return res.send({err});
    }

    forecast(long, lat, (err, data) => {
          if(err){
            return res.send({err});
          }

          res.send({
            forecast: data,
            location
          })
    })
  })
});

app.get("/help/*", (req, res) => {
  res.render("error", {
    title: "404",
    name: "Harsh",
    message: "help artical not found",
  });
});

app.get("*", (req, res) => {
  res.render("error", {
    title: "404 ",
    name: "Harsh",
    message: "page not found",
  });
});


app.listen(3000, () => {
  console.log("Listning!!!");
});
