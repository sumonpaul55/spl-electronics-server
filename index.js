const express = require("express");
require('dotenv').config()
const cors = require("cors")
const app = express();
const port = process.env.PORT || 5000;
// add middleware

app.use(cors())
app.use(express.json())



app.listen(port, () => {
    console.log(`Server Listening from ${port}`)
})