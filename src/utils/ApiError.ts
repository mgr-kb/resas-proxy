export class ApiError extends Error {
	name: string;
	status: number;
	statusText: string;

	constructor({
		message,
		name,
		status,
		statusText,
	}: { message: string; name?: string; status?: number; statusText?: string }) {
		super(message);
		this.name = name || "ApiError";
		this.status = status || 500;
		this.statusText = statusText || "Internal Server Error";
	}
}
