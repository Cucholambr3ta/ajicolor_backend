const mongoose = require('mongoose');
const AuditLog = require('../models/AuditLog');

exports.checkSystemHealth = async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        
        // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
        if (dbState !== 1) {
            return res.status(503).json({
                status: 'DEGRADED',
                db: 'disconnected',
                timestamp: new Date().toISOString()
            });
        }

        // Critical Test: Verify audit system is operational by creating a test entry
        try {
            await AuditLog.create({
                user: null,
                action: 'SYSTEM_HEALTH_CHECK',
                ip: req.ip,
                details: {
                    endpoint: req.originalUrl,
                    method: req.method
                }
            });
        } catch (auditError) {
            return res.status(500).json({
                status: 'ERROR',
                db: 'connected',
                auditSystem: 'failed',
                timestamp: new Date().toISOString()
            });
        }

        // All systems operational
        res.status(200).json({
            status: 'OK',
            db: 'connected',
            auditSystem: 'operational',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'System health check failed',
            timestamp: new Date().toISOString()
        });
    }
};
