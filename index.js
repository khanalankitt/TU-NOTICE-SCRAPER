process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");

const URL = "https://iost.tu.edu.np/notices";
const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1338520700868231328/BPW92po6bExd7o7in6nnnOR4zMR-VxhqQYA1vmK7csx-2c7tSNy9lBLS49IaxiKCnXlf";

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

// ⏰ Schedule to run every hour
cron.schedule("0 * * * *", () => {
  console.log("⏳ Running scraper...");
  scrapeWebsite();
});

// 🔹 Run once immediately as well
scrapeWebsite();
