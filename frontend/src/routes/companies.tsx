import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getAllCompanies } from "~/api/company.api";
import { CompanyTable } from "~/components/CompanyTable";

export const Route = createFileRoute("/companies")({
	component: RouteComponent,
});

function RouteComponent() {
	const query = useQuery({
		queryKey: ["companies"],
		queryFn: getAllCompanies,
	});

	const data = useMemo(() => query.data ?? [], [query.data]);

	return <CompanyTable data={data} isLoading={query.isLoading} />;
}
