const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// multer konfigürasyonu
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/sendEmail", upload.single("file"), async (req, res) => {
  try {
    const formData = req.body;
    const file = req.file;
  
    sendEmail(formData, file)
      .then(() => {
        console.log("E-posta gönderildi.");
        res.json({ message: "Başvuru alındı ve e-posta gönderildi." });
      })
      .catch((error) => {
        console.error("E-posta gönderme hatası:", error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (e) {
    console.log(e);
    res.status(500).send("Dosya yükleme hatası");
  }
});

app.listen(5000, () => {
  console.log("App is listening on port 5000");
});

async function sendEmail(formData, file) {
  console.log("Email gönderiliyor");
  // console.log(formData);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "itechroboticssoftware@gmail.com",
      pass: "iosi dxho dyek lrul",
    },
  });

  let htmlContent = `
        <p><strong>İsim:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Pozisyon:</strong> ${formData.position}</p>
        <p><strong>Açıklama:</strong> ${formData.description}</p>
    `;

  if (file) {
    const attachment = {
      filename: file.originalname,
      content: file.buffer,
    };

    transporter
      .sendMail({
        from: "itechroboticssoftware@gmail.com",
        to: "info@itechrobotics.com",
        subject: "Itech robotik İletişim Mesajı ✔",
        html: htmlContent,
        attachments: [attachment],
      })
      .then((info) => {
        console.log("E-posta gönderildi:", info);
      })
      .catch((error) => {
        console.error("E-posta gönderme hatası:", error);
        throw error;
      });
  } else {
    console.log("Dosya yüklenmedi.");
    throw new Error("Dosya yüklenmedi.");
  }
}
