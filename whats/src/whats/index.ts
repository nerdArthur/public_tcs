const venom = require("venom-bot");

import path from "path";
import { Whatsapp, Message, AckType } from "venom-bot";
import { registroRepository } from "../models";
import { StatusRegistro } from "../models/Registro";

export const startVenom = async (whatsapp: Whatsapp) => {
  whatsapp.onAck(async (ack) => {
    if (ack.ack === AckType.RECEIVED) {
      await registroRepository.update(
        { telefoneDestinatario: ack.from.replace(/@c\.us/gim, "") },
        { status: StatusRegistro.RECEBIDO }
      );
    }
    if (ack.ack === AckType.READ) {
      await registroRepository.update(
        { telefoneDestinatario: ack.from.replace(/@c\.us/gim, "") },
        { status: StatusRegistro.LIDO }
      );
    }
  });

  whatsapp.onMessage(async (message: Message) => {
    const isNumberInCampanha =
      (await registroRepository.count({
        where: {
          telefoneDestinatario: message.from.replace(/\D/gm, ""),
        },
      })) > 0;

    const isExpectedMessage = /Aceito/gim.test(message.body);

    if (isExpectedMessage && isNumberInCampanha) {
      const registro = await registroRepository.findOne({
        where: {
          telefoneDestinatario: message.from.replace(/@c\.us/gim, ""),
        },
      });

      const file = registro!.arquivoOuLink;
      const filePath = path.resolve(__dirname, "..", "..", "uploads", file);

      whatsapp
        .sendFile(message.from, filePath)
        .then(async (result: any) => {
          console.log("Result: ", result);
          await registroRepository.update(
            { telefoneDestinatario: message.from.replace(/@c\.us/gim, "") },
            { status: StatusRegistro.ENVIADO }
          );
        })
        .catch((erro: any) => {
          console.error("Error when sending: ", erro); //return object error
        });

      console.log(
        `O NÚMERO ${message.from.replace(/\D/gm, "")} ESTÁ NA CAMPANHA`
      );
    } else {
      console.log(
        `O NÚMERO ${message.from.replace(/\D/gm, "")} NÃO ESTÁ NA CAMPANHA`
      );
    }
  });
};
