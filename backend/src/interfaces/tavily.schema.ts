export const scraperSchema = {
	properties: {
		people: {
			type: "array",
			description: "List of people extracted from the source data",
			items: {
				type: "object",
				properties: {
					name: {
						type: "string",
						description: "Person's first and last name",
					},
					company: {
						type: "string",
						description: "Company the person is associated with",
					},
					role: {
						type: "string",
						description: "Person's role or title in 3 words max",
					},
				},
				required: ["name", "company", "role"],
			},
		},
		companies: {
			type: "array",
			description: "List of companies extracted from the source data",
			items: {
				type: "object",
				properties: {
					name: {
						type: "string",
						description: "Company name",
					},
					category: {
						type: "string",
						description: "Company category",
						enum: ["advisory", "services", "fund", "other"],
					},
				},
				required: ["name", "category"],
			},
		},
	},
	required: ["people", "companies"],
};

export const researcherSchema = {
	properties: {
		description: {
			type: "string",
			description: "Brief description of the company and its business",
		},
		metrics: {
			type: "array",
			description: "Financial metrics for the company",
			items: {
				type: "object",
				properties: {
					metric: {
						type: "string",
						enum: ["revenue", "EBITDA", "equity"],
						description: "Type of financial metric",
					},
					value: {
						type: "number",
						description:
							"Numeric value of the metric in the reported currency",
					},
					source: {
						type: "string",
						description:
							"Source used to obtain the metric (annual report, filing, etc.)",
					},
				},
				required: ["metric", "value", "source"],
			},
		},
	},
	required: ["description", "metrics"],
};
