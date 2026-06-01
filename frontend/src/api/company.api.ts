import { axiosClient } from "./axiosClient";

export async function getAllCompanies() {
	try {
		const res = await axiosClient.get("/db/company");
		return res.data;
	} catch {
		return [];
	}
}

export async function getCompanyById(id: number) {
	try {
		const res = await axiosClient.get(`/db/company/${id}`);
		return res.data;
	} catch {
		return {};
	}
}

export async function updateCompanySaved(id: number, saved: boolean) {
	try {
		const res = await axiosClient.post(`/db/company/${id}/saved`, {
			saved,
		});
		return res.data;
	} catch (error) {
		console.error("Toggle company saved error:", error);
		throw error;
	}
}

export async function updateCompanyNotes(id: number, notes: string) {
	try {
		const res = await axiosClient.post(`/db/company/${id}/notes`, {
			notes,
		});
		return res.data;
	} catch (error) {
		console.error("Update company notes error:", error);
		throw error;
	}
}

export async function deleteCompany(id: number) {
	try {
		const res = await axiosClient.delete(`/db/company/${id}`);
		return res.data;
	} catch (error) {
		console.error("Delete company error:", error);
		throw error;
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
