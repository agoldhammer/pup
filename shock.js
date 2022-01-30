const puppeteer = require('puppeteer');

const SINCE_BIDEN = '#react-tabs-0';
const PAST7 = '#react-tabs-2';
const YEST = '#react-tabs-4';
const LABEL_SELECTOR = 'ul.stats__list li.stats__stat div.stats__stat-name';
const STATS_SELECTOR = 'ul.stats__list li.stats__stat div.stats__stat-number div';
const STATS_SELECTOR2 = 'ul.stats__list li.stats__stat div.stats__stat-number';

async function scrape_stats(which, page) {
  await page.click(which);
  // results appear to be indeterminate without this wait
  await page.waitForTimeout(100);

  let labels = await page.$$(LABEL_SELECTOR);
  let decoded_labels = [];
  
  for (let i = 0; i < labels.length; i++) {
      let label = await labels[i].evaluate(element => element.innerText);
      // console.log('label', label);
      decoded_labels.push(label);
  }
// kludge needed because YEST stats are structured differently from other 2
  let stats_selector = (which == YEST) ? STATS_SELECTOR2 : STATS_SELECTOR;
  let stats = await page.$$(stats_selector);
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
  // console.log("stats length:", stats.length)
  if (stats.length == 0) {
      console.log("No results for", run_name, "\n");

  }
  else {
    for (let i = 0; i < stats.length; i++) {
        let stat = await stats[i].evaluate(element => element.innerText)
        // another kludge to deal with buggy website construction
        if (stat != "") {
          console.log('scraped result:', decoded_labels[i], ":", stat);
        }
    }
  }
};


(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  
  await page.goto('https://shockmarket.org/');

  await scrape_stats(SINCE_BIDEN, page);
  await scrape_stats(PAST7, page);
  await scrape_stats(YEST, page);

  // await page.waitForTimeout(1000);

  await browser.close();
})();