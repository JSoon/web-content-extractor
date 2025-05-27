# Web Content Extractor

一个提供网页内容提取和 Markdown 转换功能的 HTTP 服务。

## 安装依赖

```bash
npm install
```

## 启动服务

```bash
npm start
```

## 使用示例

```bash
curl "http://localhost:3000/extract?url=https://mp.weixin.qq.com/s/0vZvNaAhEQQOqUfg3YiIdQ"
```

可选参数：

- `save=true` 将结果保存为 Markdown 文件。
