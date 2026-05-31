import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
	Avatar,
	Box,
	Chip,
	CircularProgress,
	Divider,
	Link,
	Paper,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import BusinessIcon from "@mui/icons-material/Business";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { getCompanyById } from "~/api/company.api";
import { getAllPeopleByCompanyId } from "~/api/people.api";
import { useMemo } from "react";
import { PeopleTable } from "~/components/PeopleTable";

export const Route = createFileRoute("/company/$companyId")({
	component: RouteComponent,
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface Finance {
	id: number;
	value: number;
	metric: string;
	source: string;
}

interface Theme {
	id: number;
	name: string;
}

interface Company {
	id: number;
	name: string;
	category: string;
	description: string;
	website: string | null;
	theme: Theme;
	finances: Finance[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const METRIC_CONFIG: Record<
	string,
	{ label: string; icon: React.ReactNode; color: string }
> = {
	revenue: {
		label: "Revenue",
		icon: <TrendingUpIcon fontSize="small" />,
		color: "success.main",
	},
	EBITDA: {
		label: "EBITDA",
		icon: <BarChartIcon fontSize="small" />,
		color: "info.main",
	},
	equity: {
		label: "Equity",
		icon: <AccountBalanceIcon fontSize="small" />,
		color: "warning.main",
	},
};

function formatValue(value: number): string {
	if (value >= 1_000_000_000)
		return `$${(value / 1_000_000_000).toFixed(1)}B`;
	if (value >= 1_000_000) return `$${Math.round(value / 1_000_000)}M`;
	if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
	return `$${value}`;
}

function isUrl(str: string): boolean {
	try {
		new URL(str);
		return true;
	} catch {
		return false;
	}
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FinanceCard({ finance }: { finance: Finance }) {
	const config = METRIC_CONFIG[finance.metric] ?? {
		label: finance.metric,
		icon: <BarChartIcon fontSize="small" />,
		color: "text.secondary",
	};

	const sourceIsUrl = isUrl(finance.source);

	return (
		<Paper
			variant="outlined"
			sx={{ p: 2, height: "100%", borderRadius: 2 }}
		>
			<Stack spacing={1}>
				<Box
					sx={{
						color: config.color,
						display: "flex",
						alignItems: "center",
						gap: 0.5,
					}}
				>
					{config.icon}
					<Typography
						variant="caption"
						color="text.secondary"
						fontWeight={500}
					>
						{config.label}
					</Typography>
				</Box>
				<Typography variant="h5" fontWeight={600}>
					{formatValue(finance.value)}
				</Typography>
				<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
					{sourceIsUrl ? (
						<Link
							href={finance.source}
							target="_blank"
							rel="noopener noreferrer"
							variant="caption"
							color="text.disabled"
							underline="hover"
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.25,
							}}
						>
							Source <OpenInNewIcon sx={{ fontSize: 11 }} />
						</Link>
					) : (
						<Tooltip
							title={finance.source}
							placement="bottom-start"
						>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 0.25,
									cursor: "default",
								}}
							>
								<Typography
									variant="caption"
									color="text.disabled"
								>
									Industry estimate
								</Typography>
								<InfoOutlinedIcon
									sx={{
										fontSize: 12,
										color: "text.disabled",
									}}
								/>
							</Box>
						</Tooltip>
					)}
				</Box>
			</Stack>
		</Paper>
	);
}

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

function CompanyPage({ company }: { company: Company }) {
	// People at company
	const peopleQuery = useQuery({
		queryKey: ["people", "company", company.id],
		queryFn: () => getAllPeopleByCompanyId(company.id),
	});

	const peopleData = useMemo(
		() => peopleQuery.data ?? [],
		[peopleQuery.data],
	);

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
						bgcolor: "success.dark",
						borderRadius: 2,
						flexShrink: 0,
					}}
				>
					<BoltIcon />
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
							{company.name}
						</Typography>
						<Chip
							label={`ID ${company.id}`}
							size="small"
							variant="outlined"
							sx={{ fontSize: 11, height: 20 }}
						/>
					</Stack>

					<Stack
						direction="row"
						spacing={1}
						alignItems="center"
						flexWrap="wrap"
					>
						<Chip
							icon={<BusinessIcon />}
							label={company.category}
							size="small"
							color="success"
							variant="outlined"
							sx={{ textTransform: "capitalize" }}
						/>
						{/* <Stack
							direction="row"
							alignItems="center"
							spacing={0.5}
						>
							<PlaceIcon
								sx={{ fontSize: 14, color: "text.disabled" }}
							/>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Cheyenne, Wyoming, USA
							</Typography>
						</Stack> */}
					</Stack>
				</Box>
			</Paper>

			{/* About */}
			<Paper variant="outlined" sx={{ p: 2.5, mb: 2, borderRadius: 2 }}>
				<Typography
					variant="overline"
					color="text.disabled"
					display="block"
					mb={1}
				>
					About
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					lineHeight={1.8}
				>
					{company.description}
				</Typography>
			</Paper>

			{/* Financials */}
			<Typography
				variant="overline"
				color="text.disabled"
				display="block"
				mb={1}
				px={0.25}
			>
				Financial overview
			</Typography>
			<Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
				{company.finances.map((f) => (
					<Box key={f.id} sx={{ flex: "1 1 180px" }}>
						<FinanceCard finance={f} />
					</Box>
				))}
			</Box>

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
							Company details
						</Typography>
						<Divider sx={{ mb: 0.5 }} />
						{/* <DetailRow
							icon={<BusinessIcon fontSize="small" />}
							label="Type"
							value={
								<Typography variant="body2" fontWeight={500}>
									Private
								</Typography>
							}
						/> */}
						{/* <Divider />
						<DetailRow
							icon={<PlaceIcon fontSize="small" />}
							label="HQ"
							value={
								<Typography variant="body2" fontWeight={500}>
									Cheyenne, WY
								</Typography>
							}
						/>
						<Divider /> */}
						<DetailRow
							icon={<LanguageIcon fontSize="small" />}
							label="Website"
							value={
								company.website ? (
									<Link
										href={company.website}
										target="_blank"
										rel="noopener noreferrer"
										variant="body2"
									>
										{company.website}
									</Link>
								) : (
									<Typography
										variant="body2"
										color="text.disabled"
									>
										Not listed
									</Typography>
								)
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
									{company.theme.name}
								</Typography>
								<Typography
									variant="caption"
									color="success.main"
								>
									Theme ID {company.theme.id}
								</Typography>
							</Box>
						</Stack>
					</Paper>
				</Box>
			</Box>
			{/* People */}
			<Typography
				variant="overline"
				color="text.disabled"
				display="block"
				mt={4}
				mb={1}
				px={0.25}
			>
				People
			</Typography>
			<PeopleTable data={peopleData} isLoading={peopleQuery.isLoading} />
		</Box>
	);
}

// ─── Route component ──────────────────────────────────────────────────────────

function RouteComponent() {
	const { companyId } = Route.useParams();

	const company = useQuery({
		queryKey: ["company", companyId],
		queryFn: () => getCompanyById(Number(companyId)),
	});

	if (company.isLoading) {
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

	if (company.isError) {
		return (
			<Box sx={{ maxWidth: 900, mx: "auto", px: 3, py: 4 }}>
				<Paper
					variant="outlined"
					sx={{ p: 3, borderRadius: 2, borderColor: "error.light" }}
				>
					<Typography color="error" fontWeight={500}>
						Failed to load company
					</Typography>
					<Typography variant="body2" color="text.secondary" mt={0.5}>
						{(company.error as Error)?.message ??
							"An unexpected error occurred."}
					</Typography>
				</Paper>
			</Box>
		);
	}

	if (!company) return null;

	return <CompanyPage company={company.data} />;
}
