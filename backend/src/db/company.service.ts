import { companyRepository } from "./company.repository.js";

export type CompanyFinanceMetric = "revenue" | "EBITDA" | "equity";

export type CompanyRow = {
	id: number;
	name: string;
	category: string; // normalized (no nulls in UI)
	revenue: number | null;
	EBITDA: number | null;
	equity: number | null;
};

export const companyService = {
	async fetchAllCompanies(): Promise<CompanyRow[]> {
		const data = await companyRepository.getAllCompanies();

		return data.map((c) => {
			const financeMap = Object.fromEntries(
				c.finances.map((f) => [f.metric, f.value]),
			) as Record<CompanyFinanceMetric, number | null>;

			return {
				id: c.id,
				name: c.name,

				// ✅ fix null safety here
				category: c.category ?? "Uncategorized",

				revenue: financeMap.revenue ?? null,
				EBITDA: financeMap.EBITDA ?? null,
				equity: financeMap.equity ?? null,
			};
		});
	},
};
