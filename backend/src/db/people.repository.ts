import type { CallPrepOutput } from "../agents/contact.js";
import { supabase } from "../index.js";

const peopleApiResponse = `
      id,
      name,
      role,
      theme:theme_id (
        id,
        name
      ),
      company:company_id (
        id,
        name
      ),
	  saved
    `;

const peopleApiResponseDetailed = peopleApiResponse + ", call_info, notes";

export const peopleRepository = {
	async getAllPeople() {
		const { data, error } = await supabase
			.from("people")
			.select(peopleApiResponse);

		if (error) {
			console.error(error);
			throw error;
		}

		return data ?? [];
	},

	async getAllPeopleByCompanyId(companyId: number) {
		const { data, error } = await supabase
			.from("people")
			.select(peopleApiResponse)
			.eq("company_id", companyId);

		if (error) {
			console.error(error);
			throw error;
		}

		return data ?? [];
	},

	async getPersonById(id: number) {
		const { data, error } = await supabase
			.from("people")
			.select(peopleApiResponseDetailed)
			.eq("id", id)
			.single();

		if (error) {
			console.error(error);
			throw error;
		}

		return data ?? [];
	},
	async updatePeopleNotes(peopleId: number, notes: string) {
		const { data, error } = await supabase
			.from("people")
			.update({ notes })
			.eq("id", peopleId)
			.select()
			.single();

		if (error) {
			console.error("updatePeopleNotes error:", error);
			throw error;
		}

		return data ?? null;
	},
	async updatePeopleSaved(peopleId: number, saved: boolean) {
		const { data, error } = await supabase
			.from("people")
			.update({ saved })
			.eq("id", peopleId)
			.select()
			.single();

		if (error) {
			console.error("updatePeopleSaved error:", error);
			throw error;
		}

		return data ?? null;
	},

	async deletePeople(id: number) {
		const { error } = await supabase.from("people").delete().eq("id", id);

		if (error) {
			console.error("deletePeople error:", error);
			throw error;
		}
	},

	async updatePersonCallInfo(id: number, callInfo: {}) {
		const { error } = await supabase
			.from("people")
			.update({
				call_info: callInfo,
			})
			.eq("id", id);

		if (error) {
			console.error(error);
			throw error;
		}
	},
};
