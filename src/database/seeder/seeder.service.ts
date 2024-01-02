import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SeederService {
  async seed() {
    Logger.log("Seeding");
  }
}
