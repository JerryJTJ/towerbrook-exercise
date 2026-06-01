import { supabase } from "../index.js";
import type { TablesInsert, TablesUpdate } from "../interfaces/supabase.js";

export const companyRepository = {
	async getAllCompanies() {
		const { data, error } = await supabase.from("company").select(`
      id,
      name,
      category,
      description,
      website,
      score,
      theme:theme_id (
        id,
        name
      ),
      finances:company_finance (
        id,
        metric,
        value,
        source
      ),
      saved
    `);

		if (error) {
			console.error(error);
			throw error;
		}

		return data ?? [];
	},

	async getCompanyById(id: number) {
		const { data, error } = await supabase
			.from("company")
			.select(
				`
      id,
      name,
      category,
      description,
      website,
      score,
      info,
      theme:theme_id (
        id,
        name
      ),
      finances:company_finance (
        id,
        metric,
        value,
        source
      ),
      notes,
      saved
    `,
			)
			.eq("id", id)
			.single();

		if (error) {
			console.error(error);
			throw error;
		}

		return data ?? {};
	},

	async updateCompanyInfo(
		companyId: number,
		patch: Partial<TablesInsert<"company">>,
	) {
		const { data, error } = await supabase
			.from("company")
			.update({
				...patch,
			})
			.eq("id", companyId)
			.select()
			.single();

		if (error) {
			console.error("updateCompanyInfo error:", error);
			throw error;
		}

		return data ?? null;
	},

	async updateCompanyNotes(
		companyId: number,
		notes: TablesUpdate<"company">["notes"],
	) {
		const { data, error } = await supabase
			.from("company")
			.update({ notes: String(notes) })
			.eq("id", companyId)
			.select()
			.single();

		if (error) {
			console.error("updateCompanyNotesRepo error:", error);
			throw error;
		}

		return data ?? null;
	},

	async toggleCompanySaved(companyId: number, saved: boolean) {
		const { data, error } = await supabase
			.from("company")
			.update({ saved: saved })
			.eq("id", companyId)
			.select()
			.single();

		if (error) {
			console.error("updateCompanySavedRepo error:", error);
			throw error;
		}

		return data ?? null;
	},

	// Financials
	async insertCompanyFinancials(
		financials: TablesInsert<"company_finance">[],
	) {
		const { error } = await supabase
			.from("company_finance")
			.insert(financials);

		if (error) {
			console.error("Error inserting company financials:", error);
			throw error;
		}
	},
	async deleteCompany(id: number) {
		const { error } = await supabase.from("company").delete().eq("id", id);

		if (error) {
			console.error("deleteCompany error:", error);
			throw error;
		}
	},

	async replaceCompanyFinancials(
		companyId: number,
		metrics: TablesInsert<"company_finance">[],
	) {
		// delete existing
		const { error: deleteError } = await supabase
			.from("company_finance")
			.delete()
			.eq("company_id", companyId);

		if (deleteError) {
			console.error("delete financials error:", deleteError);
			throw deleteError;
		}

		if (!metrics.length) return;

		// ensure company_id is consistent (override if missing/wrong)
		const rows = metrics.map((m) => ({
			...m,
			company_id: companyId,
		}));

		const { error: insertError } = await supabase
			.from("company_finance")
			.insert(rows);

		if (insertError) {
			console.error("insert financials error:", insertError);
			throw insertError;
		}
	},
};
