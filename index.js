const mongoose = require('mongoose')
const express = require('express')
const authRouter =require('./routes/authRouter')
const exec = require('child_process').execFile;
const { count } = require('console');

const main = express()
main.use(express.json())
main.use("/auth", authRouter)
main.use(express.static(__dirname + '/img/'));
const db_path = "./data/db"
const db_port = 27017
const server_port = 5000

const start = async () => {
    
    try{
        await exec("mongod.exe", ['--dbpath', db_path, '--port', db_port],  function(err, data) {
            console.log(err)
            console.log(data.toString());
        })
        console.log(`MongoDB запущена на порту ${db_port}`);
        await mongoose.connect(`mongodb://localhost:${db_port}/db`, { useUnifiedTopology: true, useNewUrlParser: true })
            .then(() => console.log('MongoDB подключена'))
            .catch(error => console.log(error))
        main.listen(server_port, () => console.log(`Сервер запущен на порту ${server_port}`))
    }
    catch (e){
        console.log(e)
    }
}

start()