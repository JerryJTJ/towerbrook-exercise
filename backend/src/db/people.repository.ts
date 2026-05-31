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
      )
    `;

const peopleApiResponseDetailed = peopleApiResponse + ", call_info";

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
