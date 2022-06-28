const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const path = require("path");

class notes {
  readNotes() {
    return readFile(path.join(__dirname, "./db.json"), "utf-8").then(
      (notes) => {
        let notesArray = [];
        try {
          notesArray = notesArray.concat(JSON.parse(notes));
        } catch (error) {
          notesArray = [];
        }
        return notesArray;
      }
    );
  }

  // Creates new note and adds to db.json
  createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
      path.join(__dirname, "./db.json"),
      JSON.stringify(notesArray, null, 2)
    );
    return note;
  }
}

module.exports = new notes();
