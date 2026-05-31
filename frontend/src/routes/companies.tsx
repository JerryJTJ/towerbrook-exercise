import { createFileRoute } from "@tanstack/react-router";
import { Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllCompanies } from "~/api/company.api";
import { useMemo } from "react";

export const Route = createFileRoute("/companies")({
	component: RouteComponent,
});

type FinanceMetric = "revenue" | "EBITDA" | "equity";

type CompanyApi = {
	id: number;
	name: string;
	category: string;
	theme: {
		id: number;
		name: string;
	} | null;
	finances: {
		id: number;
		metric: FinanceMetric;
		value: number | null;
		source: string;
	}[];
};

type CompanyRow = {
	id: number;
	name: string;
	category: string;
	theme: string;
	revenue: number | null;
	EBITDA: number | null;
	equity: number | null;
};

export function toCompanyRows(data: CompanyApi[]): CompanyRow[] {
	return data.map((c) => {
		const finances = c.finances ?? [];

		const financeMap: Partial<Record<FinanceMetric, number | null>> = {};

		for (const f of finances) {
			financeMap[f.metric] = f.value;
		}

		return {
			id: c.id,
			name: c.name,
			category: c.category,
			theme: c.theme?.name ?? "—",

			revenue: financeMap.revenue ?? null,
			EBITDA: financeMap.EBITDA ?? null,
			equity: financeMap.equity ?? null,
		};
	});
}

const columns: GridColDef[] = [
	{ field: "name", headerName: "Company", flex: 1 },
	{ field: "category", headerName: "Category", width: 140 },
	{ field: "theme", headerName: "Theme", width: 140, type: "string" },
	{ field: "revenue", headerName: "Revenue", width: 140, type: "number" },
	{ field: "EBITDA", headerName: "EBITDA", width: 140, type: "number" },
	{ field: "equity", headerName: "Equity", width: 140, type: "number" },
];

function RouteComponent() {
	const query = useQuery({
		queryKey: ["companies"],
		queryFn: getAllCompanies,
	});

	const data = useMemo(() => {
		if (!query.data) return [];
		return query.data;
	}, [query.data]);

	return (
		<DataGrid
			rows={toCompanyRows(data)}
			columns={columns}
			loading={query.isLoading}
			getRowId={(row) => row.id}
		/>
	);
}
