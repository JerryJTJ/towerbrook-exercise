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

export async function updatePeopleSaved(id: number, saved: boolean) {
	try {
		const res = await axiosClient.post(`/db/people/${id}/saved`, {
			saved,
		});
		return res.data;
	} catch (error) {
		console.error("Toggle people saved error:", error);
		throw error;
	}
}

export async function updatePeopleNotes(id: number, notes: string) {
	try {
		const res = await axiosClient.post(`/db/people/${id}/notes`, {
			notes,
		});
		return res.data;
	} catch (error) {
		console.error("Update people notes error:", error);
		throw error;
	}
}
export async function deletePeople(id: number) {
	try {
		const res = await axiosClient.delete(`/db/people/${id}`);
		return res.data;
	} catch (error) {
		console.error("Delete people error:", error);
		throw error;
	}
}
