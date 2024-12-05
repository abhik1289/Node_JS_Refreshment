const express = require('express');
const app = express();
const helmet = require('helmet');
const PORT = 5000;

app.use(helmet());

app.get("/", (req, res) => {
    return res.send("Welcome");
})

app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
})


