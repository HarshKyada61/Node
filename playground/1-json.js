const fs = require('fs');

// const book = {
//     title: "Harry Potter",
//     author: "J.K. rollings"
// }

// const bookJSON = JSON.stringify(book);
// fs.writeFileSync('1-json.json', bookJSON);


const dataBuffer = fs.readFileSync('1-json.json')
const dataJSON = dataBuffer.toString();
const data = JSON.parse(dataJSON);
data.name = "Harsh";
data.age = 21;

const NewDataJson =  JSON.stringify(data);

fs.writeFileSync('1-json.json', NewDataJson);