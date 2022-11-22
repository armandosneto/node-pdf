const app = require("./config/express")();
const fs = require("fs");
const pdf = require("html-pdf");
const puppeteer = require("puppeteer");

const generatePDF = (req, res) => {
  const html = fs.readFileSync("index.html", "utf-8").toString();

  const options = {
    type: "pdf",
    format: "A4",
    orientation: "portrait",
  };

  pdf.create(html, options).toBuffer((err, buffer) => {
    if (err) return res.status(500).json(err);

    res.end(buffer);
  });
};

const generatePDFpuppeteer = async (req, res) => {
  const html = fs.readFileSync("index.html", "utf-8").toString();
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`data:text/html,${html}`, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return res.end(pdf);
};

app.post("/generate-pdf", generatePDF);

app.post("/generate-pdf-puppeteer", generatePDFpuppeteer);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3050, () => {
  console.log(`Servidor rodando na porta 3050`);
});
