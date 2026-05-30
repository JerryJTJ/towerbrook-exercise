import {
	getCompanyIdByName,
	insertCompanyFinancials,
	updateCompanyDescriptionById,
} from "../tools/supabase.tool.js";
import { tavilyCompanyResearch } from "../tools/tavily.js";

export async function runResearcherAgent(company: string) {
	const id = await getCompanyIdByName(company);

	if (!id) {
		throw new Error("Company not found in database: " + company);
	}

	const result = (await tavilyCompanyResearch(company)) as {
		description: string;
		metrics: { metric: string; value: number | null; source: string }[];
	};

	await updateCompanyDescriptionById(id, result.description);

	if (!result.metrics || result.metrics.length === 0)
		throw new Error("No metrics found for company: " + company);

	await insertCompanyFinancials(
		result.metrics.map((metric) => ({
			company_id: id,
			metric: metric.metric,
			value: metric.value,
			source: metric.source,
		})),
	);
}
