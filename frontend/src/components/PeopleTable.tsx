import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { StyledCustomLinkBlack } from "~/components/CustomLink";

type PersonApi = {
	id: number;
	name: string;
	role: string;
	theme: { id: number; name: string };
	company: { id: number; name: string };
};

type PersonRow = {
	id: number;
	name: string;
	role: string;
	theme: string;
	company: string;
};

const columns: GridColDef[] = [
	{
		field: "name",
		headerName: "Name",
		flex: 1,
		renderCell: (params) => (
			<StyledCustomLinkBlack
				to="/people/$peopleId"
				params={{ peopleId: String(params.row.id) }}
			>
				{params.value}
			</StyledCustomLinkBlack>
		),
	},
	{
		field: "company",
		headerName: "Company",
		width: 140,
		renderCell: (params) => (
			<StyledCustomLinkBlack
				to="/company/$companyId"
				params={{ companyId: String(params.row.companyId) }}
			>
				{params.value}
			</StyledCustomLinkBlack>
		),
	},
	{ field: "role", headerName: "Role", width: 140, type: "string" },
	{ field: "theme", headerName: "Theme", width: 140, type: "string" },
];

function toPersonRows(data: PersonApi[]): PersonRow[] {
	return data.map((p) => ({
		id: p.id,
		name: p.name,
		role: p.role,
		theme: p.theme?.name ?? "",
		company: p.company?.name ?? "",
		companyId: p.company?.id ?? 0,
	}));
}

type PeopleTableProps = {
	data: PersonApi[];
	isLoading: boolean;
};

export function PeopleTable({ data, isLoading }: PeopleTableProps) {
	return (
		<DataGrid
			rows={toPersonRows(data)}
			columns={columns}
			loading={isLoading}
			getRowId={(row) => row.id}
			showToolbar
		/>
	);
}
