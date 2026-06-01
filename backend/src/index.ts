import "dotenv/config";
import express from "express";
import cors from "cors";
import type { Database } from "./interfaces/supabase.js";
import { createClient } from "@supabase/supabase-js";
import CompanyRouter from "./db/company.routes.js";
import PeopleRouter from "./db/people.routes.js";
import agentsRouter from "./agents/agents.routes.js";

const app = express();
app.use(express.json());

app.use(
	cors({
		origin: "http://localhost:3000",
	}),
);
const port = 3001;

// Supabase client setup
export const supabase = createClient<Database>(
	process.env.SUPABASE_URL || "",
	process.env.SUPABASE_PUBLISHABLE_KEY || "",
);

// Routes
app.use("/db/company", CompanyRouter);
app.use("/db/people", PeopleRouter);
app.use("/api/agents", agentsRouter);
// app.post("/scraper/theme/:id", async (req, res) => {
// 	const themeId = req.params.id;

// 	const { data, error } = await supabase
// 		.from("theme")
// 		.select("name")
// 		.eq("id", Number(themeId))
// 		.single();

// 	if (error || !data) return res.status(500).json({ error: error.message });

// 	const resp = await runScraperAgent(data.name);
// 	res.send(resp);
// });

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
