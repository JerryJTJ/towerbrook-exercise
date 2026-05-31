import { AppBar, Box, Toolbar, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { StyledCustomLink } from "./CustomLink";
import { Link } from "@tanstack/react-router";

export function Header() {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

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

					{/* Themes Dropdown */}
					<Button color="inherit" onClick={handleOpen}>
						Themes
					</Button>

					<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
						<MenuItem
							component={Link}
							to="/theme/1"
							onClick={handleClose}
						>
							Clean Energy Advisory & Development
						</MenuItem>

						<MenuItem
							component={Link}
							to="/theme/2"
							onClick={handleClose}
						>
							Grid Infrastructure & Connection
						</MenuItem>

						<MenuItem
							component={Link}
							to="/theme/3"
							onClick={handleClose}
						>
							Smart Water Infrastructure & Analytics
						</MenuItem>
					</Menu>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
