import { axiosClient } from "./axiosClient";

export type CompanyFinanceMetric = "revenue" | "EBITDA" | "equity";

export type CompanyFinance = {
	id: number;
	metric: CompanyFinanceMetric;
	value: number | null;
	source: string;
};

export type Company = {
	id: number;
	name: string;
	category: string;
	website: string | null;
	description: string | null;
	created_at: string;
	finances: CompanyFinance[];
};

export type CompanyRow = {
	id: number;
	name: string;
	category: string;
	revenue: number | null;
	EBITDA: number | null;
	equity: number | null;
};

export async function fetchCompanies(): Promise<Company[]> {
	try {
		const res = await axiosClient.get<Company[]>("/db/company");
		return res.data;
	} catch (error) {
		return [];
	}
}
