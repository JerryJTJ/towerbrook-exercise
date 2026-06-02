import "dotenv/config";
import express from "express";
import cors from "cors";
import type { Database } from "./interfaces/supabase.js";
import { createClient } from "@supabase/supabase-js";
import CompanyRouter from "./db/company.routes.js";
import PeopleRouter from "./db/people.routes.js";
import agentsRouter from "./agents/agents.routes.js";
import axios from "axios";

const app = express();
app.use(express.json());

app.use(
	cors({
		origin: process.env.BASE_URL || "http://localhost:3000",
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

// Keep database & backend from sleeping on free hosting tiers
app.get("/ping", async (req, res) => {
	const data = await supabase.from("company").select("*").limit(1);
	res.end().status(200);
});
const SERVER_URL = process.env.SERVER_URL;
if (SERVER_URL) {
	setInterval(() => {
		void axios.get(`${SERVER_URL}/ping`);
	}, 300000);
}

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
