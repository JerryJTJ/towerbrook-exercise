import { createClient } from "@supabase/supabase-js";
import {
	type Database,
	type Tables,
	type TablesInsert,
} from "../interfaces/supabase.js";

const supabase = createClient<Database>(
	process.env.SUPABASE_URL || "",
	process.env.SUPABASE_PUBLISHABLE_KEY || "",
);

//CREATE
export async function insertCompany(company: TablesInsert<"company">) {
	const { data, error } = await supabase
		.from("company")
		.insert(company)
		.select("id")
		.single();

	if (error) {
		console.error("Error inserting company:", error);
	}

	return data ? data.id : null;
}

export async function insertCompanies(companies: TablesInsert<"company">[]) {
	const { error } = await supabase.from("company").insert(companies);

	if (error) {
		console.error("Error inserting company:", error);
	}
}

export async function insertPeople(people: TablesInsert<"people">[]) {
	const { error } = await supabase.from("people").insert(people);

	if (error) {
		console.error("Error inserting people:", error);
	}
}

export async function handleInsertPerson(person: {
	name: string;
	company: string;
	role: string;
	theme_id: number;
}) {
	// make company
	let companyId = await getCompanyIdByName(person.company);

	if (!companyId) {
		const id = await insertCompany({
			name: person.company,
			theme_id: person.theme_id,
		});

		companyId = id;
	}

	await insertPerson({
		name: person.name,
		role: person.role,
		company_id: companyId,
		theme_id: person.theme_id,
	});
}

export async function insertPerson(people: TablesInsert<"people">) {
	const { error } = await supabase.from("people").insert(people);

	if (error) {
		console.error("Error inserting people:", error);
	}
}

//READ
export async function getCompanyById(companyId: number) {
	const { data, error } = await supabase
		.from("company")
		.select()
		.eq("id", companyId);

	return data;
}

export async function getCompanyIdByName(companyName: string) {
	const { data, error } = await supabase
		.from("company")
		.select()
		.eq("name", companyName)
		.single();

	return data ? data.id : null;
}

export async function getPerson(personId: number) {
	const { data, error } = await supabase
		.from("people")
		.select()
		.eq("id", personId);

	return data;
}
