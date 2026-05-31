import { axiosClient } from "./axiosClient";

export async function getAllCompanies() {
	try {
		const res = await axiosClient.get("/db/company");
		return res.data;
	} catch (error) {
		return [];
	}
}
