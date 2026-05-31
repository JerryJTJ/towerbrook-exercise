import { axiosClient } from "./axiosClient";

export async function getAllPeople() {
	try {
		const res = await axiosClient.get("/db/people");
		return res.data;
	} catch (error) {
		return [];
	}
}
