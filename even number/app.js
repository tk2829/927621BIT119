const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;

const WINDOW_SIZE = 10;
let window = [];

const NUMBERS_API_URLS = {
    "p": "http://20.244.56.144/test/primes",
    "f": "http://20.244.56.144/test/fibo",
    "e": "http://20.244.56.144/test/even",
    "r": "http://20.244.56.144/test/rand"
};

async function fetchNumbers(type) {
    try {
        const response = await axios.get(NUMBERS_API_URLS[type], { timeout: 500 });
        return response.data.numbers;
    } catch (error) {
        console.error(`Error fetching numbers: ${error.message}`);
        return [];
    }
}

app.get('/numbers/:type', async (req, res) => {
    const type = req.params.type;

    if (!NUMBERS_API_URLS[type]) {
        return res.status(400).json({ error: "Invalid number type" });
    }

    const numbers = await fetchNumbers(type);
    if (!numbers.length) {
        return res.status(500).json({ error: "Failed to fetch numbers" });
    }

    const windowPrevState = [...window];

    for (const number of numbers) {
        if (!window.includes(number)) {
            if (window.length >= WINDOW_SIZE) {
                window.shift();
            }
            window.push(number);
        }
    }

    const avg = window.length ? (window.reduce((a, b) => a + b, 0) / window.length) : 0;

    const response = {
        windowPrevState,
        windowCurrState: window,
        numbers,
        avg: parseFloat(avg.toFixed(2))
    };

    res.json(response);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
