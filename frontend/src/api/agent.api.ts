import axios from "axios";
import { axiosClient } from "./axiosClient";

export async function runThemeScraper(themeId: number) {
	try {
		const { data } = await axiosClient.post(
			`/api/agents/scraper/theme/${themeId}`,
		);
		return data;
	} catch (err) {
		if (axios.isAxiosError(err)) {
			throw new Error(
				err.response?.data?.error ?? "Failed to run scraper",
			);
		}
		throw err;
	}
}
