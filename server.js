const express = require("express");
const { notes } = require("./db/db.json");
const path = require("path");
const fs = require("fs");

const PORT = 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Set up GET, POST, DELETE API routes
app.get("/api/notes", (req, res) => res.json(notes));

app.post("/api/notes", (req, res) => {
  req.body.id = notes.length.toString();
  if (!validateNote(req.body)) {
    res.status(400).send("The note is not properly formatted.");
  } else {
    const note = createNewNote(req.body, notes);
    res.json(note);
  }
});

app.delete("/api/notes/:id", (req, res) => {
  deleteNote(req.params.id, notes)
    .then(createNewNote(req.body, notes))
    .then(res.json());
});

// SET UP HTML ROUTES
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// FUNCTIONS

// Creates new note and adds to db.json
function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

// Function to delete object from Array
function deleteNote(note, notesArray) {
  const result = notesArray.splice(note, 1);
  console.log(result);
}

// Function to Validate Data coming from note
function validateNote(note) {
  if (!note.title || typeof note.title !== "string") {
    return false;
  }
  if (!note.text || typeof note.text !== "string") {
    return false;
  }
  return true;
}

// Listening Route
app.listen(PORT, () => {
  console.log(`Note taker now on port ${PORT}`);
});
