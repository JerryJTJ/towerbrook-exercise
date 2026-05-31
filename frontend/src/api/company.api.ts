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
