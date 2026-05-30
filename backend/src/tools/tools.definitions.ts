import { Type, type Tool } from "@google/genai";
import { tavilySearch } from "./tavily.js";

// Gemini format for defining tools
export const TOOL_DEFINITIONS: Tool[] = [
	{
		functionDeclarations: [
			{
				name: "tavily_search",
				description:
					"Search the web for current information about a company, person, or topic",
				parameters: {
					type: Type.OBJECT,
					properties: {
						query: {
							type: Type.STRING,
							description: "The search query",
						},
					},
					required: ["query"],
				},
			},
		],
	},
];

export const TOOL_HANDLERS: Record<string, (args: any) => Promise<any>> = {
	tavily_search: async (args: { query: string }) => {
		return await tavilySearch(args.query);
	},
};
