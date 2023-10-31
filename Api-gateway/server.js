require('dotenv').config();
const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const redis = require('redis');
const uuid = require('uuid');
const session = require('express-session');
const httpProxy = require('express-http-proxy')
const dashBoardProxy = httpProxy(process.env.DASHBOARD_URL)
const homepageProxy = httpProxy(process.env.HOMEPAGE_URL)

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // 1 hour
}));

const client = redis.createClient();
(async () => {
    await client.on("error", (error) => console.error(error));
    await client.connect();
    console.log("redis client connected");
})();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send('Working');
});

const middleware = async (req, res, next) => {
    console.log('req: ', req.session);
    const { token } = req.session;
    console.log('token: ', token);
    try {
        if (!token) throw new Error('unauthorized');
        console.log('unauthorized: ');
        const key = await client.get(token);
        console.log('key: ', key);
        if (!key) throw new Error('unauthorized');
        const decoded = jwt.verify(key, process.env.SECRET);
        console.log('decoded: ', decoded);
        if (decoded) {
            next();
        } else {
            await client.del(token); 
            res.redirect(401, process.env.LOGIN_URL);
        }
    } catch (error) {
        if (token) await client.del(token);
        if (error.message === 'jwt expired' || error.message === 'unauthorized') {
            res.redirect(401, process.env.LOGIN_URL);
        } else {
            res.status(500).json({ error: error.message });
        }
    }
}

app.post('/login', async (req, res) => {
    const { token } = req.session;
    const { redirectUrl } = req.query;
    const { email, password } = req.body;
    try {
        if (token) {
            const key = await client.get(token);
            if (key) {
                const decoded = jwt.verify(key, process.env.SECRET);
                if (decoded) {
                    if (redirectUrl) {
                        res.redirect(301, redirectUrl);
                        return
                    } else {
                        res.redirect(301, process.env.HOMEPAGE_URL);
                        return
                    }
                }
            }
        }
        if (!email || !password) {
            return res.status(400).json({ error: `${email ? 'Password required' : 'Email required'}` });
        }
        const newToken = jwt.sign({ email }, process.env.SECRET, { expiresIn: '20s' });
        const key = uuid.v4();
        const redisData = await client.setEx(key, 300000, newToken);
        console.log(redisData);
        req.session.token = key;
        if (redirectUrl) {
            res.redirect(301, redirectUrl);
            return
        } else {
            res.redirect(301, process.env.HOMEPAGE_URL);
            return
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/redirect', middleware, async (req, res, next) => {
    const { redirectUrl } = req.body;
    console.log('redirectUrl: ', redirectUrl);
    try {
        if (redirectUrl) {
            res.redirect(301, redirectUrl);
        } else {
            res.redirect(301, process.env.HOMEPAGE_URL);
        }
    } catch (err) {
        if (err.error === 'jwt expired' || err.error === 'unauthorized') {
            res.redirect(401, process.env.LOGIN_URL);
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

app.get('/logout', async (req, res) => {
    const { token } = req.session;
    try {
        await client.del(token);
        req.session.destroy();
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// app.post('/verify', async (req, res) => {
//     const { token } = req.session.token;
//     try {
//         const key = await client.get(token);
//         if (!key) throw new Error('unauthorized');
//         const decoded = jwt.verify(key, process.env.SECRET);
//         if (decoded) {
//             next();
//         } else {
//             res.status(401).json({ error: 'Unauthorized' });
//         }
//     } catch (error) {
//         if (error.message === 'jwt expired' || error.message === 'unauthorized') {
//             res.status(401).json({ error: error.message });
//         } else {
//             res.status(500).json({ error: error.message });
//         }
//     }
// });

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});