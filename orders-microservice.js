const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to the database
const connectionString = 'mongodb://localhost:27017/orders';
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create the order model
const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
  },
  customerId: {
    type: String,
  },
  orderDate: {
    type: Date,
  },
  orderItems: [{
     productId: {
       type: String,
     },
     quantity: {
       type: Number,
     },
  }],
  totalPrice: {
    type: Number,
  },
});

const Order = mongoose.model('Order', OrderSchema);

// Create the Express app
const app = express();

// Use body-parser to parse the request body
app.use(bodyParser.json());

// Define the routes
app.post('/orders', async (req, res) => {
  // Create a new order
  const order = new Order({
    customerId: req.body.customerId,
    orderDate: new Date(),
    orderItems: req.body.orderItems,
    totalPrice: req.body.totalPrice,
  });

  // Save the order to the database
  try {
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get('/orders', async (req, res) => {
  // Get all orders from the database
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Order microservice listening on port 3000');
});
