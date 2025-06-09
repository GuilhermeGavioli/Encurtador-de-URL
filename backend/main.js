const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cors = require('cors');
const app = express();
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

const https = require('https');
const fs = require('fs');

let c,k;
try{
  k = fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/privkey.pem`)
  c = fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/fullchain.pem`)
} catch(err){
  console.log(err)
}
const options = {
  key: k,
  cert: c
};

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.get('/health/health', (req,res)=> {
    res.send('ok')
})

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const KEY_LENGTH = 4;

function generateKey() {
  let key = '';
  for (let i = 0; i < KEY_LENGTH; i++) {
    key += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
  }
  return key;
}

async function generateUniqueKey(url) {
  let key;
  let exists;

  do {
    key = generateKey();
    exists_on_my_links = (key == '0000' || key == '0001'  || key == '0002' || key == '0003' || key == '0004'
|| key == '0005'
    )
    exists = await redis.exists(key);
  } while (exists_on_my_links || exists);

  const ok = await redis.set(key, url, 'EX', 60 * 60 * 24 * 7); 
  if (ok) return key;
  return ok;
}



const myUrls = [
    { original: process.env.GITHUB, short: '0000' },
    { original: process.env.LINKEDIN, short: '0001' },
    { original: process.env.PROJETO_FILMES, short: '0002' },
    { original: process.env.PROJETO_AWS_IMAGE_PROCESSING, short: '0003' },
    { original: process.env.PROJETO_AWS_LOAD_BALANCING, short: '0004' },
    { original: process.env.PROJETO_REDUX, short: '0005' },
]


app.post('/shorturl', async (req,res)=> {
    const { url } = req.body
    if (!url) {
        return res.status(400).json({ error: "URL não providenciada." });
    }
    if (typeof url !== 'string') {
        return res.status(400).json({ error: "URL deve ser uma string." });
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return res.status(400).json({ error: "URL deve começar com http:// ou https://" });
      }
      if (url == 'http://' || url == 'https://') {
      return res.status(400).json({ error: "URL incompleta." });
    }

    const key = await generateUniqueKey(url)
    if (key){
      return res.status(200).json({link: `https://${process.env.DOMAIN}/${key}`})
    } else {
      return res.status(400).json({ error: "Erro inesperado. Tente novamente." });
    }
})

app.get('/:short', async (req,res) => {
    const {short} = req.params;
    if (!short) {
      return res.status(400).json({ error: "URL Não encontrada" });
    }
    const foundLocally = myUrls.find(el => el.short == short);
    if (foundLocally){
        return res.redirect(302, foundLocally.original)
    }
    const long_url = await redis.get(short)
    if (!long_url) {
        return res.status(400).json({ error: "URL Não encontrada" });
    } else {
        return res.redirect(302, long_url)
    }
})

// app.listen(process.env.WEB_PORT, () => {console.log('upon80')})
https.createServer(options, app).listen(process.env.WEB_PORT, () => {
  console.log('UpOn443');
});