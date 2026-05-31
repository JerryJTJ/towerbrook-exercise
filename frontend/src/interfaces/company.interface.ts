export interface Company {
	id: number;
	created_at: string;
	name: string;
	theme: string;
	website: string | null;
	category: string;
	description: string | null;
	finances: CompanyFinances[];
}

export type FinanceMetric = "revenue" | "EBITDA" | "equity";

export interface CompanyFinances {
	id: number;
	metric: FinanceMetric;
	value: number;
	source: string;
}
