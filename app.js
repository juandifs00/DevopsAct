const express = require('express')
const bodyParser = require('body-parser')

const fs = require('fs')
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

const axios = require('axios')

const app = express()
const FormData = require('form-data');
const { Readable } = require('stream');

const functions = require('@google-cloud/functions-framework');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


functions.http('leerArchivo', upload.single('archivo_new'), async (req, res) => {
    try {
        const content = req.file.buffer.toString('utf-8');
        const modifiedContent = content + '\n Modificado gpc';

        const readableStream = new Readable();
        readableStream.push(modifiedContent);
        readableStream.push(null);

        const form = new FormData();
        form.append('archivo_new', readableStream, {
            contentType: 'text/plain',
            filename: 'archivo_new.txt'
        });

        const response = await axios.post('http://localhost:3001/', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('Funciona', response.data);
        res.status(200).json({ mensaje: 'Texto modificado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error: no funcionó' });
    }
});

app.listen(port, () => {
    console.log('listening on port' + port);
})