import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { StyledCustomLinkBlack } from "~/components/CustomLink";

type FinanceMetric = "revenue" | "EBITDA" | "equity";

export type CompanyApi = {
	id: number;
	name: string;
	category: string;
	score: number;
	theme: { id: number; name: string } | null;
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
	score: number;
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
			score: c.score,
			theme: c.theme?.name ?? "—",
			revenue: financeMap.revenue ?? null,
			EBITDA: financeMap.EBITDA ?? null,
			equity: financeMap.equity ?? null,
		};
	});
}

const columns: GridColDef[] = [
	{
		field: "name",
		headerName: "Company",
		flex: 1,
		renderCell: (params) => (
			<StyledCustomLinkBlack
				to="/company/$companyId"
				params={{ companyId: String(params.row.id) }}
			>
				{params.value}
			</StyledCustomLinkBlack>
		),
	},
	{ field: "category", headerName: "Category", width: 140 },
	{ field: "theme", headerName: "Theme", width: 140, type: "string" },
	{ field: "score", headerName: "Score", width: 140, type: "string" },
	// { field: "revenue", headerName: "Revenue", width: 140, type: "number" },
	// { field: "EBITDA", headerName: "EBITDA", width: 140, type: "number" },
	// { field: "equity", headerName: "Equity", width: 140, type: "number" },
];

type CompanyTableProps = {
	data: CompanyApi[];
	isLoading: boolean;
};

export function CompanyTable({ data, isLoading }: CompanyTableProps) {
	return (
		<DataGrid
			rows={toCompanyRows(data)}
			columns={columns}
			loading={isLoading}
			getRowId={(row) => row.id}
			showToolbar
		/>
	);
}
