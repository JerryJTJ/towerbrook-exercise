import { createFileRoute } from "@tanstack/react-router";
import { Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Company, FinanceMetric } from "~/interfaces/company.interface";
import { mockCompanies } from "~/mockData/companies.data";

export const Route = createFileRoute("/companies")({
	component: RouteComponent,
});

type CompanyRow = {
	id: number;
	name: string;
	category: string;

	revenue: number | null;
	EBITDA: number | null;
	equity: number | null;
};

export function toCompanyRows(companies: Company[]): CompanyRow[] {
	return companies.map((c) => {
		const get = (metric: FinanceMetric) =>
			c.finances.find((f) => f.metric === metric)?.value ?? null;

		return {
			id: c.id,
			name: c.name,
			category: c.category,

			revenue: get("revenue"),
			EBITDA: get("EBITDA"),
			equity: get("equity"),
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
	return (
		<DataGrid
			columns={columns}
			rows={toCompanyRows(mockCompanies)}
		></DataGrid>
	);
}
