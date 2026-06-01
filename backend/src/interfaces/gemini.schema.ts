export const scraperSchema = {
	type: "object",
	description: "Scraped theme data containing people and companies",
	required: ["people", "companies"],
	properties: {
		people: {
			type: "array",
			description: "List of people extracted from the source data",
			items: {
				type: "object",
				description: "A person entry",
				required: ["name", "company", "role"],
				properties: {
					name: {
						type: "string",
						description: "Full name of the person",
					},
					company: {
						type: "string",
						description: "Company the person is associated with",
					},
					role: {
						type: "string",
						description: "Role or job title",
					},
				},
			},
		},
		companies: {
			type: "array",
			description: "List of companies extracted from the source data",
			items: {
				type: "object",
				description: "A company entry",
				required: ["name", "category"],
				properties: {
					name: {
						type: "string",
						description: "Company name",
					},
					category: {
						type: "string",
						description: "Company classification",
						enum: ["advisory", "services", "fund", "other"],
					},
				},
			},
		},
	},
};
