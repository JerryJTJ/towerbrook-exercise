import { axiosClient } from "./axiosClient";

export async function getAllPeople() {
	try {
		const res = await axiosClient.get("/db/people");
		return res.data;
	} catch (error) {
		return [];
	}
}

export async function getAllPeopleByCompanyId(companyId: number) {
	try {
		const res = await axiosClient.get(`/db/people/company/${companyId}`);
		return res.data;
	} catch (error) {
		return [];
	}
}

export async function getPersonById(id: number) {
	try {
		const res = await axiosClient.get(`/db/people/${id}`);
		return res.data;
	} catch (error) {
		return [];
	}
}

export async function getCallBriefByPersonId(id: number) {
	const res = await axiosClient.get(`/api/agents/callprep/person/${id}`);
	return res.data;
}
