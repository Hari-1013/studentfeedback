const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(__dirname));

// Supabase connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// GET all feedback
app.get("/feedback", async (req, res) => {
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("id", { ascending: false });

  if (error) return res.json({ error });
  res.json(data);
});

// POST feedback
app.post("/feedback", async (req, res) => {
  const { name, message } = req.body;

  const { data, error } = await supabase
    .from("feedback")
    .insert([{ name, message }]);

  if (error) return res.json({ error });

  res.json({ success: true, data });
});

app.listen(process.env.PORT, () => {
  console.log("Server running on http://localhost:" + process.env.PORT);
});