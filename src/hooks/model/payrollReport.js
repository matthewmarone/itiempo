class PayRollReport {
  #name;

  #totalBreaks;
  #totalHours;
  #totalPay;
  #totalOverTime;

  #timeRecords;

  #subPayRollReports;

  constructor(name) {
    this.#name = name;

    this.#totalBreaks = 0;
    this.#totalHours = 0;
    this.#totalBreaks = 0;
    this.#totalOverTime = 0;

    this.#timeRecords = [];

    this.#subPayRollReports = [];
  }

  
}
