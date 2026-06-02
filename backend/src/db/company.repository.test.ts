import { describe, it, expect, vi, beforeEach } from "vitest";

let companyRepository: any;
var mockQuery: any;
var mockFromFn: any;

vi.mock("../index.js", () => {
	mockQuery = {
		select: vi.fn().mockReturnThis(),
		eq: vi.fn().mockReturnThis(),
		single: vi.fn(),
		update: vi.fn().mockReturnThis(),
		insert: vi.fn().mockReturnThis(),
		delete: vi.fn().mockReturnThis(),
		then(onFulfilled: (value: unknown) => unknown) {
			return Promise.resolve(onFulfilled({ data: [], error: null }));
		},
	};

	mockFromFn = vi.fn(() => mockQuery);

	return {
		supabase: {
			from: mockFromFn,
		},
	};
});

beforeEach(async () => {
	const module = await import("./company.repository");
	companyRepository = module.companyRepository;

	vi.clearAllMocks();
	mockQuery.select = vi.fn().mockReturnThis();
	mockQuery.eq = vi.fn().mockReturnThis();
	mockQuery.single = vi.fn().mockResolvedValue({ data: [], error: null });
});

describe("companyRepository", () => {
	it("returns an empty list when getAllCompanies has no data", async () => {
		mockQuery.single.mockResolvedValueOnce({ data: [], error: null });
		const result = await companyRepository.getAllCompanies();
		expect(result).toEqual([]);
		expect(mockFromFn).toHaveBeenCalledWith("company");
		expect(mockQuery.select).toHaveBeenCalled();
	});

	it("returns a single company for getCompanyById", async () => {
		const mockCompany = { id: 42, name: "Test Co" };
		mockQuery.single.mockResolvedValueOnce({
			data: mockCompany,
			error: null,
		});

		const result = await companyRepository.getCompanyById(42);

		expect(result).toEqual(mockCompany);
		expect(mockQuery.eq).toHaveBeenCalledWith("id", 42);
		expect(mockQuery.single).toHaveBeenCalled();
	});

	it("throws when getCompanyById encounters an error", async () => {
		mockQuery.single.mockResolvedValueOnce({
			data: null,
			error: { message: "failure" },
		});

		await expect(companyRepository.getCompanyById(123)).rejects.toEqual({
			message: "failure",
		});
	});
});
