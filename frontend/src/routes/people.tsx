import { createFileRoute } from "@tanstack/react-router";
import { Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getAllCompanies } from "~/api/company.api";
import { getAllPeople } from "~/api/people.api";

export const Route = createFileRoute("/people")({
	component: RouteComponent,
});

const columns: GridColDef[] = [
	{ field: "name", headerName: "Name", flex: 1 },
	{ field: "company", headerName: "Company", width: 140 },
	{ field: "role", headerName: "Role", width: 140, type: "string" },
	{ field: "theme", headerName: "Theme", width: 140, type: "string" },
];

type PersonApi = {
	id: number;
	name: string;
	role: string;
	theme: {
		id: number;
		name: string;
	};
	company: {
		id: number;
		name: string;
	};
};

type PersonRow = {
	id: number;
	name: string;
	role: string;
	theme: string;
	company: string;
};

function toPersonRows(data: PersonApi[]): PersonRow[] {
	return data.map((p) => ({
		id: p.id,
		name: p.name,
		role: p.role,
		theme: p.theme?.name ?? "",
		company: p.company?.name ?? "",
	}));
}

function RouteComponent() {
	const query = useQuery({
		queryKey: ["companies"],
		queryFn: getAllPeople,
	});

	const data = useMemo(() => {
		if (!query.data) return [];
		return query.data;
	}, [query.data]);

	return (
		<DataGrid
			rows={toPersonRows(data)}
			columns={columns}
			loading={query.isLoading}
			getRowId={(row) => row.id}
		/>
	);
}
