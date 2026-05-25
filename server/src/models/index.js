const mongoose = require('mongoose');

module.exports = {
    Business: require('./Business'),
    Table: require('./Table'),
    Category: require('./Category'),
    Product: require('./Product'),
    Order: require('./Order'),
    Transaction: require('./Transaction'),
    Review: require('./Review'),
    Coupon: require('./Coupon'),
    Staff: require('./Staff'),
    ActivityLog: require('./ActivityLog')
};