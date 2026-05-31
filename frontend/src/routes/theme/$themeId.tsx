import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/theme/$themeId")({
	component: RouteComponent,
});

export const Theme = [
	"Clean Energy Advisory & Development",
	"Grid Infrastructure & Connection",
	"Smart Water Infrastructure & Analytics",
];

function RouteComponent() {
	const { themeId } = Route.useParams();
	return <div>{Theme[Number(themeId) - 1]}</div>;
}
