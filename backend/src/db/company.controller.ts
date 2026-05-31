import type { Request, Response } from "express";
import { companyRepository } from "./company.repository.js";

export const companyController = {
	async getCompanies(req: Request, res: Response) {
		try {
			const data = await companyRepository.getAllCompanies();
			res.json(data);
		} catch (err) {
			res.status(500).json({ error: "Failed to fetch companies" });
		}
	},
};
