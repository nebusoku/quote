const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace('{{N8N_WEBHOOK_URL}}', process.env.N8N_WEBHOOK_URL || '');
  html = html.replace('{{AAD_CLIENT_ID}}', process.env.AAD_CLIENT_ID || '');
  html = html.replace('{{AAD_TENANT_ID}}', process.env.AAD_TENANT_ID || '');
  res.send(html);
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
