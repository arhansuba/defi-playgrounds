// index.js
const express = require('express');
//const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { authService } = require('./services/authService');
const { walletService } = require('./services/walletService');
const { Formatter } = require('./utils/formatter');
const { Logger } = require('./utils/logger');
const assets = require('./api/assets');
const users = require('./api/users');
const contracts = require('./contracts');
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// Define a simple API endpoint
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Serve the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Catch all other routes and return the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

//const port = 3001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
mongoose.connect('mongodb://localhost/myapp', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());

app.use('/api/assets', assets);
app.use('/api/users', users);

app.post('/login', authService.login);
app.post('/register', authService.register);

app.get('/wallet', walletService.getWallet);
app.post('/wallet/deposit', walletService.deposit);
app.post('/wallet/withdraw', walletService.withdraw);

app.get('/contracts', contracts.getAll);
app.get('/contracts/:contractId', contracts.getContract);

app.use((err, req, res, next) => {
  Logger.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  Logger.info(`Server started on port ${port}`);
});