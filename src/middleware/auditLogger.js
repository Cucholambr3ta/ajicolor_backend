const logger = require('../utils/logger');
const AuditLog = require('../models/AuditLog');

/**
 * Recursively masks sensitive keys in an object.
 * Safe against Prototype Pollution.
 */
const maskSensitiveData = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    const sensitiveKeys = ['password', 'token', 'creditCard', 'cvv', 'cardNumber', 'secret'];
    
    // Handle Arrays
    if (Array.isArray(obj)) {
        return obj.map(item => maskSensitiveData(item));
    }

    const maskedObj = {};

    for (const key in obj) {
        // SECURITY: Prevent Prototype Pollution
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;

        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            
            if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
                maskedObj[key] = '****';
            } else if (typeof value === 'object') {
                maskedObj[key] = maskSensitiveData(value);
            } else {
                maskedObj[key] = value;
            }
        }
    }
    return maskedObj;
};

const auditLogger = (actionType) => {
    return (req, res, next) => {
        const startTime = Date.now();
        
        res.on('finish', async () => {
            const duration = Date.now() - startTime;
            const statusCode = res.statusCode;
            const isSuccess = statusCode >= 200 && statusCode < 400;

            const logData = {
                timestamp: new Date().toISOString(),
                action: actionType,
                ip: req.ip,
                userId: req.user ? req.user._id : 'anonymous',
                method: req.method,
                url: req.originalUrl,
                status: statusCode,
                outcome: isSuccess ? 'SUCCESS' : 'FAILURE',
                duration: `${duration}ms`,
                requestBody: maskSensitiveData({ ...req.body }),
                userAgent: req.get('user-agent')
            };

            // Winston logging (fallback/debug)
            if (isSuccess) {
                logger.info('Audit Log', logData);
            } else {
                logger.warn('Audit Log - Failure', logData);
            }

            // Database persistence (async, non-blocking)
            try {
                await AuditLog.create({
                    user: req.user ? req.user._id : null,
                    action: actionType,
                    ip: req.ip,
                    details: {
                        method: req.method,
                        url: req.originalUrl,
                        status: statusCode,
                        outcome: isSuccess ? 'SUCCESS' : 'FAILURE',
                        duration: `${duration}ms`,
                        requestBody: maskSensitiveData({ ...req.body }),
                        userAgent: req.get('user-agent')
                    }
                });
            } catch (dbError) {
                // Log DB error but don't crash the request
                logger.error('Failed to save audit log to database:', dbError);
            }
        });

        next();
    };
};

module.exports = auditLogger;
