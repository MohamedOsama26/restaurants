const app = require('./app');
const connectDB = require('./config/db');


connectDB().then(_ => console.log('DB Connected'));


app.listen(process.env.PORT,error => {
    if(error) throw error;
    console.log(`🚀 Server is running on port ${process.env.PORT}`);
});