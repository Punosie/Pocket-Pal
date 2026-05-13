import type { BankParser, RawSms, SmsParseResult } from '@/types';

export class ParserRegistryImpl {
  private parsers: BankParser[] = [];
  private senderParserCache = new Map<string, BankParser | null>();

  register(parser: BankParser): void {
    this.parsers.push(parser);
    this.senderParserCache.clear();
  }

  registerAll(parsers: BankParser[]): void {
    parsers.forEach((p) => this.register(p));
  }

  findParser(sender: string): BankParser | null {
    const normalized = sender.toUpperCase().replace(/[^A-Z0-9-]/g, '');

    if (this.senderParserCache.has(normalized)) {
      return this.senderParserCache.get(normalized) ?? null;
    }

    const parser =
      this.parsers.find((p) => p.senderPatterns.some((pattern) => pattern.test(normalized))) ??
      null;

    this.senderParserCache.set(normalized, parser);
    return parser;
  }

  parse(sms: RawSms): SmsParseResult {
    const parser = this.findParser(sms.address);

    if (!parser) {
      return { success: false, error: 'no_parser_found', rawSms: sms };
    }

    try {
      const transaction = parser.parse(sms);
      if (!transaction) {
        return { success: false, error: 'parse_failed', rawSms: sms };
      }
      return { success: true, transaction, rawSms: sms };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'unknown_error',
        rawSms: sms,
      };
    }
  }

  parseAll(smsList: RawSms[]): SmsParseResult[] {
    return smsList.map((sms) => this.parse(sms));
  }

  get registeredParsers(): string[] {
    return this.parsers.map((p) => p.bankCode);
  }
}

export const parserRegistry = new ParserRegistryImpl();
