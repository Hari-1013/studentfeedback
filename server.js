const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Supabase connection
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Serve frontend
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// GET feedback
app.get("/feedback", async (req, res) => {
    const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

// POST feedback
app.post("/feedback", async (req, res) => {
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

    res.json({ success: true });
});

// Start server
app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on http://localhost:3000");
});