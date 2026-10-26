const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/estimate-trip', async (req, res) => {
    try {
        const { destination, destinationName, startDate, endDate, members, membersCount } = req.body;
        
        const dest = destination || destinationName || 'Trip';
        const count = membersCount || (members ? (Array.isArray(members) ? members.length : members.split(',').filter(m => m.trim().length > 0).length + 1) : 1);

        const prompt = `Provide an estimated budget in INR and top places to visit for a trip to ${dest} for ${count} people from ${startDate || 'upcoming dates'} to ${endDate || ''}.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
        });

        const estimateText = response.text || (response.candidates && response.candidates[0]?.content?.parts[0]?.text) || "No estimation generated.";

        res.json({ estimate: estimateText });
    } catch (err) {
        console.error("AI estimation error (Using fallback):", err.message);
        
        // Smart Fallback Estimation with dynamic member count
        const { destination, destinationName, members, membersCount } = req.body;
        const dest = destination || destinationName || 'Trip';
        const count = membersCount || (members ? (Array.isArray(members) ? members.length : members.split(',').filter(m => m.trim().length > 0).length + 1) : 1);

        const minCost = count * 5000;
        const maxCost = count * 12000;

        const fallbackEstimate = `Estimated Budget for ${dest} (${count} traveler${count > 1 ? 's' : ''}):\n\n` +
            `• Estimated Total Cost: ₹${minCost} - ₹${maxCost} (Covering stay, local travel, and meals).\n\n` +
            `• Recommended Duration: 3-4 Days.\n\n` +
            `• Top Attractions: Local heritage spots, scenic viewpoints, popular food streets, and cultural centers.\n\n` +
            `(Note: AI service is currently experiencing high demand, showing estimated standard calculations.)`;

        res.json({ estimate: fallbackEstimate });
    }
});

module.exports = router;