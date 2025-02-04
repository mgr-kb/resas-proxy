export class ApiError extends Error {
	status: number;
	statusText: string;

	constructor({
		message,
		status,
		statusText,
	}: { message: string; status?: number; statusText?: string }) {
		super(message);
		this.status = status || 500;
		this.statusText = statusText || "Internal Server Error";
	}
}
