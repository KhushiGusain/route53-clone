import type { DNSRecord, RecordType } from "./types";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type CreateDnsRecordPayload = {
  name: string;
  type: RecordType;
  value: string;
  ttl: number;
};

export type UpdateDnsRecordPayload = {
  value?: string;
  ttl?: number;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown) {
    super("API request failed");
    this.status = status;
    this.data = data;
  }
}

async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`${baseURL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data;
}

const api = {
  post(path: string, body: unknown) {
    return request(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  put(path: string, body: unknown) {
    return request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },
  delete(path: string) {
    return request(path, {
      method: "DELETE",
    });
  },
  createDnsRecord(hostedZoneId: number, payload: CreateDnsRecordPayload) {
    return request(`/hosted-zones/${hostedZoneId}/records`, {
      method: "POST",
      body: JSON.stringify(payload),
    }) as Promise<DNSRecord>;
  },
  updateDnsRecord(
    hostedZoneId: number,
    recordId: number,
    payload: UpdateDnsRecordPayload
  ) {
    return request(`/hosted-zones/${hostedZoneId}/records/${recordId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }) as Promise<DNSRecord>;
  },
  deleteDnsRecord(hostedZoneId: number, recordId: number) {
    return request(`/hosted-zones/${hostedZoneId}/records/${recordId}`, {
      method: "DELETE",
    });
  },
};

export default api;
