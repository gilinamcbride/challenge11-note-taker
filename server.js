const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const { v4: uuidv4 } = require("uuid");
const Notes = require("./db/utils");
// const htmlRoutes = require("./routes/html");
// const apiRoutes = require("./routes/api");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// app.use("/", htmlRoutes);
// app.use("/api", apiRoutes);

// // Set up GET, POST, DELETE API routes
app.get("/api/notes", (req, res) => {
  Notes.readNotes().then((notesArray) => res.json(notesArray));
});

app.post("/api/notes", async (req, res) => {
  let notes = await Notes.readNotes();
  req.body.id = uuidv4();
  try {
    const note = Notes.createNewNote(req.body, notes);
    res.json(note);
  } catch (error) {
    res.status(400).send("The note is not properly formatted.");
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  if (req.params.id) {
    const oldNotes = await Notes.readNotes();
    const deletedList = oldNotes.filter((note) => note.id !== req.params.id);

    fs.writeFileSync(
      path.join(__dirname, "./db/db.json"),
      JSON.stringify(deletedList)
    );
    res.json(deletedList);
  }
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

// Listening Route
app.listen(PORT, () => {
  console.log(`Note taker now on port ${PORT}`);
});
