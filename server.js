const path = require("path");
const express = require("express");

const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const readNotes = () => {
  const noteLists = fs.readFileSync("./db/db.json");
  let noteList = JSON.parse(noteLists);
  return noteList;
};

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  const data = readNotes();
  res.json(data);
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  const noteList = readNotes();
  if (newNote) {
    noteList.push(newNote);
    let note = JSON.stringify(noteList, null, 2);
    fs.writeFile("./db/db.json", note, (err) =>
      err ? console.error(err) : console.log("Commit logged!")
    );
    res.json(note);
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const noteList = readNotes();
  const noteId = req.params.id;
  const updatedNotes = noteList.filter((note) => noteId !== note.id);
  let note = JSON.stringify(updatedNotes, null, 2);
  fs.writeFile("./db/db.json", note, (err) =>
    err ? console.error(err) : console.log("Commit logged!")
  );
  res.send(updatedNotes);
});
app.post("/api/clear", (req, res) => {
  noteList.length = 0;

  res.json({ ok: true });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`App listening on PORT: http://localhost:${PORT}`);
});