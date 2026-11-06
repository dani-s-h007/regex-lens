export interface RegexExplanation {
  token: string;
  description: string;
}

export interface RedosIssue {
  hunk: string;
  rule: string;
  severity: string;
  recommendation: string;
}

export interface RedosReport {
  isVulnerable: boolean;
  issues: RedosIssue[];
}

export declare function explainRegex(pattern: string): RegexExplanation[];
export declare function scanForRedos(pattern: string): RedosReport;

