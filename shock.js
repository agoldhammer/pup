const puppeteer = require('puppeteer');

const SINCE_BIDEN = '#react-tabs-0';
const PAST7 = '#react-tabs-2';
const YEST = '#react-tabs-4';
const LABEL_SELECTOR = 'ul.stats__list li.stats__stat div.stats__stat-name';
const STATS_SELECTOR = 'ul.stats__list li.stats__stat div.stats__stat-number div';

async function scrape_stats(which, page) {
  await page.click(which);
  await page.waitForTimeout(500);

  let labels = await page.$$(LABEL_SELECTOR);
  let decoded_labels = [];
  
  for (let i = 0; i < labels.length; i++) {
      let label = await labels[i].evaluate(element => element.innerText);
      // console.log('label', label);
      decoded_labels.push(label);
  }

  let stats = await page.$$(STATS_SELECTOR);
  let run_name = "";
  switch (which) {
      case SINCE_BIDEN:
          run_name = "Since Biden's Election\n...\n"
          break;
      case PAST7:
          run_name = "Past 7 Days\n...\n";
          break;
      case YEST:
          run_name = "Yesterday\n...\n";
          break;
  }

  console.log("\nRun: ", run_name);
  
  for (let i = 0; i < stats.length; i++) {
      let stat = await stats[i].evaluate(element => element.innerText)
      console.log('scraped result:', decoded_labels[i], ":", stat);
  }

  // return new Promise(() => which);

};


(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  
  await page.goto('https://shockmarket.org/');

  await scrape_stats(SINCE_BIDEN, page);
  await scrape_stats(PAST7, page);
  await scrape_stats(YEST, page);

  await page.waitForTimeout(1000);

  await browser.close();
})();