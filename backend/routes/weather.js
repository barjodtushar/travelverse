const router = require('express').Router();
const axios = require('axios');

router.get('/:location', async (req, res) => {
    try {
        let location = req.params.location;

        // Strip extra destination words (e.g. "Andaman Island Escape" -> "Andaman")
        const cleanLocation = location.split(' ')[0];

        const apiKey = process.env.WEATHER_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "Weather API key not found in .env" });
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cleanLocation)}&units=metric&appid=${apiKey}`;
        const response = await axios.get(url);

        res.status(200).json(response.data);
    } catch (err) {
        console.error("Weather API error:", err.response?.data || err.message);
        res.status(500).json({ message: "Error fetching weather data" });
    }
});

module.exports = router;