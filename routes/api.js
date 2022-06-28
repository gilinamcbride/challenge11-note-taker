const Notes = require("../../db/utils");
const router = require("express").Router();

// Set up GET, POST, DELETE API routes
router.get("/api/notes", (req, res) => {
  Notes.readNotes().then((notesArray) => res.json(notesArray));
});

router.post("/api/notes", async (req, res) => {
  let notes = await Notes.readNotes();
  req.body.id = uuidv4();
  try {
    const note = Notes.createNewNote(req.body, notes);
    res.json(note);
  } catch (error) {
    res.status(400).send("The note is not properly formatted.");
  }
});

router.delete("/api/notes/:id", async (req, res) => {
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

module.exports = router;
