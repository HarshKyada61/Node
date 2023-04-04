const fs = require('fs');
const chalk = require('chalk');

const addNote = (title, body) => {
    const notes = loadNotes();

    const duplicateNote = notes.find((note) => note.title === title)
    if(!duplicateNote){
        notes.push({
            "title": title,
            "body": body
        });
        saveNotes(notes);
        console.log(chalk.green.inverse('Note added successfully'));
    }
    else {
        console.log(chalk.red.inverse("title already exist"));
    }
   
}

const removeNote = (title) => {
    const notes = loadNotes();
    const newNotes = notes.filter((note) => note.title !== title)
    saveNotes(newNotes);

    if(notes.length === newNotes.length){
        console.log(chalk.red.inverse('No Note removed'));
    }
    else{
        console.log(chalk.green.inverse('Note Removed successfully'));
    }
    
}

const listNodes = () => {
    const notes = loadNotes();
    console.log(chalk.bold.inverse('Your Notes!!'))

    notes.forEach((note) => {
        console.log(note.title);
    })
}

const readNote = (title) => {
    const notes = loadNotes();
    const note = notes.find((note) => note.title === title);
    if(note){
        console.log(chalk.bold.inverse(note.title));
        console.log(note.body);
    }
    else{
        console.log(chalk.red.inverse('no Note Found!!'));
    }
   
}

const saveNotes = (notes) => {
    const dataJSON = JSON.stringify(notes);
    fs.writeFileSync('notes.json', dataJSON);

}
const loadNotes = () => {
    try{
        const dataBuffer = fs.readFileSync('notes.json');
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    }
    catch(e){
        return [];
    }
}


module.exports = {
    addNote,
    removeNote,
    listNodes,
    readNote
};