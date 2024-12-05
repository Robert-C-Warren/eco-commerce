const { exec } = require('child_process');
const cron = require('node-cron');

cron.schedule('0 0 * * *', () => {
    console.log('Starting scheduled scraping...');
    exec('scrapy crawl products', { cwd: '../scraper' }, (error, stdout, stderr) => {
        if(error) {
            console.error(`Scheduled Scraping Error: ${stderr}`);
        } else {
            console.log(`Scheduled Scraping Output: ${stdout}`);
        }
    });
});