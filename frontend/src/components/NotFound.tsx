import { Link } from "@tanstack/react-router";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Button,
	Stack,
} from "@mui/material";

export function NotFound({ children }: { children?: React.ReactNode }) {
	return (
		<Box
			sx={{
				minHeight: "60vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				p: 2,
			}}
		>
			<Card
				elevation={6}
				sx={{
					maxWidth: 420,
					width: "100%",
					borderRadius: 3,
				}}
			>
				<CardContent>
					<Stack spacing={3} alignItems="center" textAlign="center">
						{/* Title */}
						<Typography variant="h3" fontWeight={700}>
							404
						</Typography>

						{/* Message */}
						<Typography variant="body2" color="text.secondary">
							{children ||
								"The page you’re looking for does not exist."}
						</Typography>

						{/* Actions */}
						<Stack
							direction={{ xs: "column", sm: "row" }}
							spacing={2}
							width="100%"
						>
							<Button
								variant="outlined"
								fullWidth
								onClick={() => window.history.back()}
							>
								Go back
							</Button>

							<Button
								variant="contained"
								fullWidth
								component={Link}
								to="/"
							>
								Start over
							</Button>
						</Stack>
					</Stack>
				</CardContent>
			</Card>
		</Box>
	);
}
