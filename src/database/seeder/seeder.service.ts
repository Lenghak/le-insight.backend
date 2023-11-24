import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SeederService {
  constructor() {}

  async seed() {
    Logger.log("Seeding");
  }
}
