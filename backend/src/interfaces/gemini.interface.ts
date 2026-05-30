// All schemas needed by gemini

export const scraperSchema = {
	type: "OBJECT",
	properties: {
		people: {
			type: "ARRAY",
			items: {
				type: "OBJECT",
				properties: {
					name: { type: "STRING" },
					company: { type: "STRING" },
					role: { type: "STRING" },
				},
				required: ["name", "company", "role"],
			},
		},
		companies: {
			type: "ARRAY",
			items: {
				type: "OBJECT",
				properties: {
					name: { type: "STRING" },
					category: {
						type: "STRING",
						enum: ["advisory", "services", "fund", "other"],
					},
				},
				required: ["name", "category"],
			},
		},
	},
};
