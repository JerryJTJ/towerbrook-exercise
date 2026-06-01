import { Router, type Request, type Response } from "express";
import { runResearcherAgent } from "./researcher.js";
import { runScraperAgent } from "./scraper.js";
import { runCallPrepAgent } from "./contact.js";
import { runAnalystAgent } from "./analyst.js";
import { supabase } from "../index.js";

const agentsRouter: Router = Router();

agentsRouter.post("/scraper/theme/:id", async (req: Request, res: Response) => {
	console.log(
		"Received request to run scraper agent for theme ID:",
		req.params.id,
	);
	const themeId = Number(req.params.id);

	const { data, error } = await supabase
		.from("theme")
		.select("name")
		.eq("id", Number(themeId))
		.single();

	if (error || !data) return res.status(500).json({ error: error.message });

	const theme = data.name;

	if (!themeId || typeof themeId !== "number") {
		res.status(400).json({
			error: "theme is required and must be a number",
		});
		return;
	}

	try {
		await runScraperAgent(themeId);
		res.status(200).json({
			success: true,
			message: `Scraper completed for theme: "${theme}"`,
		});
	} catch (error) {
		res.status(500).json({
			error: (error as Error).message ?? "Scraper agent failed",
		});
	}
});

agentsRouter.post("/researcher", async (req: Request, res: Response) => {
	const { company } = req.body;

	if (!company || typeof company !== "string") {
		res.status(400).json({
			error: "company is required and must be a string",
		});
		return;
	}

	try {
		await runResearcherAgent(company);
		res.status(200).json({
			success: true,
			message: `Research completed for company: "${company}"`,
		});
	} catch (error) {
		res.status(500).json({
			error: (error as Error).message ?? "Researcher agent failed",
		});
	}
});

agentsRouter.get(
	"/callprep/person/:id",
	async (req: Request, res: Response) => {
		const personId = Number(req.params.id);

		if (isNaN(personId)) {
			res.status(400).json({ error: "id must be a number" });
			return;
		}

		try {
			const brief = await runCallPrepAgent(personId);
			res.status(200).json({ success: true, data: brief });
		} catch (error) {
			res.status(500).json({
				error: (error as Error).message ?? "Call prep agent failed",
			});
		}
	},
);

agentsRouter.post("/fit/company/:id", async (req: Request, res: Response) => {
	const companyId = Number(req.params.id);

	if (isNaN(companyId)) {
		res.status(400).json({ error: "id must be a number" });
		return;
	}

	try {
		const result = await runAnalystAgent(companyId);

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			error: (error as Error).message ?? "Company fit agent failed",
		});
	}
});

export default agentsRouter;
