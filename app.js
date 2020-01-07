const express = require('express');

const app = express();

require('./startup/routes')(app);
require('./startup/db')();

const PORT = process.env.PORT || 9000;

app.listen(PORT, console.log(`APP LISTENING ON PORT: ${PORT}`));