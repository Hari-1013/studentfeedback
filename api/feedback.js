import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY
    );

    // GET
    if (req.method === "GET") {
        const { data, error } = await supabase
            .from("feedback")
            .select("*")
            .order("id", { ascending: false });

        if (error) return res.status(500).json(error);

        return res.status(200).json(data);
    }

    // POST
    if (req.method === "POST") {
        const { name, message } = req.body;

        const { error } = await supabase
            .from("feedback")
            .insert([{ name, message }]);

        if (error) return res.status(500).json(error);

        return res.status(200).json({ success: true });
    }
}
