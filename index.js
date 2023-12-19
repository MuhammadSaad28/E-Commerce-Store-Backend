const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/userRoute');
const categoryRouter = require('./routes/categoryRoute');
const productRouter = require('./routes/productRoute');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on("connected", () => {     console.log("MongoDB connected successfully"); });
mongoose.connection.on("disconnected", () => {     console.log("MongoDB is not connected"); });


app.get('/', (req, res) => {    res.json({name:'Hello World!'})  });
app.use('/api/auth', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
