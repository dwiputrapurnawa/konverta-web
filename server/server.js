require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const imageToPDF = require("image-to-pdf");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + "/uploads/images");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname);
    }
});

const uploadImage = multer({ storage: storage }).array("files[]");

const app = express();

app.use(express.json());
app.use(express.static(__dirname + "/uploads"));

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}));

app.get("/", (req, res) => {
    res.send({"server_status": "Up"});
})

app.post("/api/imgtopdf", (req, res) => {
    uploadImage(req, res, (err) => {
        if(err) {
            console.log(err);
            res.send({success: false, message: "Failed to upload image"});
        }

        const pages = req.files.map((value) => value.path);

        let random = (Math.random() + 1).toString(36).substring(2);

        const pdfTitle = random + ".pdf"

        imageToPDF(pages, imageToPDF.sizes.A4).pipe(fs.createWriteStream(__dirname + "/uploads/pdf/" + pdfTitle));

        res.send({success: true, pdf: pdfTitle})
    })
});

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log("Server running at port " + PORT);
})






