import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import html2md from 'html-to-md';
import fs from 'fs';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

puppeteer.use(StealthPlugin());

export async function scrapeToMarkdown(url, savePath = null) {
  // 检查URL是否以http://或https://开头，若不是则添加
  if (!/https?:\/\//.test(url)) {
    url = `http://${url}`;
  }
    
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  try {
    console.log(`正在访问 ${url} ...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    const html = await page.$eval('body', () => {
      const clone = document.body.cloneNode(true);
      clone.querySelectorAll('script, style').forEach(el => el.remove());
      return clone.innerHTML;
    });

    const dom = new JSDOM(html, { url });
    const article = new Readability(dom.window.document).parse();
    const content = article ? article.content : html;

    const markdown = html2md(content);

    if (savePath) {
      fs.writeFileSync(savePath, markdown);
      console.log(`已保存为Markdown文件：${savePath}`);
    }

    console.log('内容抓取成功', markdown);
    return markdown;
  } catch (err) {
    console.error('抓取失败:', err);
    throw err;
  } finally {
    await browser.close();
  }
}

// // 测试地址
// const testUrl = [
//   'https://mp.weixin.qq.com/s/0vZvNaAhEQQOqUfg3YiIdQ',
//   'https://mp.weixin.qq.com/s/i0nJLIsqQjuzxm5gDxhYcA',
//   'https://baijiahao.baidu.com/s?id=1833231049264037707',
//   'https://jwell56.com/news/detail?id=4000'
// ]
// const url = 'https://jwell56.com/about/companyIntroduction';
// scrapeToMarkdown(url, 'output.md')
