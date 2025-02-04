import { ApiError } from "./ApiError";

describe("ApiError", () => {
	it("status, statusTextが設定される", () => {
		const error = new ApiError({
			message: "Error",
			name: "SampleError",
			status: 404,
			statusText: "Not Found",
		});
		expect(error.name).toBe("SampleError");
		expect(error.status).toBe(404);
		expect(error.statusText).toBe("Not Found");
	});

	it("name, status, statusTextがデフォルト値で設定される", () => {
		const error = new ApiError({ message: "Error" });
		expect(error.name).toBe("ApiError");
		expect(error.status).toBe(500);
		expect(error.statusText).toBe("Internal Server Error");
	});
});
