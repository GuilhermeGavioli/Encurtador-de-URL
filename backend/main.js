const express = require('express')
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const app = express()
const Redis = require('ioredis');


const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

// const https = require('https');
// const fs = require('fs')
// const options = {
//   key: fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/privkey.pem`),
//   cert: fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/fullchain.pem`)
// };

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors({origin: process.env.ALLOWED_ORIGIN, credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization']
}))

app.get('/health', (req,res)=> {
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
    exists = await redis.exists(key);
  } while (exists);

  await redis.set(key, url); 
  return key;
}



const myUrls = [
    { original: '', short: '' }
]

app.post('/shorturl', (req,res)=> {
    const { url } = req.body
    if (!url) {
        return res.status(400).json({ error: "URL não providenciada." });
    }
    if (typeof url !== 'string') {
        return res.status(400).json({ error: "URL deve ser uma string." });
    }
    if (!url.startsWith('http://') || !url.startsWith('https://')) {
        return res.status(400).json({ error: "URL deve começar com http:// ou https://" });
    }

    generateUniqueKey(url).then(key => {
        return res.status(200).json({link: `https://${process.env.DOMAIN}/${key}`})
    });

    return res.status(400).json({ error: "Erro inesperado. Tente novamente." });
})

app.get('/:short', async (req,res) => {
    const {short} = req.params;
    const long_url = await redis.get(short)
    if (!long_url) {
        return res.status(400).json({ error: "URL Não encontrada" });
    } else {
        return res.redirect(302, long_url)
    }
})

app.listen(80, () => {console.log('upon80')})

// https.createServer(options, app).listen(process.env.PORT, () => {
//   console.log('UpOn443');
// });