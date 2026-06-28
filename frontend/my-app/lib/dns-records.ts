import type { DNSRecord } from "./types";

export function getSidebarRecord(
  records: DNSRecord[],
  selectedRecordIds: number[]
): DNSRecord | null {
  if (selectedRecordIds.length !== 1) {
    return null;
  }

  return records.find((record) => record.id === selectedRecordIds[0]) ?? null;
}

export function canDeleteSelectedRecords(
  records: DNSRecord[],
  selectedRecordIds: number[]
): boolean {
  if (selectedRecordIds.length === 0) {
    return false;
  }

  const selectedRecords = records.filter((record) =>
    selectedRecordIds.includes(record.id)
  );

  if (selectedRecords.length !== selectedRecordIds.length) {
    return false;
  }

  return selectedRecords.every(
    (record) => record.type !== "NS" && record.type !== "SOA"
  );
}

export function getSelectedRecords(
  records: DNSRecord[],
  selectedRecordIds: number[]
): DNSRecord[] {
  return records.filter((record) => selectedRecordIds.includes(record.id));
}

export function hasSystemGeneratedSelectedRecords(
  records: DNSRecord[],
  selectedRecordIds: number[]
): boolean {
  if (selectedRecordIds.length === 0) {
    return false;
  }

  return getSelectedRecords(records, selectedRecordIds).some(
    (record) => record.type === "NS" || record.type === "SOA"
  );
}
