import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Box,
	Typography,
	Card,
	CardActionArea,
	CardContent,
} from "@mui/material";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function DashboardCard({
	to,
	label,
	title,
}: {
	to: string;
	label: string;
	title: string;
}) {
	return (
		<Card sx={{ height: "100%" }}>
			<CardActionArea
				component={Link}
				to={to}
				sx={{
					height: "100%",
				}}
			>
				<CardContent
					sx={{
						height: "100%",
						display: "flex",
						flexDirection: "column",
						p: 4,
					}}
				>
					<Typography color="textDisabled">{label}</Typography>

					<Typography variant="h5" sx={{ mt: 1 }}>
						{title}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}

function RouteComponent() {
	return (
		<Box
			sx={{
				height: "80vh",
				p: 3,
				display: "grid",
				gap: 3,
				gridTemplateColumns: {
					xs: "1fr",
					md: "repeat(3, 1fr)",
				},
				gridTemplateRows: {
					xs: "auto",
					md: "repeat(2, 1fr)",
				},
			}}
		>
			<DashboardCard to="/people" label="TABLE" title="People" />

			<DashboardCard to="/companies" label="TABLE" title="Companies" />

			<DashboardCard to="/saved" label="PAGE" title="Saved" />

			<DashboardCard
				to="/theme/1"
				label="THEME"
				title="Clean Energy Advisory & Development"
			/>

			<DashboardCard
				to="/theme/2"
				label="THEME"
				title="Grid Infrastructure & Connection"
			/>

			<DashboardCard
				to="/theme/3"
				label="THEME"
				title="Smart Water Infrastructure & Analytics"
			/>
		</Box>
	);
}
