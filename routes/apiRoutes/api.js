const Notes = require("../../db/utils");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Set up GET, POST, DELETE API routes
router.get("/notes", (req, res) => {
  Notes.readNotes().then((notesArray) => res.json(notesArray));
});

router.post("/notes", async (req, res) => {
  let notes = await Notes.readNotes();
  req.body.id = uuidv4();
  try {
    const note = Notes.createNewNote(req.body, notes);
    res.json(note);
  } catch (error) {
    res.status(400).send("The note is not properly formatted.");
  }
});

router.delete("/notes/:id", async (req, res) => {
  if (req.params.id) {
    const oldNotes = await Notes.readNotes();
    const deletedList = oldNotes.filter((note) => note.id !== req.params.id);

    fs.writeFileSync(
      path.join(__dirname, "../../db/db.json"),
      JSON.stringify(deletedList)
    );
    res.json(deletedList);
  }
});

module.exports = router;
