
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let dataArray = [];
const dataFilePath = './data.json';


async function loadDataFromFile() {
    try {
        const jsonData = await fs.readFile(dataFilePath);
        if (jsonData.length > 0) {
            dataArray = JSON.parse(jsonData);
            console.log('Data loaded from file:', dataArray);
        } else {
            console.log('Data file is empty, initializing with empty array.');
            dataArray = [];
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('Data file not found, initializing with empty array.');
            dataArray = [];
        } else {
            console.error('Error loading data from file:', error);
            dataArray = [];
        }
    }
}

async function saveDataToFile() {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(dataArray, null, 2));
        console.log('Data saved to file:', dataArray);
    } catch (error) {
        console.error('Error saving data to file:', error);
    }
}

loadDataFromFile();



app.get('/data', (req, res) => {
    res.json({ message: 'GET request successful', data: dataArray });
});


app.post('/data', (req, res) => {
    const userInput = req.body.userInput;
    dataArray.push(userInput);
    saveDataToFile().then(() => {
        res.json({ message: 'POST request successful', receivedData: userInput });
    }).catch(error => {
        console.error('Error saving data to file:', error);
        res.status(500).json({ error: 'Failed to save data to file' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});