<h1>CSIT Notice Scraper</h1>
This repository contains a Node.js-based web scraper that checks for new CSIT-related notices published on the IOST website and sends them to a Discord channel via a webhook. The scraper runs automatically every hour and checks for new notices containing the keywords "CSIT" and "2079". If new notices are found, they are sent to a designated Discord channel.

<h2>Features</h2>
<ul>
<li>
<b>Web Scraping:</b> Scrapes the IOST Notice Page for notices containing "CSIT" and "2079". 
</li>
<br>
<li>
<b>Discord Integration:</b> Sends notices to a Discord channel using a webhook.
</li>
<br>
<li>
<b>Automated Scheduling:</b> Runs every minute using GitHub Actions to check for new notices.
</li>
</ul>
