import { describe, expect, it, vi, type Mock } from "vitest";

vi.mock("./axiosClient", () => ({
	axiosClient: {
		get: vi.fn(),
		post: vi.fn(),
		delete: vi.fn(),
	},
}));

import {
	getAllPeople,
	getAllPeopleByCompanyId,
	getCallBriefByPersonId,
	updatePeopleNotes,
	updatePeopleSaved,
} from "./people.api";
import { axiosClient } from "./axiosClient";

describe("people.api", () => {
	it("returns an empty list when getAllPeople fails", async () => {
		(axiosClient.get as Mock).mockRejectedValue(new Error("fail"));

		const result = await getAllPeople();

		expect(result).toEqual([]);
		expect(axiosClient.get).toHaveBeenCalledWith("/db/people");
	});

	it("calls company-specific people endpoint correctly", async () => {
		(axiosClient.get as Mock).mockResolvedValue({ data: [{ id: 10 }] });

		const result = await getAllPeopleByCompanyId(8);

		expect(result).toEqual([{ id: 10 }]);
		expect(axiosClient.get).toHaveBeenCalledWith("/db/people/company/8");
	});

	it("returns call brief data from agents endpoint", async () => {
		(axiosClient.get as Mock).mockResolvedValue({ data: { brief: "ok" } });

		const result = await getCallBriefByPersonId(9);

		expect(result).toEqual({ brief: "ok" });
		expect(axiosClient.get).toHaveBeenCalledWith(
			"/api/agents/callprep/person/9",
		);
	});

	it("throws when updatePeopleSaved fails", async () => {
		(axiosClient.post as Mock).mockRejectedValue(new Error("server error"));

		await expect(updatePeopleSaved(7, false)).rejects.toThrow(
			"server error",
		);
		expect(axiosClient.post).toHaveBeenCalledWith("/db/people/7/saved", {
			saved: false,
		});
	});

	it("posts notes successfully", async () => {
		(axiosClient.post as Mock).mockResolvedValue({
			data: { success: true },
		});

		const result = await updatePeopleNotes(11, "hello");

		expect(result).toEqual({ success: true });
		expect(axiosClient.post).toHaveBeenCalledWith("/db/people/11/notes", {
			notes: "hello",
		});
	});
});
