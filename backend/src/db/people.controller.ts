import type { Request, Response } from "express";
import { peopleRepository } from "./people.repository.js";

export const peopleController = {
	async fetchAllPeople(req: Request, res: Response) {
		try {
			const data = await peopleRepository.getAllPeople();
			res.json(data);
		} catch (err) {
			res.status(500).json({ error: "Failed to fetch people" });
		}
	},
	async fetchAllPeopleByCompanyId(req: Request, res: Response) {
		const { companyId } = req.params;

		try {
			const data = await peopleRepository.getAllPeopleByCompanyId(
				Number(companyId),
			);
			res.json(data);
		} catch (err) {
			res.status(500).json({ error: "Failed to fetch people" });
		}
	},
	async fetchPersonById(req: Request, res: Response) {
		const { id } = req.params;

		try {
			const data = await peopleRepository.getPersonById(Number(id));
			res.json(data);
		} catch (err) {
			res.status(500).json({ error: "Failed to fetch person" });
		}
	},
	async updatePeopleNotes(req: Request, res: Response) {
		try {
			const peopleId = Number(req.params.id);

			if (!peopleId || Number.isNaN(peopleId)) {
				return res.status(400).json({ message: "Invalid peopleId" });
			}

			const { notes } = req.body;

			if (typeof notes !== "string") {
				return res.status(400).json({
					message: "Notes must be a string",
				});
			}

			const updated = await peopleRepository.updatePeopleNotes(
				peopleId,
				notes,
			);

			return res.status(200).json({
				message: "People notes updated successfully",
				data: updated,
			});
		} catch (error: any) {
			console.error("updatePeopleNotes error:", error);

			return res.status(500).json({
				message: "Failed to update people notes",
				error: error?.message ?? error,
			});
		}
	},
	async updatePeopleSaved(req: Request, res: Response) {
		try {
			const peopleId = Number(req.params.id);

			if (!peopleId || Number.isNaN(peopleId)) {
				return res.status(400).json({ message: "Invalid peopleId" });
			}

			const { saved } = req.body;

			if (typeof saved !== "boolean") {
				return res.status(400).json({
					message: "saved must be a boolean",
				});
			}

			const updated = await peopleRepository.updatePeopleSaved(
				peopleId,
				saved,
			);

			return res.status(200).json({
				message: "People saved status updated successfully",
				data: updated,
			});
		} catch (error: any) {
			console.error("updatePeopleSaved error:", error);

			return res.status(500).json({
				message: "Failed to update people saved status",
				error: error?.message ?? error,
			});
		}
	},
	async deletePeople(req: Request, res: Response) {
		try {
			const peopleId = Number(req.params.id);

			if (!peopleId || Number.isNaN(peopleId)) {
				return res.status(400).json({ message: "Invalid peopleId" });
			}

			await peopleRepository.deletePeople(peopleId);

			return res.status(200).json({
				message: "People deleted successfully",
			});
		} catch (error: any) {
			console.error("deletePeople error:", error);

			return res.status(500).json({
				message: "Failed to delete people",
				error: error?.message ?? error,
			});
		}
	},
};
