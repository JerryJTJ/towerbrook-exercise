import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getAllPeople } from "~/api/people.api";
import { PeopleTable } from "~/components/PeopleTable";

export const Route = createFileRoute("/people/")({
	component: RouteComponent,
});

function RouteComponent() {
	const query = useQuery({
		queryKey: ["people"],
		queryFn: getAllPeople,
	});

	const data = useMemo(() => query.data ?? [], [query.data]);

	return <PeopleTable data={data} isLoading={query.isLoading} />;
}
