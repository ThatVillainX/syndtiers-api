const http = require('http');
const db = require('./db');

// 🔥 FORCE correct port for your panel
const PORT = process.env.PORT || 20035;

const server = http.createServer((req, res) => {
    // Headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // ===== ROUTES =====

    // ALL TIERS
    if (req.method === 'GET' && req.url === '/api/tiers') {
        const data = db.exportForAPI();
        res.statusCode = 200;
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

        res.statusCode = 200;
        return res.end(JSON.stringify({ userId, tiers }));
    }

    // HISTORY
    if (req.method === 'GET' && req.url === '/api/history') {
        const history = db.getTestHistory();
        res.statusCode = 200;
        return res.end(JSON.stringify({
            tests: history,
            total: history.length
        }));
    }

    // ROOT (so browser shows something instead of error)
    if (req.method === 'GET' && req.url === '/') {
        res.statusCode = 200;
        return res.end(JSON.stringify({
            message: 'SyndTiers API is running 🚀',
            endpoints: [
                '/api/tiers',
                '/api/tiers/:userId',
                '/api/history'
            ]
        }));
    }

    // NOT FOUND
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

function startAPI() {
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`🌐 API Server running on http://0.0.0.0:${PORT}`);
    });
}

module.exports = { startAPI };
