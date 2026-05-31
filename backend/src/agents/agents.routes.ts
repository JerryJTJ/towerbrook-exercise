import { Router, type Request, type Response } from "express";
import { runResearcherAgent } from "./researcher.js";
import { runScraperAgent } from "./scraper.js";
import { runCallPrepAgent } from "./contact.js";

const agentsRouter: Router = Router();

agentsRouter.post("/scraper", async (req: Request, res: Response) => {
	const { theme } = req.body;

	if (!theme || typeof theme !== "string") {
		res.status(400).json({
			error: "theme is required and must be a string",
		});
		return;
	}

	try {
		await runScraperAgent(theme);
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

export default agentsRouter;
