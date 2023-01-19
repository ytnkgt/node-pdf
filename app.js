import express from "express";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { format } from "date-fns";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET");
  next();
});

app.post("/pdf", async (req, res, next) => {
  const url = req.body.url;
  console.log(url);

  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();h

  await page.goto(url);

  // await page.waitForNavigation({
  //   waitUntil: "networkidle0",
  // });

  const options = { format: "A4", landscape: true };
  const pdf = await page.pdf(options);

  fs.writeFileSync(
    path.join(
      __dirname,
      "files",
      `${format(new Date(), "yyyyMMdd_hhmmss")}.pdf`
    ),
    pdf
  );
  res.status(200).json({
    message: "pdf saved!",
  });
});
