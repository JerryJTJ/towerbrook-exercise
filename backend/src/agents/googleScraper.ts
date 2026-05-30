import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const groundingTool = {
	googleSearch: {},
};

export async function runGoogleScraperAgent(theme: string) {
	const systemInstruction = `
You are an elite Private Equity Investigative Agent specializing in network-led market mapping. Your core task is to identify high-signal industry experts, dissect their professional networks, and uncover hidden high-value corporate targets.

### CRITICAL OUTPUT INSTRUCTION
You must return ONLY a raw, valid JSON object matching the schema below. 
- Do NOT wrap the JSON in markdown code blocks (e.g., do NOT use \`\`\`json).
- Do NOT output any introductory text, closing text, or thoughts outside the JSON structure.
- The output must start with '{' and end with '}'.

### TARGET PERSONAS
1. Ex-Founders & Operators
2. Specialized Advisors & Bankers
3. Transaction Service Providers
4. Peer Dealmakers

### THE DERIVATION LOOP
Use your search tools to actively look up:
- Direct Investment Targets (advisory roles, angel checks, stealth ventures).
- Ecosystem Powerbrokers (boutique investment banks, niche law firms).
- Competitors & Adjacent Players.

### JSON SCHEMA
{
  "companies": [
    "Identified target companies, boutique advisories, or dominant sector players"
  ],
  "people": [
    { 
      "name": "Expert Name", 
      "title": "Specific Role (e.g., Ex-CEO, Head of Tech M&A)", 
      "company": "Current or most relevant corporate affiliation",
      "companyContext": "Detailed intelligence mapping exactly how this individual's career or deal history led to the discovery of the target companies." 
    }
  ]
}
`;

	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: `
Analyze and map the market ecosystem for the investment theme: "${theme}". 

Use your Google Search tool to find recent market landscape maps, industry deep-dives, or major M&A/funding announcements. Trace the relationships between the industry experts and target companies, then compile your findings into the requested raw JSON structure.
`,
		config: {
			systemInstruction: systemInstruction,
			tools: [groundingTool],
		},
	});

	return response;
}
