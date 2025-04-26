process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");

const URL = "https://iost.tu.edu.np/notices";

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

    console.log(`[${new Date().toLocaleTimeString()}] CSIT 2079 Titles:`, titles);
  } catch (error) {
    console.error("Error scraping:", error.message);
  }
}

cron.schedule("0 * * * *", () => {
  console.log("⏳ Running scraper...");
  scrapeWebsite();
});

scrapeWebsite();
