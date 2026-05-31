import { Company } from "~/interfaces/company.interface";

export const mockCompanies: Company[] = [
	{
		id: 1,
		created_at: "2026-05-10T12:00:00Z",
		name: "NovaTech",
		theme_id: 1,
		website: "https://novatech.example.com",
		category: "Technology",
		description: "AI infrastructure and cloud services company.",
		finances: [
			{
				id: 101,
				metric: "revenue",
				value: 12500000,
				source: "2025_report",
			},
			{
				id: 102,
				metric: "EBITDA",
				value: 3200000,
				source: "2025_report",
			},
			{
				id: 103,
				metric: "equity",
				value: 5400000,
				source: "2025_report",
			},
		],
	},
	{
		id: 2,
		created_at: "2026-04-18T09:30:00Z",
		name: "GreenPulse Energy",
		theme_id: 2,
		website: "https://greenpulse.example.com",
		category: "Energy",
		description: "Renewable energy analytics and optimization.",
		finances: [
			{
				id: 201,
				metric: "revenue",
				value: 8400000,
				source: "2025_report",
			},
			{
				id: 202,
				metric: "EBITDA",
				value: 2100000,
				source: "2025_report",
			},
			{
				id: 203,
				metric: "equity",
				value: 3900000,
				source: "2025_report",
			},
		],
	},
	{
		id: 3,
		created_at: "2026-03-22T15:45:00Z",
		name: "Finora Capital",
		theme_id: 3,
		website: "https://finora.example.com",
		category: "Finance",
		description: "Fintech tools for small and mid-sized businesses.",
		finances: [
			{
				id: 301,
				metric: "revenue",
				value: 15800000,
				source: "2025_report",
			},
			{
				id: 302,
				metric: "EBITDA",
				value: 4700000,
				source: "2025_report",
			},
			{
				id: 303,
				metric: "equity",
				value: 9200000,
				source: "2025_report",
			},
		],
	},
	{
		id: 4,
		created_at: "2026-01-12T08:10:00Z",
		name: "Astra Logistics",
		theme_id: 1,
		website: null,
		category: "Logistics",
		description: "AI-driven supply chain optimization platform.",
		finances: [
			{
				id: 401,
				metric: "revenue",
				value: 6200000,
				source: "2025_report",
			},
			{
				id: 402,
				metric: "EBITDA",
				value: 1100000,
				source: "2025_report",
			},
			{
				id: 403,
				metric: "equity",
				value: 2500000,
				source: "2025_report",
			},
		],
	},
];
