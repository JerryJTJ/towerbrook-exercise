import { supabase } from "../index.js";

export const peopleRepository = {
	async getAllPeople() {
		const { data, error } = await supabase.from("people").select(`
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
    `);

		if (error) {
			console.error(error);
			throw error;
		}

		return data ?? [];
	},
};
