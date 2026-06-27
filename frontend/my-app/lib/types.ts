export type ZoneType = "Public" | "Private";

export type HostedZone = {
  id: number;
  name: string;
  type: ZoneType;
  description: string | null;
  created_by: string;
  hosted_zone_id: string;
  created_at: string;
};
