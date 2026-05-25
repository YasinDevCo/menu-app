// ============================================
// 6. Transaction (تراکنش مالی) - کاملاً جدید
// ============================================
const transactionSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true },
    type: {
        type: String,
        enum: ['PAYMENT', 'REFUND', 'WITHDRAWAL', 'DEPOSIT'],
        default: 'PAYMENT'
    },
    method: { type: String, enum: ['CASH', 'ONLINE', 'POS', 'WALLET'] },
    status: { type: String, enum: ['SUCCESS', 'FAILED', 'PENDING'], default: 'PENDING' },
    gatewayReference: { type: String, default: null },  // کد رهگیری درگاه
    description: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);