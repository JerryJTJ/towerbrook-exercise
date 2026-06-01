import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
	Paper,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import TopicIcon from "@mui/icons-material/Topic";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { StyledCustomLinkBlack } from "~/components/CustomLink";
import {
	deletePeople,
	getCallBriefByPersonId,
	getPersonById,
	updatePeopleSaved,
} from "~/api/people.api";
import { useState } from "react";
import { NotFound } from "~/components/NotFound";

export const Route = createFileRoute("/people/$peopleId")({
	component: RouteComponent,
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface CallPrepOutput {
	backgroundSummary: string;
	contactDetails: {
		email: string;
		phone: string;
		linkedin: string;
		other: string;
	};
	keyTopics: { topic: string; rationale: string }[];
	suggestedQuestions: { question: string; intent: string }[];
	redFlags: { flag: string; detail: string }[];
	recommendedFollowUps: { action: string; reason: string }[];
}

interface Person {
	id: number;
	name: string;
	role: string;
	theme: { id: number; name: string };
	company: { id: number; name: string };
	call_info: CallPrepOutput | null;
	notes?: string;
	starred?: boolean;
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

// ─── Star Toggle ──────────────────────────────────────────────────────────────

function StarToggle({
	personId,
	initialStarred,
}: {
	personId: number;
	initialStarred?: boolean;
}) {
	const [starred, setStarred] = useState(initialStarred ?? false);

	const mutation = useMutation({
		mutationFn: (next: boolean) => updatePeopleSaved(personId, next),
		onMutate: (next) => setStarred(next),
		onError: (_err, next) => setStarred(!next),
	});

	return (
		<Tooltip title={starred ? "Remove from watchlist" : "Add to watchlist"}>
			<IconButton
				size="small"
				onClick={() => mutation.mutate(!starred)}
				disabled={mutation.isPending}
				sx={{ color: starred ? "warning.main" : "action.disabled" }}
			>
				{starred ? (
					<StarIcon fontSize="small" />
				) : (
					<StarBorderIcon fontSize="small" />
				)}
			</IconButton>
		</Tooltip>
	);
}

// ─── Delete Button ────────────────────────────────────────────────────────────

function DeleteButton({ personId }: { personId: number }) {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: () => deletePeople(personId),
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: ["people", personId] });
			navigate({ to: "/" });
		},
	});

	return (
		<>
			<Tooltip title="Delete person">
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
				<DialogTitle>Delete person?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						This will permanently remove this person and all
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

// ─── Notes Section ────────────────────────────────────────────────────────────

function NotesSection({
	personId,
	initialNotes,
}: {
	personId: number;
	initialNotes?: string;
}) {
	const [notes, setNotes] = useState(initialNotes ?? "");
	const [savedNotes, setSavedNotes] = useState(initialNotes ?? "");

	const isDirty = notes !== savedNotes;

	const mutation = useMutation({
		mutationFn: () => updatePersonNotes(personId, notes),
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

// ─── Call Info Section ────────────────────────────────────────────────────────

function CallInfoSection({ callInfo }: { callInfo: CallPrepOutput }) {
	const { contactDetails: c } = callInfo;
	const hasContact = c.email || c.phone || c.linkedin || c.other;

	return (
		<Box mt={3}>
			<Typography
				variant="overline"
				color="text.disabled"
				display="block"
				mb={1}
				px={0.25}
			>
				Call Brief
			</Typography>

			{/* Background */}
			<Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mb: 2 }}>
				<Typography
					variant="body2"
					color="text.secondary"
					lineHeight={1.8}
				>
					{callInfo.backgroundSummary}
				</Typography>
			</Paper>

			{/* Contact + Topics row */}
			<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
				{hasContact && (
					<Paper
						variant="outlined"
						sx={{ p: 2.5, borderRadius: 2, flex: "1 1 200px" }}
					>
						<Typography
							variant="overline"
							color="text.disabled"
							display="block"
							mb={1}
						>
							Contact
						</Typography>
						<Stack spacing={1}>
							{c.email && (
								<Stack
									direction="row"
									spacing={1}
									alignItems="center"
								>
									<EmailIcon
										fontSize="small"
										sx={{ color: "text.disabled" }}
									/>
									<Typography variant="body2">
										{c.email}
									</Typography>
								</Stack>
							)}
							{c.phone && (
								<Stack
									direction="row"
									spacing={1}
									alignItems="center"
								>
									<PhoneIcon
										fontSize="small"
										sx={{ color: "text.disabled" }}
									/>
									<Typography variant="body2">
										{c.phone}
									</Typography>
								</Stack>
							)}
							{c.linkedin && (
								<Stack
									direction="row"
									spacing={1}
									alignItems="center"
								>
									<LinkedInIcon
										fontSize="small"
										sx={{ color: "text.disabled" }}
									/>
									<Typography variant="body2">
										{c.linkedin}
									</Typography>
								</Stack>
							)}
							{c.other && (
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{c.other}
								</Typography>
							)}
						</Stack>
					</Paper>
				)}

				{callInfo.keyTopics.length > 0 && (
					<Paper
						variant="outlined"
						sx={{ p: 2.5, borderRadius: 2, flex: "2 1 300px" }}
					>
						<Typography
							variant="overline"
							color="text.disabled"
							display="block"
							mb={1}
						>
							Key Topics
						</Typography>
						<Stack spacing={1.5}>
							{callInfo.keyTopics.map((t, i) => (
								<Stack
									key={i}
									direction="row"
									spacing={1}
									alignItems="flex-start"
								>
									<TopicIcon
										fontSize="small"
										sx={{
											color: "info.main",
											mt: 0.25,
											flexShrink: 0,
										}}
									/>
									<Box>
										<Typography
											variant="body2"
											fontWeight={600}
										>
											{t.topic}
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											{t.rationale}
										</Typography>
									</Box>
								</Stack>
							))}
						</Stack>
					</Paper>
				)}
			</Box>

			{/* Questions + Red Flags row */}
			<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
				{callInfo.suggestedQuestions.length > 0 && (
					<Paper
						variant="outlined"
						sx={{ p: 2.5, borderRadius: 2, flex: "1 1 300px" }}
					>
						<Typography
							variant="overline"
							color="text.disabled"
							display="block"
							mb={1}
						>
							Suggested Questions
						</Typography>
						<Stack spacing={1.5}>
							{callInfo.suggestedQuestions.map((q, i) => (
								<Stack
									key={i}
									direction="row"
									spacing={1}
									alignItems="flex-start"
								>
									<QuestionAnswerIcon
										fontSize="small"
										sx={{
											color: "primary.main",
											mt: 0.25,
											flexShrink: 0,
										}}
									/>
									<Box>
										<Typography
											variant="body2"
											fontWeight={500}
										>
											{q.question}
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											{q.intent}
										</Typography>
									</Box>
								</Stack>
							))}
						</Stack>
					</Paper>
				)}

				{callInfo.redFlags.length > 0 && (
					<Paper
						variant="outlined"
						sx={{
							p: 2.5,
							borderRadius: 2,
							flex: "1 1 300px",
							borderColor: "warning.200",
							bgcolor: "warning.50",
						}}
					>
						<Typography
							variant="overline"
							color="warning.dark"
							display="block"
							mb={1}
						>
							Red Flags
						</Typography>
						<Stack spacing={1.5}>
							{callInfo.redFlags.map((r, i) => (
								<Stack
									key={i}
									direction="row"
									spacing={1}
									alignItems="flex-start"
								>
									<WarningAmberIcon
										fontSize="small"
										sx={{
											color: "warning.main",
											mt: 0.25,
											flexShrink: 0,
										}}
									/>
									<Box>
										<Typography
											variant="body2"
											fontWeight={500}
											color="warning.dark"
										>
											{r.flag}
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											{r.detail}
										</Typography>
									</Box>
								</Stack>
							))}
						</Stack>
					</Paper>
				)}
			</Box>

			{/* Follow-ups */}
			{callInfo.recommendedFollowUps.length > 0 && (
				<Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
					<Typography
						variant="overline"
						color="text.disabled"
						display="block"
						mb={1}
					>
						Recommended Follow-ups
					</Typography>
					<Stack spacing={1.5}>
						{callInfo.recommendedFollowUps.map((f, i) => (
							<Stack
								key={i}
								direction="row"
								spacing={1}
								alignItems="flex-start"
							>
								<TaskAltIcon
									fontSize="small"
									sx={{
										color: "success.main",
										mt: 0.25,
										flexShrink: 0,
									}}
								/>
								<Box>
									<Typography
										variant="body2"
										fontWeight={500}
									>
										{f.action}
									</Typography>
									<Typography
										variant="caption"
										color="text.secondary"
									>
										{f.reason}
									</Typography>
								</Box>
							</Stack>
						))}
					</Stack>
				</Paper>
			)}
		</Box>
	);
}

// ─── Main page ────────────────────────────────────────────────────────────────

function PersonPage({
	person,
	onRefetch,
}: {
	person: Person;
	onRefetch: () => void;
}) {
	const mutation = useMutation({
		mutationFn: () => getCallBriefByPersonId(person.id),
		onSuccess: onRefetch,
	});

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
					alignItems: "center",
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

						<StarToggle
							personId={person.id}
							initialStarred={person.starred}
						/>

						<DeleteButton personId={person.id} />
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

				<Button
					sx={{ ml: "auto", alignSelf: "center" }}
					variant={person.call_info ? "outlined" : "contained"}
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
						: person.call_info
							? "Regenerate Brief"
							: "Generate Brief"}
				</Button>
			</Paper>

			{/* Details + Theme */}
			<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
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
							</Box>
						</Stack>
					</Paper>
				</Box>
			</Box>

			{/* Notes */}
			<NotesSection personId={person.id} initialNotes={person.notes} />

			{/* Call Brief */}
			{person.call_info && (
				<CallInfoSection callInfo={person.call_info} />
			)}
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

	if (!query.data?.id) {
		return <NotFound />;
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

	return <PersonPage person={query.data} onRefetch={query.refetch} />;
}
