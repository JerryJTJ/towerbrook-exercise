import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
	Avatar,
	Box,
	Chip,
	CircularProgress,
	Divider,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { StyledCustomLinkBlack } from "~/components/CustomLink";
import { getPersonById } from "~/api/people.api";

export const Route = createFileRoute("/people/$peopleId")({
	component: RouteComponent,
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface Person {
	id: number;
	name: string;
	role: string;
	theme: { id: number; name: string };
	company: { id: number; name: string };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DetailRow({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: React.ReactNode;
}) {
	return (
		<Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 1 }}>
			<Box sx={{ color: "text.disabled", display: "flex" }}>{icon}</Box>
			<Typography
				variant="body2"
				color="text.secondary"
				sx={{ width: 72, flexShrink: 0 }}
			>
				{label}
			</Typography>
			<Box sx={{ flex: 1 }}>{value}</Box>
		</Stack>
	);
}

// ─── Main page ────────────────────────────────────────────────────────────────

function PersonPage({ person }: { person: Person }) {
	return (
		<Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, sm: 3 }, py: 4 }}>
			{/* Hero */}
			<Paper
				variant="outlined"
				sx={{
					p: 3,
					mb: 2,
					borderRadius: 3,
					display: "flex",
					alignItems: "flex-start",
					gap: 2,
				}}
			>
				<Avatar
					sx={{
						width: 56,
						height: 56,
						bgcolor: "primary.dark",
						borderRadius: 2,
						flexShrink: 0,
					}}
				>
					<PersonIcon />
				</Avatar>

				<Box sx={{ flex: 1, minWidth: 0 }}>
					<Stack
						direction="row"
						alignItems="center"
						spacing={1}
						flexWrap="wrap"
						mb={0.5}
					>
						<Typography variant="h5" fontWeight={600}>
							{person.name}
						</Typography>
						<Chip
							label={`ID ${person.id}`}
							size="small"
							variant="outlined"
							sx={{ fontSize: 11, height: 20 }}
						/>
					</Stack>

					<Chip
						icon={<WorkIcon />}
						label={person.role}
						size="small"
						color="primary"
						variant="outlined"
						sx={{ textTransform: "capitalize" }}
					/>
				</Box>
			</Paper>

			{/* Details + Theme */}
			<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
				<Box sx={{ flex: "1 1 300px" }}>
					<Paper
						variant="outlined"
						sx={{ p: 2.5, borderRadius: 2, height: "100%" }}
					>
						<Typography
							variant="overline"
							color="text.disabled"
							display="block"
							mb={0.5}
						>
							Details
						</Typography>
						<Divider sx={{ mb: 0.5 }} />
						<DetailRow
							icon={<WorkIcon fontSize="small" />}
							label="Role"
							value={
								<Typography variant="body2" fontWeight={500}>
									{person.role}
								</Typography>
							}
						/>
						<Divider />
						<DetailRow
							icon={<BusinessIcon fontSize="small" />}
							label="Company"
							value={
								<StyledCustomLinkBlack
									to="/company/$companyId"
									params={{
										companyId: String(person.company.id),
									}}
								>
									{person.company.name}
								</StyledCustomLinkBlack>
							}
						/>
					</Paper>
				</Box>

				<Box sx={{ flex: "1 1 300px" }}>
					<Paper
						variant="outlined"
						sx={{
							p: 2.5,
							borderRadius: 2,
							height: "100%",
							bgcolor: "success.50",
							borderColor: "success.200",
						}}
					>
						<Typography
							variant="overline"
							color="success.dark"
							display="block"
							mb={1}
						>
							Investment theme
						</Typography>
						<Stack
							direction="row"
							alignItems="flex-start"
							spacing={1}
						>
							<LocalOfferIcon
								sx={{ color: "success.main", mt: 0.25 }}
								fontSize="small"
							/>
							<Box>
								<Typography
									variant="body1"
									fontWeight={600}
									color="success.dark"
								>
									{person.theme.name}
								</Typography>
								<Typography
									variant="caption"
									color="success.main"
								>
									Theme ID {person.theme.id}
								</Typography>
							</Box>
						</Stack>
					</Paper>
				</Box>
			</Box>
		</Box>
	);
}

// ─── Route component ──────────────────────────────────────────────────────────

function RouteComponent() {
	const { peopleId } = Route.useParams();

	const query = useQuery({
		queryKey: ["people", peopleId],
		queryFn: () => getPersonById(Number(peopleId)),
	});

	if (query.isLoading) {
		return (
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
		);
	}

	if (query.isError) {
		return (
			<Box sx={{ maxWidth: 900, mx: "auto", px: 3, py: 4 }}>
				<Paper
					variant="outlined"
					sx={{ p: 3, borderRadius: 2, borderColor: "error.light" }}
				>
					<Typography color="error" fontWeight={500}>
						Failed to load person
					</Typography>
					<Typography variant="body2" color="text.secondary" mt={0.5}>
						{(query.error as Error)?.message ??
							"An unexpected error occurred."}
					</Typography>
				</Paper>
			</Box>
		);
	}

	if (!query.data) return null;

	return <PersonPage person={query.data} />;
}
