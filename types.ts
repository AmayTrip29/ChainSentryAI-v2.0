
export type Page = 'dashboard' | 'new-audit' | 'audit-detail' | 'projects' | 'settings';

export enum Severity {
  Critical = 'Critical',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
  Informational = 'Informational',
}

export interface Finding {
  id: string;
  type: string;
  severity: Severity;
  cvss: string;
  confidence: 'High' | 'Medium' | 'Low';
  file_path: string;
  start_line: number;
  end_line: number;
  description: string;
  ai_explanation: string;
  vulnerable_code: string;
  ai_patch_diff: string;
  swc_id?: string;
  trace_data?: { name: string; source: number; sink: number }[];
}

export interface AuditFile {
  id: string;
  path: string;
  sha256: string;
  language: 'Solidity' | 'Rust';
  findings_count: number;
}

export interface Audit {
  id: string;
  repo_url?: string;
  chain: 'Ethereum' | 'Solana';
  status: 'Completed' | 'In Progress' | 'Failed';
  started_at: string;
  finished_at: string;
  commit_sha?: string;
  summary: {
    [key in Severity]: number;
  };
  files: AuditFile[];
  findings: Finding[];
}
