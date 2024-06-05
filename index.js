const express = require('express');
const path = require('path');
const request = require('request');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Check Facebook token
app.post('/api/checkToken', (req, res) => {
    const token = req.body.token;
    const checktoken = {
        method: 'GET',
        url: `https://graph.facebook.com/me?fields=id,name,email,picture,birthday,location&access_token=${token}`,
    };

    request(checktoken, (err, response, body) => {
        if (err) {
            return res.status(500).json({ error: 'Token check failed' });
        }

        const result = JSON.parse(body);
        res.json(result);
    });
});

// Turn on profile guard
app.post('/api/turnOnShield', (req, res) => {
    const token = req.body.token;
    const id = req.body.id;
    const shieldmaker = {
        method: 'POST',
        url: 'https://graph.facebook.com/graphql',
        headers: {
            Authorization: `OAuth ${token}`,
        },
        formData: {
            variables: `{"0":{"is_shielded":true,"actor_id":"${id}","client_mutation_id":"b0316dd6-3fd6-4beb-aed4-bb29c5dc64b0"}}`,
            doc_id: '1477043292367183',
        },
    };

    request(shieldmaker, (err, response, body) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to turn on shield' });
        }

        const result = JSON.parse(body);
        res.json(result);
    });
});

// Turn off profile guard
app.post('/api/turnOffShield', (req, res) => {
    const token = req.body.token;
    const id = req.body.id;
    const shieldmaker = {
        method: 'POST',
        url: 'https://graph.facebook.com/graphql',
        headers: {
            Authorization: `OAuth ${token}`,
        },
        formData: {
            variables: `{"0":{"is_shielded":false,"actor_id":"${id}","client_mutation_id":"b0316dd6-3fd6-4beb-aed4-bb29c5dc64b0"}}`,
            doc_id: '1477043292367183',
        },
    };

    request(shieldmaker, (err, response, body) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to turn off shield' });
        }

        const result = JSON.parse(body);
        res.json(result);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
