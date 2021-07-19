import { EventEmitter } from "events";
import { Whatsapp } from "venom-bot";
import { Campanha } from "../models/Campanha";
import { registroRepository } from "../models";
import { StatusRegistro } from "../models/Registro";

/**
 * Cria um emissor de eventos, que fica responsável por
 * emitir os eventos para aplicação
 *
 * @param whatsappBot A instância de controle do bot de WhatsApp
 */
export const createEventEmitter = (whatsappBot: Whatsapp) => {
  const eventEmitter = new EventEmitter();

  eventEmitter.on("start-campanha", async (campanha: Campanha) => {
    // deve-se enviar a mensagem, salvar no banco como status de ENVIADO;
    if (campanha.registros) {
      for (const registro of campanha.registros) {
        try {
          const resp = await whatsappBot.sendText(
            registro.telefoneDestinatario + "@c.us",
            "Olá," +
              registro.nomeDestinatario +
              ", somos da empresa tal " +
              "e estamos oferecendo o serviço de entrega de boletos via WhatsApp. " +
              "Deseja receber boletos diretamente via WhatsApp?" +
              ' Se sim, digite "Aceito"'
          );

          console.log(`Message text sended to ${registro.nomeDestinatario}`);
          const updateRegistro = await registroRepository.findOne({
            where: {
              campanha: campanha,
              telefoneDestinatario: registro.telefoneDestinatario,
            },
          });

          updateRegistro!.status = StatusRegistro.SOLICITADO;
          await registroRepository.save(updateRegistro!);

          console.log("RESPOSTA:", resp);
        } catch (err) {
          console.error(err);
        }
      }
    }
  });

  return eventEmitter;
};
