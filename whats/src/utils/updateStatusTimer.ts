import { In, Not } from "typeorm";
import { campanhaRepository } from "../models";
import { CampanhaStatus } from "../models/Campanha";
import { StatusRegistro } from "../models/Registro";

export const updateStatusTimer = async () => {
  const notFinishedCampanhas = await campanhaRepository.find({
    where: {
      status: Not(In([CampanhaStatus.FINALIZADA])),
    },
  });

  for (let index = 0; index < notFinishedCampanhas.length; index++) {
    const campanha = notFinishedCampanhas[index];

    const hasSendedFile =
      campanha.registros?.filter((r) => {
        return r.status === StatusRegistro.ENVIADO;
      }).length === campanha.registros?.length;

    if (hasSendedFile) {
      campanha.status = CampanhaStatus.FINALIZADA;
      await campanhaRepository.save(campanha);
    }
  }
};
