import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";

import { Queue } from "bull";

import { type MailerDTO } from "./mail.dto.";

@Injectable()
export class MailService {
  constructor(@InjectQueue("mail") private readonly mailQueue: Queue) {}

  async send(mailerDTO: MailerDTO) {
    return await this.mailQueue.add(
      "send",
      {
        ...mailerDTO,
      },
      {
        removeOnComplete: true,
        attempts: 3,
        priority: 0,
      },
    );
  }
}
