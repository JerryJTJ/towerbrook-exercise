import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Avatar,
	Box,
	Button,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	IconButton,
	Link,
	Paper,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BusinessIcon from "@mui/icons-material/Business";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

import {
	deleteCompany,
	getCompanyById,
	runCompanyFitAgent,
	updateCompanyNotes,
	updateCompanySaved,
} from "~/api/company.api";
import { getAllPeopleByCompanyId } from "~/api/people.api";

import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PeopleTable } from "~/components/PeopleTable";
import { NotFound } from "~/components/NotFound";

// ─── Route ────────────────────────────────────────────────────────────────────

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

interface Concern {
	risk?: string;
	detail?: string;
}

interface Strength {
	point?: string;
	evidence?: string;
}

interface NextAction {
	action?: string;
	reason?: string;
}

interface TowerBrookRelevance {
	theme?: string;
	relevance?: string;
}

interface KeyMetricInterpretation {
	metric?: string;
	interpretation?: string;
}

interface CompanyInfo {
	concerns?: Concern[];
	strengths?: Strength[];
	nextActions?: NextAction[];
	towerBrookRelevance?: TowerBrookRelevance[];
	keyMetricsInterpretation?: KeyMetricInterpretation[];
	fitSummary?: string;
	fitScore?: number;
}

interface Company {
	id: number;
	name: string;
	category: string;
	description?: string;
	website?: string | null;
	score?: number;
	info: CompanyInfo;
	finances?: Finance[];
	notes?: string;
	saved?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const renderIf = (value: any, node: React.ReactNode) =>
	value == null || value === "" ? null : node;

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
	if (value === 0) return "N/A";
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

// ─── Finance Card ─────────────────────────────────────────────────────────────

function FinanceCard({ finance }: { finance: Finance }) {
	const config = METRIC_CONFIG[finance.metric] ?? {
		label: finance.metric,
		icon: <BarChartIcon fontSize="small" />,
		color: "text.secondary",
	};

	const sourceIsUrl = isUrl(finance.source);

	return (
		<Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
			<Stack spacing={1}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
					{config.icon}
					<Typography variant="caption" color="text.secondary">
						{config.label}
					</Typography>
				</Box>

				<Typography variant="h5" fontWeight={600}>
					{formatValue(finance.value)}
				</Typography>

				{sourceIsUrl ? (
					<Link
						href={finance.source}
						target="_blank"
						variant="caption"
					>
						Source <OpenInNewIcon sx={{ fontSize: 11 }} />
					</Link>
				) : (
					<Tooltip title={finance.source}>
						<Typography variant="caption" color="text.disabled">
							Industry estimate{" "}
							<InfoOutlinedIcon sx={{ fontSize: 12 }} />
						</Typography>
					</Tooltip>
				)}
			</Stack>
		</Paper>
	);
}

// ─── Notes Section ────────────────────────────────────────────────────────────

function NotesSection({
	companyId,
	initialNotes,
}: {
	companyId: number;
	initialNotes?: string;
}) {
	const [notes, setNotes] = useState(initialNotes ?? "");
	const [savedNotes, setSavedNotes] = useState(initialNotes ?? "");

	const isDirty = notes !== savedNotes;

	const mutation = useMutation({
		mutationFn: () => updateCompanyNotes(companyId, notes),
		onSuccess: () => setSavedNotes(notes),
	});

	return (
		<Paper variant="outlined" sx={{ p: 2.5, mb: 3 }}>
			<Stack
				direction="row"
				alignItems="center"
				spacing={1}
				sx={{ pb: 2 }}
			>
				<Typography variant="overline" color="text.disabled">
					Notes
				</Typography>
				<Button
					size="small"
					variant={isDirty ? "contained" : "outlined"}
					startIcon={
						mutation.isPending ? (
							<CircularProgress size={13} />
						) : (
							<SaveIcon fontSize="small" />
						)
					}
					onClick={() => mutation.mutate()}
					disabled={mutation.isPending || !isDirty}
					disableElevation
				>
					{mutation.isPending ? "Saving…" : "Save"}
				</Button>
			</Stack>

			<TextField
				multiline
				minRows={3}
				maxRows={12}
				fullWidth
				placeholder="Add internal notes about this company…"
				value={notes}
				onChange={(e) => setNotes(e.target.value)}
				variant="outlined"
				size="small"
				sx={{
					"& .MuiOutlinedInput-root": { fontSize: "0.875rem" },
				}}
			/>

			{mutation.isError && (
				<Typography variant="caption" color="error" mt={0.5}>
					Failed to save — please try again.
				</Typography>
			)}

			{mutation.isSuccess && !isDirty && (
				<Typography variant="caption" color="text.disabled" mt={0.5}>
					Saved
				</Typography>
			)}
		</Paper>
	);
}

// ─── Star Toggle ──────────────────────────────────────────────────────────────

function StarToggle({
	companyId,
	initialStarred,
}: {
	companyId: number;
	initialStarred?: boolean;
}) {
	const [saved, setSaved] = useState(initialStarred ?? false);

	const mutation = useMutation({
		mutationFn: (next: boolean) => updateCompanySaved(companyId, next),
		onMutate: (next) => setSaved(next),
		onError: (_err, next) => setSaved(!next),
	});

	return (
		<Tooltip title={saved ? "Remove from watchlist" : "Add to watchlist"}>
			<IconButton
				size="small"
				onClick={() => mutation.mutate(!saved)}
				disabled={mutation.isPending}
				sx={{ color: saved ? "warning.main" : "action.disabled" }}
			>
				{saved ? (
					<StarIcon fontSize="small" />
				) : (
					<StarBorderIcon fontSize="small" />
				)}
			</IconButton>
		</Tooltip>
	);
}

// ─── Delete Button ────────────────────────────────────────────────────────────

function DeleteButton({ companyId }: { companyId: number }) {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: () => deleteCompany(companyId),
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: ["company", companyId] });
			navigate({ to: "/companies" });
		},
	});

	return (
		<>
			<Tooltip title="Delete company">
				<IconButton
					size="small"
					onClick={() => setOpen(true)}
					sx={{
						color: "action.disabled",
						"&:hover": { color: "error.main" },
					}}
				>
					<DeleteIcon fontSize="small" />
				</IconButton>
			</Tooltip>

			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				maxWidth="xs"
				fullWidth
			>
				<DialogTitle>Delete company?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						This will permanently remove the company and all
						associated data. This action cannot be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setOpen(false)}
						disabled={mutation.isPending}
					>
						Cancel
					</Button>
					<Button
						color="error"
						variant="contained"
						disableElevation
						onClick={() => mutation.mutate()}
						disabled={mutation.isPending}
						startIcon={
							mutation.isPending ? (
								<CircularProgress size={13} color="inherit" />
							) : (
								<DeleteIcon fontSize="small" />
							)
						}
					>
						{mutation.isPending ? "Deleting…" : "Delete"}
					</Button>
				</DialogActions>
				{mutation.isError && (
					<Typography
						variant="caption"
						color="error"
						sx={{ px: 3, pb: 1.5 }}
					>
						Failed to delete — please try again.
					</Typography>
				)}
			</Dialog>
		</>
	);
}

