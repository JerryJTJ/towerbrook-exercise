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
};
