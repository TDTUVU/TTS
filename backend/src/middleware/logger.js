// src/middleware/logger.js
const { Log } = require('../models');

const logger = async (req, res, next) => {
    const originalSend = res.send;
    const start = Date.now();
    
    const requestInfo = {
        method: req.method,
        endpoint: req.originalUrl,
        body: req.body,
        params: req.params,
        query: req.query,
        userId: req.userId || null
    };
    
    res.send = function(body) {
        const responseTime = Date.now() - start;
        const responseBody = typeof body === 'string' ? body : JSON.stringify(body);
       
        Log.create({
            userId: requestInfo.userId,
            action: requestInfo.method,
            endpoint: requestInfo.endpoint,
            method: requestInfo.method,
            timestamp: new Date(),
            status: res.statusCode,
            details: {
                request: {
                    body: requestInfo.body,
                    params: requestInfo.params,
                    query: requestInfo.query
                },
                response: {
                    statusCode: res.statusCode,
                    responseTime,
                    body: responseBody.substring(0, 200) 
                }
            }
        }).catch(err => console.error('Lỗi khi ghi log:', err));
        
        // Gọi phương thức send gốc
        return originalSend.call(this, body);
    };
    
    next();
};

module.exports = logger;