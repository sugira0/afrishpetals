const fs = require("fs/promises");
const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT) || 8080;
const SUBMISSIONS_LOG = path.join(__dirname, "submissions.log");

const CLEAN_ROUTE_TO_FILE = {
  "/": "index.html",
  "/home": "index.html",
  "/about": "about.html",
  "/events": "events.html",
  "/booking": "booking.html",
  "/contact": "contact.html",
  "/qr": "qr.html"
};

const HTML_REDIRECTS = {
  "/index.html": "/",
  "/about.html": "/about",
  "/events.html": "/events",
  "/booking.html": "/booking",
  "/contact.html": "/contact",
  "/qr.html": "/qr"
};

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

function clean(value) {
  return String(value || "").trim();
}

function envBool(name, fallback = false) {
  const value = clean(process.env[name]).toLowerCase();
  if (!value) {
    return fallback;
  }

  return ["1", "true", "yes", "y", "on"].includes(value);
}

function parsePort(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function pickFields(payload, keys) {
  return keys.reduce((acc, key) => {
    acc[key] = clean(payload[key]);
    return acc;
  }, {});
}

function missingRequired(payload, requiredKeys) {
  return requiredKeys.filter((key) => !clean(payload[key]));
}

function asLines(data) {
  return Object.entries(data)
    .filter(([, value]) => clean(value))
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

async function saveSubmission(kind, payload) {
  const stamp = new Date().toISOString();
  const block = [
    `time: ${stamp}`,
    `type: ${kind}`,
    asLines(payload),
    "---"
  ].join("\n");

  await fs.appendFile(SUBMISSIONS_LOG, `${block}\n`, "utf8");
}

function buildTransporter() {
  const host = clean(process.env.MAIL_HOST);
  const user = clean(process.env.MAIL_USER);
  const pass = clean(process.env.MAIL_PASS);

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parsePort(process.env.MAIL_PORT, 587),
    secure: envBool("MAIL_SECURE", false),
    auth: { user, pass }
  });
}

const transporter = buildTransporter();
const mailTo = clean(process.env.MAIL_TO) || "hello@afrishpetals.rw";
const mailFrom = clean(process.env.MAIL_FROM) || clean(process.env.MAIL_USER) || "hello@afrishpetals.rw";

async function sendRestaurantEmail({ subject, payload }) {
  if (!transporter) {
    return { delivered: false, reason: "smtp_not_configured" };
  }

  await transporter.sendMail({
    from: mailFrom,
    to: mailTo,
    subject,
    text: asLines(payload)
  });

  return { delivered: true };
}

app.post("/api/contact", async (req, res) => {
  try {
    const payload = pickFields(req.body, ["name", "email", "subject", "message"]);
    const missing = missingRequired(payload, ["name", "email", "subject", "message"]);

    if (missing.length) {
      return res.status(400).json({
        ok: false,
        error: `Missing required fields: ${missing.join(", ")}`
      });
    }

    await saveSubmission("contact", payload);
    const result = await sendRestaurantEmail({
      subject: `New Contact Request - ${payload.subject}`,
      payload
    });

    return res.json({
      ok: true,
      delivered: result.delivered
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Could not process contact request."
    });
  }
});

app.post("/api/booking", async (req, res) => {
  try {
    const payload = pickFields(req.body, [
      "name",
      "phone",
      "email",
      "bookingType",
      "date",
      "time",
      "guests",
      "space",
      "tablePreference",
      "eventType",
      "budget",
      "message"
    ]);

    const missing = missingRequired(payload, ["name", "phone", "email", "bookingType", "date", "time", "guests"]);

    if (missing.length) {
      return res.status(400).json({
        ok: false,
        error: `Missing required fields: ${missing.join(", ")}`
      });
    }

    await saveSubmission("booking", payload);
    const result = await sendRestaurantEmail({
      subject: `New ${payload.bookingType === "event" ? "Event" : "Table"} Booking Request`,
      payload
    });

    return res.json({
      ok: true,
      delivered: result.delivered
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Could not process booking request."
    });
  }
});

Object.entries(HTML_REDIRECTS).forEach(([fromPath, toPath]) => {
  app.get(fromPath, (req, res) => {
    res.redirect(301, toPath);
  });
});

Object.entries(CLEAN_ROUTE_TO_FILE).forEach(([cleanRoute, fileName]) => {
  app.get(cleanRoute, (req, res) => {
    res.sendFile(path.join(__dirname, fileName));
  });
});

app.use(express.static(__dirname));

app.listen(PORT, () => {
  const mailStatus = transporter ? "enabled" : "disabled (configure SMTP env vars)";
  console.log(`Afrish Petals server running at http://localhost:${PORT}`);
  console.log(`Email delivery: ${mailStatus}`);
});
