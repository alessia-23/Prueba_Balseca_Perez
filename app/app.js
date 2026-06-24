const express = require('express');
const app = express();
const PORT = 3000;
const APP_NAME = process.env.APP_NAME || "APP";

app.get('/', (req,res)=>{
    res.send(`Respuesta desde ${APP_NAME}`);
});

app.listen(PORT,()=>{
    console.log(`${APP_NAME} ejecutándose`);
});
