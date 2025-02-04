import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ApiError } from "./ApiError";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface HttpClientOptions {
  baseURL?: string;
  headers?: HeadersInit;
  timeout?: number;
  retries?: number;
}

const DEFAULT_TIMEOUT = 1000;
const DEFAULT_RETRIES = 1;

export class HttpClient {
  private baseURL: string;
  private headers: HeadersInit;
  private timeout: number;
  private retries: number;

  constructor(options?: HttpClientOptions) {
    this.baseURL = options?.baseURL || "";
    this.headers = options?.headers || {};
    this.timeout = options?.timeout || DEFAULT_TIMEOUT;
    this.retries = options?.retries || DEFAULT_RETRIES;
  }

  private async request<T>(
    path: string,
    method: HttpMethod,
    body?: unknown,
    customHeaders?: HeadersInit,
  ): Promise<T> {
    const requestUrl = `${this.baseURL}${path}`;
    const headers = {
      ...this.headers,
      ...customHeaders,
    };

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const response = await fetch(requestUrl, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: AbortSignal.timeout(this.timeout),
        });

        if (!response.ok) {
          throw new ApiError({
            message: `Http Error. ${response.statusText}`,
            name: "HttpError",
            status: response.status as ContentfulStatusCode,
            statusText: response.statusText,
          });
        }

        return (await response.json()) as T;
      } catch (err) {
        if (attempt === this.retries) {
          throw err;
        }
        if (err instanceof Error && err.name === "AbortError") {
          // タイムアウトの場合リトライ
          continue;
        }
        if (err instanceof ApiError) {
          // 5xxエラーの場合のみリトライ
          if (err.status < 500) throw err;
        }
      }
    }
    throw new ApiError({
      message: "Unexpected Error.",
      name: "UnexpectedError",
    });
  }
  async get<T>(url: string, customHeaders?: HeadersInit): Promise<T> {
    return this.request<T>(url, "GET", undefined, customHeaders);
  }

  async post<T>(
    url: string,
    body: unknown,
    customHeaders?: HeadersInit,
  ): Promise<T> {
    return this.request<T>(url, "POST", body, customHeaders);
  }
}
