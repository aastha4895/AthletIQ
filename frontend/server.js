const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));

// Route for landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing-page.html'));
});

app.listen(PORT, () => {
    console.log(`Frontend server running on http://localhost:${PORT}`);
});