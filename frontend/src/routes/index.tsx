import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Stack,
	Typography,
	Card,
	CardActionArea,
	CardContent,
	Grid,
} from "@mui/material";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Stack spacing={4} alignItems="center" sx={{ py: 6 }}>
			<Grid container spacing={3} maxWidth="md" alignItems="stretch">
				<Grid size={{ xs: 12, md: 4 }}>
					<Card sx={{ height: "100%" }}>
						<CardActionArea
							component={Link}
							to="/people"
							sx={{ height: "100%" }}
						>
							<CardContent
								sx={{
									height: "100%",
									display: "flex",
									flexDirection: "column",
								}}
							>
								<Typography color="textDisabled">
									TABLE
								</Typography>
								<Typography variant="h5" gutterBottom>
									People
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>

				<Grid size={{ xs: 12, md: 4 }}>
					<Card sx={{ height: "100%" }}>
						<CardActionArea
							component={Link}
							to="/companies"
							sx={{ height: "100%" }}
						>
							<CardContent
								sx={{
									height: "100%",
									display: "flex",
									flexDirection: "column",
								}}
							>
								<Typography color="textDisabled">
									TABLE
								</Typography>
								<Typography variant="h5" gutterBottom>
									Companies
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>

				<Grid size={{ xs: 12, md: 4 }}>
					<Card sx={{ height: "100%" }}>
						<CardActionArea
							component={Link}
							to="/theme/1"
							sx={{ height: "100%" }}
						>
							<CardContent
								sx={{
									height: "100%",
									display: "flex",
									flexDirection: "column",
								}}
							>
								<Typography color="textDisabled">
									THEME
								</Typography>
								<Typography variant="h5" gutterBottom>
									Clean Energy Advisory & Development
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>

				<Grid size={{ xs: 12, md: 4 }}>
					<Card sx={{ height: "100%" }}>
						<CardActionArea
							component={Link}
							to="/theme/2"
							sx={{ height: "100%" }}
						>
							<CardContent
								sx={{
									height: "100%",
									display: "flex",
									flexDirection: "column",
								}}
							>
								<Typography color="textDisabled">
									THEME
								</Typography>
								<Typography variant="h5" gutterBottom>
									Grid Infrastructure & Connection
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>

				<Grid size={{ xs: 12, md: 4 }}>
					<Card sx={{ height: "100%" }}>
						<CardActionArea
							component={Link}
							to="/theme/3"
							sx={{ height: "100%" }}
						>
							<CardContent
								sx={{
									height: "100%",
									display: "flex",
									flexDirection: "column",
								}}
							>
								<Typography color="textDisabled">
									THEME
								</Typography>
								<Typography variant="h5" gutterBottom>
									Smart Water Infrastructure & Analytics
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
			</Grid>
		</Stack>
	);
}
