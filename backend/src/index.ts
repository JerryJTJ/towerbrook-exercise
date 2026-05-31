import "dotenv/config";
import express from "express";
import cors from "cors";
import { runScraperAgent } from "./agents/scraper.js";
import {
	tavilyCompanyResearch,
	tavilySearch,
	tavilyThemeSearch,
} from "./tools/tavily.js";
import { runGoogleScraperAgent } from "./agents/googleScraper.js";
import { tavily, type TavilyGetResearchResponse } from "@tavily/core";
import { scraperData } from "./data/scraper.data.js";
import type { Database } from "./interfaces/supabase.js";
import {
	handleInsertPerson,
	insertCompanies,
	insertPeople,
} from "./tools/supabase.tool.js";
import { runResearcherAgent } from "./agents/researcher.js";
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

app.get("/tavily", async (req, res) => {
	const data = req.body;
	const resp = await tavilySearch(data.theme);
	res.json(resp);
});

app.get("/tavily-theme", async (req, res) => {
	const data = req.body;
	const resp = await tavilyThemeSearch(data.theme);
	res.send(resp);
});

app.get("/research", async (req, res) => {
	const data = req.body;
	const resp = await runResearcherAgent(data.company);
	res.json(resp);
});

app.get("/tavily_r/:id", async (req, res) => {
	const { id } = req.params;
	const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY || "" });

	const resp = await tavilyClient.getResearch(id);

	res.json(resp);
});

app.get("/scraper", async (req, res) => {
	const resp = await runScraperAgent("clean energy advisory development");
	res.send(resp);
});

app.get("/google", async (req, res) => {
	const resp = await runGoogleScraperAgent(
		"clean energy advisory development",
	);
	res.send(resp);
});

app.post("/insert", async (req, res) => {
	const data = scraperData;

	await insertCompanies(
		data.companies.map((company) => ({ ...company, theme_id: 1 })),
	);

	Promise.all(
		data.people.map(async (person) => {
			await handleInsertPerson({
				...person,
				theme_id: 1,
			});
		}),
	);

	res.status(200);
});

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
