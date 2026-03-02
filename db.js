const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');

class Database {
    constructor() {
        this.data = this.load();
    }

    load() {
        try {
            if (fs.existsSync(DB_PATH)) {
                const rawData = fs.readFileSync(DB_PATH, 'utf8');
                return JSON.parse(rawData);
            }
        } catch (error) {
            console.error('Error loading database:', error);
        }

        return {
            queues: {},
            tiers: {},
            testHistory: []
        };
    }

    save() {
        try {
            fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving database:', error);
        }
    }

    addQueue(queueId, queueData) {
        this.data.queues[queueId] = queueData;
        this.save();
    }

    removeQueue(queueId) {
        delete this.data.queues[queueId];
        this.save();
    }

    getQueue(queueId) {
        return this.data.queues[queueId];
    }

    assignTier(userId, gamemode, tier) {
        if (!this.data.tiers[userId]) {
            this.data.tiers[userId] = {};
        }
        this.data.tiers[userId][gamemode] = tier;
        this.save();
    }

    getUserTiers(userId) {
        return this.data.tiers[userId] || {};
    }

    getAllTiers() {
        return this.data.tiers;
    }

    addTestHistory(testData) {
        this.data.testHistory.push(testData);
        this.save();
    }

    getTestHistory(userId = null) {
        if (userId) {
            return this.data.testHistory.filter(
                test => test.playerId === userId || test.testerId === userId
            );
        }
        return this.data.testHistory;
    }

    exportForAPI() {
        return {
            tiers: this.data.tiers,
            totalTests: this.data.testHistory.length,
            lastUpdated: Date.now()
        };
    }
}

module.exports = new Database();