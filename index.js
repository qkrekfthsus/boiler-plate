const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const mserver = "mongodb+srv://qkrekfthsus:dlwhdvy123@jp.0qkma.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


mongoose.connect(mserver, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log("MongoDB Connected..")).catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at ${port}`);
});