import { type AccountRepository } from "./account-repository";
import { type CanonicalEmailBlockRepository } from "./canonical-email-block-repository";
import { type DimensionRepository } from "./dimension-repository";
import { type DomainAllowRepository } from "./domain-allow-repository";
import { type DomainBlockRepository } from "./domain-block-repository";
import { type EmailDomainBlockRepository } from "./email-domain-block-repository";
import { type IpBlockRepository } from "./ip-block-repository";
import { type MeasureRepository } from "./measure-repository";
import { type ReportRepository } from "./report-repository";
import { type RetentionRepository } from "./retention-repository";
import { type TrendRepository } from "./trend-repository";

export interface AdminRepository {
  readonly accounts: AccountRepository;
  readonly canonicalEmailBlocks: CanonicalEmailBlockRepository;
  readonly dimensions: DimensionRepository;
  readonly domainAllows: DomainAllowRepository;
  readonly domainBlocks: DomainBlockRepository;
  readonly emailDomainBlocks: EmailDomainBlockRepository;
  readonly ipBlocks: IpBlockRepository;
  readonly measures: MeasureRepository;
  readonly reports: ReportRepository;
  readonly retention: RetentionRepository;
  readonly trends: TrendRepository;
}
