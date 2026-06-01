import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useMemo, useState, useEffect } from "react";
import {
	Box,
	Typography,
	Button,
	Tabs,
	Tab,
	CircularProgress,
} from "@mui/material";

import { getAllCompanies } from "~/api/company.api";
import { getAllPeople } from "~/api/people.api";
import { CompanyTable } from "~/components/CompanyTable";
import { PeopleTable } from "~/components/PeopleTable";
import { runThemeScraper } from "~/api/agent.api";

export const Route = createFileRoute("/theme/$themeId")({
	component: RouteComponent,
});

export const Theme = [
	"Clean Energy Advisory & Development",
	"Grid Infrastructure & Connection",
	"Smart Water Infrastructure & Analytics",
];

function RouteComponent() {
	const { themeId } = Route.useParams();
	const themeIdNum = Number(themeId);

	const [tab, setTab] = useState<"people" | "companies">("people");
	const [switching, setSwitching] = useState(false);

	const companiesQuery = useQuery({
		queryKey: ["companies"],
		queryFn: getAllCompanies,
	});

	const peopleQuery = useQuery({
		queryKey: ["people"],
		queryFn: getAllPeople,
	});

	const scrapeMutation = useMutation({
		mutationFn: runThemeScraper,
	});

	// 👉 smooth tab switching
	useEffect(() => {
		setSwitching(true);

		const t = setTimeout(() => {
			setSwitching(false);
		}, 120); // small delay removes “jerk”

		return () => clearTimeout(t);
	}, [tab]);

	const filteredCompanies = useMemo(() => {
		return (companiesQuery.data ?? []).filter(
			(c) => c.theme?.id === themeIdNum,
		);
	}, [companiesQuery.data, themeIdNum]);

	const filteredPeople = useMemo(() => {
		return (peopleQuery.data ?? []).filter(
			(p) => p.theme?.id === themeIdNum,
		);
	}, [peopleQuery.data, themeIdNum]);

	const themeName =
		companiesQuery.data?.find((c) => c.theme?.id === themeIdNum)?.theme
			?.name ?? Theme[themeIdNum - 1];

	if (!themeName) {
		return <Typography>Theme not found</Typography>;
	}

	const isLoading =
		tab === "people" ? peopleQuery.isLoading : companiesQuery.isLoading;

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 3,
				width: "100%",
			}}
		>
			{/* Header */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Typography variant="h4">{themeName}</Typography>

				<Button
					variant="contained"
					onClick={() => scrapeMutation.mutate(themeIdNum)}
					disabled={scrapeMutation.isPending}
					startIcon={
						scrapeMutation.isPending ? (
							<CircularProgress size={14} />
						) : (
							<AutoAwesomeIcon fontSize="small" />
						)
					}
				>
					{scrapeMutation.isPending
						? "Researching..."
						: "Research theme more"}
				</Button>
			</Box>

			{/* Tabs */}
			<Tabs value={tab} onChange={(_, v) => setTab(v)}>
				<Tab label="People" value="people" />
				<Tab label="Companies" value="companies" />
			</Tabs>

			{/* Content */}
			<Box sx={{ position: "relative", minHeight: 200 }}>
				{isLoading || switching ? (
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							minHeight: 300,
						}}
					>
						<CircularProgress />
					</Box>
				) : (
					<>
						{tab === "people" && (
							<PeopleTable
								data={filteredPeople}
								isLoading={peopleQuery.isLoading}
							/>
						)}

						{tab === "companies" && (
							<CompanyTable
								data={filteredCompanies}
								isLoading={companiesQuery.isLoading}
							/>
						)}
					</>
				)}
			</Box>
		</Box>
	);
}
