const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

router.post('/scrape', (req, res) => {
    exec('scrapy crawl products', { cwd: '../scraper' }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).json({ message: 'Scraping Failed', error: stderr });
        }
        res.status(200).json({ message: 'Scraping completed successfully', output: stdout });
    });
});

module.exports = router;