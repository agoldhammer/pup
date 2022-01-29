const puppeteer = require('puppeteer');


(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const BUTTON_SELECTOR = '#react-tabs-0';
  // const SEARCH_SELECTOR = 'input[placeholder=Search]';
  const LABEL_SELECTOR = 'ul.stats__list li.stats__stat div.stats__stat-name';
  // const LABELS_SELECTOR = 'ul.stats__list li.stats__stat ~ div.stats__stat-name';
  const STATS_SELECTOR = 'ul.stats__list li.stats__stat div.stats__stat-number div';
  // const RESULTS_SELECTOR = '.results-tab';

  await page.goto('https://shockmarket.org/');
  await page.click(BUTTON_SELECTOR);
  await page.waitForTimeout(500);

  const labels = await page.$$(LABEL_SELECTOR);
  // console.log('len labels', labels.length);
  let decoded_labels = [];
  
  for (let i = 0; i < labels.length; i++) {
      const label = await labels[i].evaluate(element => element.innerText);
      // console.log('label', label);
      decoded_labels.push(label);
  }

  const stats = await page.$$(STATS_SELECTOR);
  // console.log('len labels', stats.length);
  
  for (let i = 0; i < stats.length; i++) {
      const stat = await stats[i].evaluate(element => element.innerText)
      console.log('scraped result:', decoded_labels[i], stat);
  }
      
  // await page.screenshot({path: 'shocker.png'});

  await browser.close();
})();