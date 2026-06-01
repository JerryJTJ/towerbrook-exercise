import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { getAllCompanies } from "~/api/company.api";
import { getAllPeople } from "~/api/people.api";
import { CompanyTable } from "~/components/CompanyTable";
import { PeopleTable } from "~/components/PeopleTable";

export const Route = createFileRoute("/saved")({
	component: RouteComponent,
});

function RouteComponent() {
	const [tab, setTab] = useState<"people" | "companies">("people");

	const companiesQuery = useQuery({
		queryKey: ["companies"],
		queryFn: getAllCompanies,
	});

	const peopleQuery = useQuery({
		queryKey: ["people"],
		queryFn: getAllPeople,
	});

	const savedCompanies = useMemo(
		() => (companiesQuery.data ?? []).filter((c) => c.saved),
		[companiesQuery.data],
	);

	const savedPeople = useMemo(
		() => (peopleQuery.data ?? []).filter((p) => p.saved),
		[peopleQuery.data],
	);

	return (
		<Box sx={{ width: "100%" }}>
			<Tabs
				value={tab}
				onChange={(_, newValue) => setTab(newValue)}
				sx={{ mb: 2 }}
			>
				<Tab label="People" value="people" />
				<Tab label="Companies" value="companies" />
			</Tabs>

			<Box>
				{tab === "people" && (
					<PeopleTable
						data={savedPeople}
						isLoading={peopleQuery.isLoading}
					/>
				)}

				{tab === "companies" && (
					<CompanyTable
						data={savedCompanies}
						isLoading={companiesQuery.isLoading}
					/>
				)}
			</Box>
		</Box>
	);
}
