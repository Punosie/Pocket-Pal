declare const SmsReader: {
  requestPermission(): Promise<boolean>;
  getSmsMessages(filter: {
    minDate?: number;
    maxDate?: number;
    box?: string;
    maxCount?: number;
    afterId?: string;
  }): Promise<{ id: string; address: string; body: string; date: number; type: number }[]>;
};

export default SmsReader;
