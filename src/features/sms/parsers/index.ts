import type { BankParser } from '@/types';

import { axisParser } from './axis.parser';
import { hdfcParser } from './hdfc.parser';
import { iciciParser } from './icici.parser';
import { sbiParser } from './sbi.parser';

export { hdfcParser } from './hdfc.parser';
export { sbiParser } from './sbi.parser';
export { iciciParser } from './icici.parser';
export { axisParser } from './axis.parser';

export const ALL_PARSERS: BankParser[] = [hdfcParser, sbiParser, iciciParser, axisParser];
