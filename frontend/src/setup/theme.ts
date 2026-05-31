import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
	palette: {
		mode: "light",

		primary: {
			main: "#0B1F3A",
			light: "#163A63",
			dark: "#061224",
			contrastText: "#FFFFFF",
		},

		secondary: {
			main: "#6B7C93", // muted steel gray-blue
		},

		success: {
			main: "#2E7D5B",
		},

		error: {
			main: "#B94A4A",
		},

		warning: {
			main: "#B38B3D",
		},

		background: {
			default: "#F6F1E6", // cream paper background
			paper: "#FFFFFF", // clean cards / tables
		},

		text: {
			primary: "#1A2230",
			secondary: "#5A667A",
		},

		divider: "rgba(0,0,0,0.08)",
	},

	typography: {
		fontFamily: "'Roboto Variable', sans-serif",

		h1: { fontWeight: 700, letterSpacing: "-0.02em" },
		h2: { fontWeight: 700 },
		h3: { fontWeight: 600 },
		h4: { fontWeight: 600 },

		body1: {
			fontSize: 14,
			lineHeight: 1.6,
		},

		button: {
			textTransform: "none",
			fontWeight: 600,
		},
	},

	shape: {
		borderRadius: 10,
	},

	components: {
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: "#0B1F3A", // strong PE navy
					color: "#FFFFFF",
					boxShadow: "0 1px 0 rgba(0,0,0,0.15)",
				},
			},
		},

		MuiCard: {
			styleOverrides: {
				root: {
					backgroundColor: "#FFFFFF",
					border: "1px solid rgba(0,0,0,0.06)",
					boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
				},
			},
		},

		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					textTransform: "none",
					fontWeight: 600,
				},
			},
		},

		MuiTableCell: {
			styleOverrides: {
				root: {
					borderColor: "rgba(0,0,0,0.08)",
				},
			},
		},

		MuiCssBaseline: {
			styleOverrides: {
				body: {
					backgroundColor: "#F6F1E6", // enforce cream globally
				},
			},
		},
		MuiLink: {
			styleOverrides: {
				root: {
					color: "#163A63",
					textDecoration: "none",
					fontWeight: 500,
					transition: "all 0.2s ease",

					"&:hover": {
						textShadow: "0 0 8px rgba(255, 255, 255, 0.9)",
					},
				},
			},
		},
	},
});
