const axios = require('axios');

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY; // from dashboard
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID; // from dashboard
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID; // for card

const paymobWebhookCallback = async (req, res) => {
    try {
        const data = req.body;

        if (data.success && data.obj?.order?.id) {
            const orderId = data.obj.order.id;
            // update your DB, send confirmation, etc.
            console.log(`Order ${orderId} was successful`);
        }

        res.status(200).send('Webhook received');
    } catch (error) {
        res.status(500).send('Webhook failed');
    }
};

const startPaymobPayment = async (req, res) => {
    try {
        const { amountCents, userEmail } = req.body;

        // Step 1: Authentication
        const authRes = await axios.post('https://accept.paymob.com/api/auth/tokens', {
            api_key: PAYMOB_API_KEY,
        });
        const token = authRes.data.token;

        // Step 2: Create Order
        const orderRes = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
            auth_token: token,
            delivery_needed: false,
            amount_cents: amountCents,
            currency: 'EGP',
            items: [],
        });
        const orderId = orderRes.data.id;

        // Step 3: Get Payment Key
        const paymentKeyRes = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
            auth_token: token,
            amount_cents: amountCents,
            expiration: 3600,
            order_id: orderId,
            billing_data: {
                email: userEmail,
                first_name: 'Test',
                last_name: 'User',
                phone_number: '+201000000000',
                city: 'Cairo',
                country: 'EG',
                street: 'Street',
                building: '10',
                floor: '2',
                apartment: '5',
            },
            currency: 'EGP',
            integration_id: PAYMOB_INTEGRATION_ID,
        });

        const paymentToken = paymentKeyRes.data.token;

        const iframeURL = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;

        return res.status(200).json({ iframeURL });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ msg: 'Payment initiation failed', error: error.message });
    }
};

module.exports = {
    paymobWebhookCallback,
    startPaymobPayment,
}
