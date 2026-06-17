const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend (index.html in same folder)
app.use(express.static(__dirname));

// Supabase connection
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Home route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// GET all feedback
app.get("/feedback", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("feedback")
            .select("*")
            .order("id", { ascending: false });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new feedback
app.post("/feedback", async (req, res) => {
    try {
        const { name, message } = req.body;

        if (!name || !message) {
            return res.status(400).json({ error: "Name and message required" });
        }

        const { data, error } = await supabase
            .from("feedback")
            .insert([{ name, message }]);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});