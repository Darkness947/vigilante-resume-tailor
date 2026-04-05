const fs = require('fs');
const https = require('https');
const path = require('path');

const fontsDir = path.join(__dirname, '../public/fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

function getTTFUrls(families) {
  return new Promise((resolve, reject) => {
    const url = `https://fonts.googleapis.com/css?family=${families.join('|')}`;
    // User Agent for very old Safari to force Google Fonts to return TTF instead of WOFF2
    const options = {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1' }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const urls = {};
        const regex = /font-family:\s*'([^']+)'.*?font-weight:\s*(\d+|normal|bold).*?url\((https:\/\/[^\)]+\.ttf)\)/gs;
        let match;
        while ((match = regex.exec(data)) !== null) {
          const family = match[1].replace(/\s+/g, '');
          const weight = match[2] === 'normal' ? 'Regular' : (match[2] === 'bold' || match[2] === '700' ? 'Bold' : match[2]);
          urls[`${family}-${weight}.ttf`] = match[3];
        }
        resolve(urls);
      });
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) return reject(new Error(`Status ${response.statusCode}`));
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  try {
    const urls = await getTTFUrls(['Inter:400,700', 'Cairo:400,700']);
    console.log("Found TTF URLs:", urls);
    for (const [filename, url] of Object.entries(urls)) {
      console.log(`Downloading ${filename}...`);
      await downloadFile(url, path.join(fontsDir, filename));
    }
    console.log("Done");
  } catch (e) {
    console.error(e);
  }
}
run();
