import type { Request, Response } from "express";
import { companyService } from "./company.service.js";

export const companyController = {
	async getCompanies(req: Request, res: Response) {
		try {
			const data = await companyService.fetchAllCompanies();
			res.json(data);
		} catch (err) {
			res.status(500).json({ error: "Failed to fetch companies" });
		}
	},
};
