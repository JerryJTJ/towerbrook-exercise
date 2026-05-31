import { supabase } from "../index.js";

export const companyRepository = {
	async getAllCompanies() {
		const { data, error } = await supabase.from("company").select(`
      id,
      name,
      category,
      theme:theme_id (
        id,
        name
      ),
      finances:company_finance (
        id,
        metric,
        value,
        source
      )
    `);

		if (error) {
			console.error(error);
			throw error;
		}

		return data ?? [];
	},
};
