import express from 'express';
import { scrapeToMarkdown } from './scraper.js';

const app = express();
const port = process.env.PORT || 3000;

app.get('/extract', async (req, res) => {
  const url = req.query.url;
  const save = req.query.save === 'true';

  if (!url) {
    return res.status(400).send({ error: '缺少 url 参数' });
  }

  try {
    const outputPath = save ? `./output_${Date.now()}.md` : null;
    const markdown = await scrapeToMarkdown(url, outputPath);
    res.send({ markdown, saved: !!outputPath });
  } catch (err) {
    res.status(500).send({ error: '内容提取失败', detail: err.message });
  }
});

app.listen(port, () => {
  console.log(`服务运行在 http://localhost:${port}`);
});
