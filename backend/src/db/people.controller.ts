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
};
