/* eslint-disable no-undef */
const path = require("path");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const { customAlphabet } = require("nanoid");

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  },
});
const upload = multer({ storage });

const nanoid = customAlphabet("0123456789", 6);
const pinMap = new Map();

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  let pin;
  do {
    pin = nanoid();
  } while (pinMap.has(pin));

  pinMap.set(pin, {
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: req.file.path,
    createdAt: Date.now(),
  });

  res.json({ pin });
});

app.get("/download/:pin", (req, res) => {
  const { pin } = req.params;
  const entry = pinMap.get(pin);
  if (!entry) return res.status(404).json({ error: "Pin not found" });

  res.download(entry.path, entry.originalName, (err) => {
    if (err) {
      console.error("Download error", err);
      res.status(500).end();
    }
  });
});

app.get("/", (req, res) => res.send("Transfer server running"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