// ─── Company Page ─────────────────────────────────────────────────────────────

function CompanyPage({
	company,
	onRefetch,
}: {
	company: Company;
	onRefetch: () => void;
}) {
	const peopleQuery = useQuery({
		queryKey: ["people", company.id],
		queryFn: () => getAllPeopleByCompanyId(company.id),
	});

	const peopleData = useMemo(
		() => peopleQuery.data ?? [],
		[peopleQuery.data],
	);

	const mutation = useMutation({
		mutationFn: () => runCompanyFitAgent(company.id),
		onSuccess: onRefetch,
	});

	const info = company.info ?? {};

	return (
		<Box sx={{ maxWidth: 950, mx: "auto", px: 3, py: 4 }}>
			{/* HERO */}
			<Paper
				variant="outlined"
				sx={{ p: 3, mb: 2, display: "flex", gap: 2 }}
			>
				<Avatar sx={{ bgcolor: "success.dark" }}>
					<BoltIcon />
				</Avatar>

				<Box flex={1}>
					<Stack
						direction="row"
						spacing={1}
						alignItems="center"
						flexWrap="wrap"
					>
						<Typography variant="h5" fontWeight={600}>
							{company.name}
						</Typography>

						{renderIf(
							company.score,
							<Chip
								label={`${company.score} Score`}
								size="small"
								color="primary"
							/>,
						)}

						<StarToggle
							companyId={company.id}
							initialStarred={company.saved}
						/>

						<DeleteButton companyId={company.id} />
					</Stack>

					<Chip
						icon={<BusinessIcon />}
						label={company.category}
						size="small"
						variant="outlined"
						sx={{ mt: 1, textTransform: "capitalize" }}
					/>
				</Box>

				<Button
					sx={{ ml: "auto", alignSelf: "center" }}
					variant={company.info ? "outlined" : "contained"}
					size="small"
					startIcon={
						mutation.isPending ? (
							<CircularProgress size={14} />
						) : (
							<AutoAwesomeIcon fontSize="small" />
						)
					}
					onClick={() => mutation.mutate()}
					disabled={mutation.isPending}
					disableElevation
				>
					{mutation.isPending
						? "Generating..."
						: company.info
							? "Regenerate"
							: "Research"}
				</Button>
			</Paper>

			{/* OVERVIEW */}
			{(company.description || info.fitSummary) && (
				<Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
					{renderIf(
						company.description,
						<>
							<Typography
								variant="overline"
								color="text.disabled"
							>
								Overview
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								mt={1}
							>
								{company.description}
							</Typography>
						</>,
					)}

					{renderIf(
						info.fitSummary,
						<>
							<Typography
								variant="overline"
								color="text.disabled"
								mt={2}
							>
								Fit Summary
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{info.fitSummary}
							</Typography>
						</>,
					)}
				</Paper>
			)}

			{/* FINANCIALS */}
			{!!company.finances?.length && (
				<>
					<Typography variant="overline" color="text.disabled">
						Financials
					</Typography>

					<Box
						sx={{
							display: "flex",
							gap: 2,
							flexWrap: "wrap",
							mb: 3,
						}}
					>
						{company.finances.map((f) =>
							f ? (
								<Box key={f.id} sx={{ flex: "1 1 180px" }}>
									<FinanceCard finance={f} />
								</Box>
							) : null,
						)}
					</Box>
				</>
			)}

			{/* INVESTMENT ANALYSIS */}
			{(info.concerns?.length || info.strengths?.length) && (
				<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
					{!!info.concerns?.length && (
						<Paper
							variant="outlined"
							sx={{ p: 2, flex: "1 1 300px" }}
						>
							<Typography fontWeight={600} mb={1}>
								Concerns
							</Typography>

							{info.concerns.map((c, i) =>
								c ? (
									<Box key={i} mb={1}>
										{renderIf(
											c.risk,
											<Typography
												fontWeight={600}
												variant="body2"
											>
												{c.risk}
											</Typography>,
										)}
										{renderIf(
											c.detail,
											<Typography variant="caption">
												{c.detail}
											</Typography>,
										)}
									</Box>
								) : null,
							)}
						</Paper>
					)}

					{!!info.strengths?.length && (
						<Paper
							variant="outlined"
							sx={{ p: 2, flex: "1 1 300px" }}
						>
							<Typography fontWeight={600} mb={1}>
								Strengths
							</Typography>

							{info.strengths.map((s, i) =>
								s ? (
									<Box key={i} mb={1}>
										{renderIf(
											s.point,
											<Typography
												fontWeight={600}
												variant="body2"
											>
												{s.point}
											</Typography>,
										)}
										{renderIf(
											s.evidence,
											<Typography variant="caption">
												{s.evidence}
											</Typography>,
										)}
									</Box>
								) : null,
							)}
						</Paper>
					)}
				</Box>
			)}

			{/* METRICS + ACTIONS */}
			<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
				{!!info.keyMetricsInterpretation?.length && (
					<Paper variant="outlined" sx={{ p: 2, flex: "1 1 300px" }}>
						<Typography fontWeight={600} mb={1}>
							Key metrics interpretation
						</Typography>

						{info.keyMetricsInterpretation.map((m, i) =>
							m ? (
								<Box key={i} mb={1}>
									{renderIf(
										m.metric,
										<Typography fontWeight={600}>
											{m.metric}
										</Typography>,
									)}
									{renderIf(
										m.interpretation,
										<Typography variant="caption">
											{m.interpretation}
										</Typography>,
									)}
								</Box>
							) : null,
						)}
					</Paper>
				)}

				{!!info.nextActions?.length && (
					<Paper variant="outlined" sx={{ p: 2, flex: "1 1 300px" }}>
						<Typography fontWeight={600} mb={1}>
							Next actions
						</Typography>

						{info.nextActions.map((a, i) =>
							a ? (
								<Box key={i} mb={1}>
									{renderIf(
										a.action,
										<Typography fontWeight={600}>
											{a.action}
										</Typography>,
									)}
									{renderIf(
										a.reason,
										<Typography variant="caption">
											{a.reason}
										</Typography>,
									)}
								</Box>
							) : null,
						)}
					</Paper>
				)}
			</Box>

			{/* RELEVANCE */}
			{!!info.towerBrookRelevance?.length && (
				<Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
					<Typography fontWeight={600} mb={1}>
						Strategic relevance
					</Typography>

					{info.towerBrookRelevance.map((t, i) =>
						t ? (
							<Box key={i} mb={1}>
								{renderIf(
									t.theme,
									<Typography fontWeight={600}>
										{t.theme}
									</Typography>,
								)}
								{renderIf(
									t.relevance,
									<Typography variant="caption">
										{t.relevance}
									</Typography>,
								)}
							</Box>
						) : null,
					)}
				</Paper>
			)}

			{/* NOTES */}
			<NotesSection companyId={company.id} initialNotes={company.notes} />

			{/* WEBSITE */}
			{company.website && (
				<Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
					<Typography fontWeight={600}>Website</Typography>

					<Link href={company.website} target="_blank">
						{company.website}
					</Link>
				</Paper>
			)}

			{/* PEOPLE */}
			<Typography variant="overline" color="text.disabled">
				People
			</Typography>

			<PeopleTable data={peopleData} isLoading={peopleQuery.isLoading} />
		</Box>
	);
}

// ─── Route Component ──────────────────────────────────────────────────────────

function RouteComponent() {
	const { companyId } = Route.useParams();

	const company = useQuery({
		queryKey: ["company", companyId],
		queryFn: () => getCompanyById(Number(companyId)),
	});

	if (company.isLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (!company.data?.id) {
		return <NotFound />;
	}

	if (company.isError) {
		return (
			<Paper sx={{ p: 3, m: 3 }} variant="outlined">
				<Typography color="error">Failed to load company</Typography>
				<Typography variant="caption">
					{(company.error as Error)?.message}
				</Typography>
			</Paper>
		);
	}

	if (!company.data) return null;

	return <CompanyPage company={company.data} onRefetch={company.refetch} />;
}

export default RouteComponent;
