import { axiosClient } from "./axiosClient";

export async function getAllCompanies() {
	try {
		const res = await axiosClient.get("/db/company");
		return res.data;
	} catch (error) {
		return [];
	}
}

export async function getCompanyById(id: number) {
	try {
		const res = await axiosClient.get(`/db/company/${id}`);
		return res.data;
	} catch (error) {
		return {};
	}
}

export async function runCompanyFitAgent(companyId: number) {
	try {
		const res = await axiosClient.post(
			`/api/agents/fit/company/${companyId}`,
		);
		return res.data;
	} catch (error) {
		console.error("Company fit agent error:", error);
		throw error;
	}
}
