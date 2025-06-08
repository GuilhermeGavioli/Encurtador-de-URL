const express = require('express')
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const app = express()
const Redis = require('ioredis');


const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

const https = require('https');
const fs = require('fs')
const options = {
  key: fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/privkey.pem`),
  cert: fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/fullchain.pem`)
};

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors({origin: process.env.ALLOWED_ORIGIN, credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization']
}))

app.get('/health', (req,res)=> {
    res.send('ok')
})

const myUrls = [
    { original: '', short: '' }
]

app.get('/shorturl', (req,res)=> {
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
    // store on redis

    res.send('ok')
})

https.createServer(options, app).listen(process.env.PORT, () => {
  console.log('UpOn443');
});