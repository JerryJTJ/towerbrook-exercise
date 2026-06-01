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
	async updateCompany(req: Request, res: Response) {
		try {
			const companyId = Number(req.params.id);

			if (!companyId || Number.isNaN(companyId)) {
				return res.status(400).json({
					message: "Invalid companyId",
				});
			}

			const patch = req.body;

			const updatedCompany = await companyRepository.updateCompanyInfo(
				companyId,
				patch,
			);

			return res.status(200).json({
				message: "Company updated successfully",
				data: updatedCompany,
			});
		} catch (error: any) {
			console.error("updateCompanyInfoController error:", error);

			return res.status(500).json({
				message: "Failed to update company info",
				error: error?.message ?? error,
			});
		}
	},
	async updateCompanyNotes(req: Request, res: Response) {
		try {
			const companyId = Number(req.params.id);

			if (!companyId || Number.isNaN(companyId)) {
				return res.status(400).json({ message: "Invalid companyId" });
			}

			const { notes } = req.body;

			if (typeof notes !== "string") {
				return res.status(400).json({
					message: "Notes must be a string",
				});
			}

			const updated = await companyRepository.updateCompanyNotes(
				companyId,
				notes,
			);

			return res.status(200).json({
				message: "Company notes updated successfully",
				data: updated,
			});
		} catch (error: any) {
			console.error("updateCompanyNotesController error:", error);

			return res.status(500).json({
				message: "Failed to update company notes",
				error: error?.message ?? error,
			});
		}
	},
	async updateCompanySaved(req: Request, res: Response) {
		try {
			const companyId = Number(req.params.id);

			if (!companyId || Number.isNaN(companyId)) {
				return res.status(400).json({ message: "Invalid companyId" });
			}

			const { saved } = req.body;

			if (typeof saved !== "boolean") {
				return res.status(400).json({
					message: "saved must be a boolean",
				});
			}

			const updated = await companyRepository.toggleCompanySaved(
				companyId,
				saved,
			);

			return res.status(200).json({
				message: "Company saved status updated successfully",
				data: updated,
			});
		} catch (error: any) {
			console.error("updateCompanySavedController error:", error);

			return res.status(500).json({
				message: "Failed to update saved status",
				error: error?.message ?? error,
			});
		}
	},
	async deleteCompany(req: Request, res: Response) {
		try {
			const companyId = Number(req.params.id);

			if (!companyId || Number.isNaN(companyId)) {
				return res.status(400).json({ message: "Invalid companyId" });
			}

			await companyRepository.deleteCompany(companyId);

			return res.status(200).json({
				message: "Company deleted successfully",
			});
		} catch (error: any) {
			console.error("deleteCompany error:", error);

			return res.status(500).json({
				message: "Failed to delete company",
				error: error?.message ?? error,
			});
		}
	},
};
