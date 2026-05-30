import "dotenv/config";
import express from "express";
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

const app = express();
app.use(express.json());
const port = 3001;

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

	console.log(data.companies);
	console.log(data.people);

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
