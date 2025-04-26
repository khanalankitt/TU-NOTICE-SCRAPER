process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");
const dotenv = require("dotenv");
dotenv.config();
const URL = "https://iost.tu.edu.np/notices";
const DISCORD_WEBHOOK_URL = process.env.DISCORD_URL;
async function scrapeWebsite() {
  try {
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);

    const titles = [];
    $("h5").each((i, el) => {
      const title = $(el).text().trim();
      if (title.includes("CSIT") && title.includes("2079")) {
        titles.push(title);
      }
    });

    if (titles.length > 0) {
      const message =
        `📢 New CSIT 2079 Notice:\n\n` + titles.map((t) => `• ${t}`).join("\n");

      await axios.post(DISCORD_WEBHOOK_URL, {
        content: message,
      });

      console.log("✅ Sent to Discord:", message);
    } else {
      console.log("ℹ️ No CSIT 2079 notices found this time.");
    }
  } catch (error) {
    console.error("Error scraping or sending to Discord:", error.message);
  }
}

cron.schedule("0 * * * *", () => {
  console.log("⏳ Running scraper...");
  scrapeWebsite();
});

scrapeWebsite();
