const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const port = 3004;

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://0.0.0.0:27017/crud", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
  console.log("Connection to the database successful");
});

const formdataschema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  fileUrl: String,
});

const formData = mongoose.model("formdata", formdataschema);

app.use("/uploads/images", express.static(path.join(__dirname, "uploads/images")));

const storage = multer.diskStorage({
  destination: "./uploads/images",
  filename: function (req, file, callback) {
    const uniqueIdentifier = Date.now();
    const filename = `${uniqueIdentifier}_${file.originalname}`;
    const fileUrl = `http://localhost:3004/uploads/images/${filename}`;
    callback(null, filename);
    req.fileUrl = fileUrl;
  },
});

const upload = multer({ storage });

app.post("/", upload.single("file"), async (req, res) => {
  try {
    const reciveData = req.body;
    const fileUrl = req.fileUrl;

    const formdata = new formData({
      name: reciveData.name,
      email: reciveData.email,
      phone: reciveData.phone,
      fileUrl: fileUrl,
    });

    await formdata.save();
    res.status(200).send({ message: "User added successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: "Error adding user" });
  }
});

app.get("/", async (req, res) => {
  try {
    const data = await formData.find();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, phone } = req.body;
    const updatedUser = await formData.findByIdAndUpdate(userId, { name, email, phone });
    res.status(200).send({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating user", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    await formData.findByIdAndDelete(userId);
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
