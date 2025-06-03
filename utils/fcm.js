const admin = require('firebase-admin');
const serviceAccount = require();

if (!admin.app.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    })
}

module.exports = admin;