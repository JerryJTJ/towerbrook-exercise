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
			.select(peopleApiResponse)
			.eq("id", id)
			.single();

		if (error) {
			console.error(error);
			throw error;
		}

		return data ?? [];
	},
};
