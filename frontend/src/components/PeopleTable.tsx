import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { StyledCustomLinkBlack } from "~/components/CustomLink";
import StarIcon from "@mui/icons-material/Star";

type PersonApi = {
	id: number;
	name: string;
	role: string;
	theme: { id: number; name: string };
	company: { id: number; name: string };
	saved: boolean;
};

type PersonRow = {
	id: number;
	name: string;
	role: string;
	theme: string;
	company: string;
	companyId: number;
	saved: boolean;
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
	{
		field: "saved",
		headerName: "Saved",
		width: 90,
		sortable: true,
		renderCell: (params) => (
			<div
				style={{
					display: "flex",
					width: "100%",
					height: "100%",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{params.value && <StarIcon fontSize="small" color="warning" />}
			</div>
		),
	},
];

function toPersonRows(data: PersonApi[]): PersonRow[] {
	return data.map((p) => ({
		id: p.id,
		name: p.name,
		role: p.role,
		theme: p.theme?.name ?? "",
		company: p.company?.name ?? "",
		companyId: p.company?.id ?? 0,
		saved: p.saved,
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
