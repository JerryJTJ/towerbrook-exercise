import type { Request, Response } from "express";
import { companyRepository } from "./company.repository.js";

export const companyController = {
	async fetchAllCompanies(req: Request, res: Response) {
		try {
			const data = await companyRepository.getAllCompanies();
			res.json(data);
		} catch (err) {
			res.status(500).json({ error: "Failed to fetch companies" });
		}
	},
	async fetchCompanyById(req: Request, res: Response) {
		const { id } = req.params;

		const companyId = Number(id);

		if (Number.isNaN(companyId)) {
			return res.status(400).json({ error: "Invalid company id" });
		}
		try {
			const data = await companyRepository.getCompanyById(companyId);
			res.json(data);
		} catch (err) {
			res.status(500).json({ error: "Failed to fetch companies" });
		}
	},
};
