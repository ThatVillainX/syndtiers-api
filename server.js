const http = require('http');
const db = require('./database/db'); // ✅ FIXED PATH

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // ALL TIERS
    if (req.method === 'GET' && req.url === '/api/tiers') {
        const data = db.exportForAPI();
        return res.end(JSON.stringify(data));
    }

    // USER TIERS
    if (req.method === 'GET' && req.url.startsWith('/api/tiers/')) {
        const userId = req.url.split('/')[3];
        const tiers = db.getUserTiers(userId);

        if (!tiers || Object.keys(tiers).length === 0) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'User not found' }));
        }

        return res.end(JSON.stringify({ userId, tiers }));
    }

    // HISTORY
    if (req.method === 'GET' && req.url === '/api/history') {
        const history = db.getTestHistory();
        return res.end(JSON.stringify({
            tests: history,
            total: history.length
        }));
    }

    // ROOT
    if (req.url === '/') {
        return res.end(JSON.stringify({
            message: 'SyndTiers API is running 🚀'
        }));
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 API running on port ${PORT}`);
});
