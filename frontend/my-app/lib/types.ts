export type ZoneType = "Public" | "Private";

export type RecordType = "A" | "CNAME" | "MX" | "TXT" | "NS" | "SOA";

export type HostedZone = {
  id: number;
  name: string;
  type: ZoneType;
  description: string | null;
  created_by: string;
  hosted_zone_id: string;
  created_at: string;
};

export type DNSRecord = {
  id: number;
  hosted_zone_id: number;
  name: string;
  type: RecordType;
  value: string;
  ttl: number;
  created_at: string;
  updated_at: string;
};
