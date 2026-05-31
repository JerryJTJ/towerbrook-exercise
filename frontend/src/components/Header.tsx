import { AppBar, Box, Toolbar, css, styled } from "@mui/material";
import { CustomLink, StyledCustomLink } from "./CustomLink";

export function Header() {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar sx={{ gap: 2 }}>
					<StyledCustomLink
						to="/"
						style={{
							fontFamily:
								"Georgia, 'Times New Roman', Times, serif",
							fontWeight: 600,
						}}
					>
						TB People Engine
					</StyledCustomLink>
					<StyledCustomLink to="/people">People</StyledCustomLink>
					<StyledCustomLink to="/companies">
						Companies
					</StyledCustomLink>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
