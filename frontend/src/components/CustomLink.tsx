import React from "react";
import { createLink } from "@tanstack/react-router";
import { css, Link, styled } from "@mui/material";
import type { LinkProps } from "@mui/material";
import type { LinkComponent } from "@tanstack/react-router";

interface MUILinkProps extends LinkProps {
	// Add any additional props you want to pass to the Link
}

const MUILinkComponent = React.forwardRef<HTMLAnchorElement, MUILinkProps>(
	(props, ref) => <Link ref={ref} {...props} />,
);

const CreatedLinkComponent = createLink(MUILinkComponent);

export const CustomLink: LinkComponent<typeof MUILinkComponent> = (props) => {
	return <CreatedLinkComponent preload={"intent"} {...props} />;
};

export const StyledCustomLink = styled(CustomLink)(
	({ theme }) => css`
		color: ${theme.palette.common.white};
	`,
);

export const StyledCustomLinkBlack = styled(CustomLink)(
	({ theme }) => css`
		color: ${theme.palette.common.black};

		&:hover {
			color: ${theme.palette.secondary.main}; /* or 'blue' */
		}
	`,
);
