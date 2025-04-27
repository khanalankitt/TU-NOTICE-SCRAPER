process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const URL = "https://iost.tu.edu.np/notices";
const DISCORD_WEBHOOK_URL = process.env.DISCORD_URL;
const SENT_FILE = "sentNotices.json";
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function loadSentNotices() {
  try {
    const data = fs.readFileSync(SENT_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveSentNotices(notices) {
  fs.writeFileSync(SENT_FILE, JSON.stringify(notices, null, 2));
}

async function scrapeWebsite() {
  try {
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);
    const sentNotices = loadSentNotices();
    const newNotices = [];
    const now = Date.now();

    $("h5").each((i, el) => {
      const title = $(el).text().trim();

      if (title.includes("CSIT") && title.includes("2079")) {
        const recentlySent = sentNotices.some(
          (notice) =>
            notice.title === title && now - notice.sentAt < THIRTY_DAYS
        );

        if (!recentlySent) {
          newNotices.push({ title, sentAt: now });
        }
      }
    });

    if (newNotices.length > 0) {
      const message =
        `📢 New CSIT 2079 Notice(s):\n\n` +
        newNotices.map((n) => `• ${n.title}`).join("\n");

      await axios.post(DISCORD_WEBHOOK_URL, {
        content: message,
      });

      const updatedSent = [...sentNotices, ...newNotices];
      saveSentNotices(updatedSent);

      console.log(
        "✅ Sent new notices to Discord:",
        newNotices.map((n) => n.title)
      );
    } else {
      console.log("ℹ️ No new CSIT 2079 notices found.");
    }
  } catch (error) {
    console.error("❌ Error scraping or sending:", error.message);
  }
}

cron.schedule("0 * * * *", () => {
  console.log("⏳ Running scraper...");
  scrapeWebsite();
});

scrapeWebsite();
