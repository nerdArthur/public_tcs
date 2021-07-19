import fs from "fs";
import path from "path";
import EventEmitter from "events";
import { cnpj } from "cpf-cnpj-validator";
import { BRASIL_DDD, FIRST_AREA_CODE, LAST_AREA_CODE, sleep } from "../utils";
import { ColumnCell, TableColumnEnum, RowStatus, Row } from "../xls/xlsTypes";

/**
 * Para cada linha chama a função de validação das colunas, que transformam
 * a linha em um objeto do tipo ColumnCell, que é o formato padrão de uma
 * coluna à ser transmitida para o front-end;
 * @param rows
 * @returns Objeto conténdo os status das linhas, todas as linhas,
 *  todas as linhas que possuem erros, e todas as linhas que não possuem
 *  erros (linhas no formato padrão da aplicação);
 */
export const validateRows = async (
  rows: string[],
  eventEmitter: EventEmitter
): Promise<RowStatus> => {
  const allRows: Row[] = [];
  const rowsWithErrors: Row[] = [];
  const rowsWithoutErrors: Row[] = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const columns = row.split(/,/gm);
    const line: Row = await validateColumns(columns, index);

    if (line.hasErrors) {
      rowsWithErrors.push(line);
    } else {
      rowsWithoutErrors.push(line);
    }

    eventEmitter.emit("msg", line);
    allRows.push(line);

    await sleep(1000);
  }

  return { allRows, rowsWithErrors, rowsWithoutErrors };
};

/**
 *
 * @param columns Array de strings, onde cada string representa uma coluna da linha;
 * @param rowIndex Índice linha em que as colunas se encontram;
 * @returns Uma linha no formato padrão de uma linha da aplicação à ser enviada para o front-end;
 */
export const validateColumns = async (
  columns: string[],
  rowIndex: number
): Promise<Row> => {
  const allColumnsCells: ColumnCell[] = [];

  if (columns.length === 0) {
    return {
      hasErrors: true,
      reason: "Linha vazia",
      line: rowIndex + 1,
      columns: [],
    };
  }

  const QUANTITY_OF_OBRIGATORY_FIELDS = 3;
  if (columns.length < QUANTITY_OF_OBRIGATORY_FIELDS) {
    return {
      hasErrors: true,
      reason: "Está faltando campos",
      line: rowIndex + 1,
      columns: [],
    };
  }

  const [
    id,
    telefoneDestinatario,
    nomeDoArquivoASerEnviadoOuEndereçodoLink,
    nomeDestinatario,
  ] = columns;

  allColumnsCells.push(validateId(id));
  allColumnsCells.push(validateName(nomeDestinatario));
  allColumnsCells.push(validateNumber(telefoneDestinatario));
  allColumnsCells.push(
    await validateNameOrLink(nomeDoArquivoASerEnviadoOuEndereçodoLink)
  );

  const START_OF_OPTIONAL_VALUES_INDEX = 4;
  // campos não obrigatórios
  for (
    let index = START_OF_OPTIONAL_VALUES_INDEX;
    index < columns.length;
    index++
  ) {
    allColumnsCells.push({
      hasError: false,
      value: columns[index] || "",
      column: TableColumnEnum.APARTAMENTO_OU_SALA,
    });
  }

  return {
    hasErrors: hasErrors(allColumnsCells),
    line: rowIndex + 1,
    columns: allColumnsCells,
  };
};

/**
 * Caso encontre alguma coluna com erro, retorna true, fazendo assim, com que
 * utilize menos processamento do que uma função como filter ou reduce
 * @param columns Colunas no formato padrão da aplicação;
 * @returns Verdadeiro casa haja algum erro, falso caso contrário
 */
const hasErrors = (columns: ColumnCell[]): boolean => {
  for (let index = 0; index < columns.length; index++) {
    if (columns[index].hasError) {
      return true;
    }
  }

  return false;
};

/**
 *
 * @param value Nome a ser validado, caso não haja valor, ou esteja em formato incorreto,
 * deverá retornar uma célula no formato padrão da aplicação, conténdo "hasError: true"
 * e a rasão do erro, caso contrário, "hasError: false"
 * @returns
 */
export const validateName = (value: string | undefined): ColumnCell => {
  if (!value) {
    return {
      hasError: true,
      reason: "Nome não informado",
      value: "",
      column: TableColumnEnum.NOME,
    };
  }

  return {
    hasError: false,
    value,
    column: TableColumnEnum.NOME,
  };
};

/**
 *
 * @param value Código a ser validado, caso não haja valor, ou esteja em formato incorreto,
 * deverá retornar uma célula no formato padrão da aplicação, conténdo "hasError: true"
 * e a rasão do erro, caso contrário, "hasError: false"
 * @returns
 */
export const validateId = (value: string | undefined): ColumnCell => {
  if (!value) {
    return {
      hasError: true,
      reason: "Código identificador não informado",
      value: "",
      column: TableColumnEnum.ID,
    };
  }

  const hasDelimiter = /\d+;.*/g.test(value);

  if (!hasDelimiter) {
    return {
      hasError: true,
      reason: "Formato incorreto para código delimitador",
      value,
      column: TableColumnEnum.ID,
    };
  }

  const cnpjValue = value.split(";")[0];
  if (!cnpj.isValid(cnpjValue)) {
    return {
      hasError: true,
      reason: "Cnpj inválido.",
      value,
      column: TableColumnEnum.ID,
    };
  }

  return {
    hasError: false,
    value,
    column: TableColumnEnum.ID,
  };
};

/**
 *
 * @param nameOrLink Nome ou link a ser validado, caso não haja valor, ou esteja em formato incorreto,
 * deverá retornar uma célula no formato padrão da aplicação, conténdo "hasError: true"
 * e a rasão do erro, caso contrário, "hasError: false". Caso o valor informado não seja um link,
 * verifica-se se o arquivo foi informado, caso contrário retorna uma célula conténdo a rasão do erro.
 * @returns
 */
export const validateNameOrLink = async (
  nameOrLink: string | undefined
): Promise<ColumnCell> => {
  if (!nameOrLink) {
    return {
      hasError: true,
      reason: "Nome do arquivo ou link não informado",
      value: "",
      column: TableColumnEnum.NOME_DO_ARQUIVO_OU_LINK,
    };
  }

  const hasExtension = /\./gm.test(nameOrLink);
  if (hasExtension) {
    if (isUrl(nameOrLink)) {
      return {
        hasError: false,
        value: nameOrLink,
        column: TableColumnEnum.NOME_DO_ARQUIVO_OU_LINK,
      };
    }

    const isExpectedFileTypes = /(xls|xlsx|pdf|txt)/gm.test(nameOrLink);
    if (!isExpectedFileTypes) {
      return {
        hasError: true,
        reason: "Nome do arquivo ou link inválido",
        value: nameOrLink,
        column: TableColumnEnum.NOME_DO_ARQUIVO_OU_LINK,
      };
    }
  }
  //TODO search for find the informed file
  const INFORMED_FILES_FOLDER_PATH = path.resolve(__dirname, "..", "downloads");
  const isFileExists = fs.existsSync(
    `${INFORMED_FILES_FOLDER_PATH}/${nameOrLink}`
  );

  if (!isFileExists) {
    return {
      hasError: true,
      reason: "Arquivo não encontrado",
      value: nameOrLink,
      column: TableColumnEnum.NOME_DO_ARQUIVO_OU_LINK,
    };
  }

  return {
    hasError: false,
    value: nameOrLink,
    column: TableColumnEnum.NOME_DO_ARQUIVO_OU_LINK,
  };
};

/**
 * Faz a validação da URL, verificando por meio de regex se é uma URL válida;
 * @param value URL a ser validada.
 * @returns Verdadeiro caso seja uma URL válida, falso caso contrátio
 */
export const isUrl = (value: string | undefined): boolean => {
  if (!value) {
    return false;
  }

  return /((https?|file):\/\/)?.*(\.com)(.*)?/gm.test(value);
};

/**
 * Transforma o valor passado por parâmetro em um objeto do tipo "ColumnCell",
 * que é o formato padrão de uma coluna à ser transmitida para o front-end;
 * @param value Valor a ser verificado
 * @returns
 */
export const validateNumber = (value: string | undefined): ColumnCell => {
  if (!value) {
    return {
      hasError: true,
      reason: "Valor não informado",
      value: "",
      column: TableColumnEnum.TELEFONE_DESTINATARIO,
    };
  }

  const valueWithoutSpecialCaracters = value.replace(/[+-/;.,()]|\s/gm, "");

  const isNotANumber = /\D/gm.test(valueWithoutSpecialCaracters);
  if (isNotANumber) {
    return {
      hasError: true,
      reason: "Não é um número válido",
      value,
      column: TableColumnEnum.TELEFONE_DESTINATARIO,
    };
  }

  const isCorrectDigitsCount =
    valueWithoutSpecialCaracters.length >= 9 &&
    valueWithoutSpecialCaracters.length <= 13;

  if (!isCorrectDigitsCount) {
    return {
      hasError: true,
      reason: "Não possui quantidade correta de dígitos",
      value: value || "",
      column: TableColumnEnum.TELEFONE_DESTINATARIO,
    };
  }

  const firstTwoDigits = valueWithoutSpecialCaracters.slice(0, 2);

  const startsWithBrasilDDD = Number(firstTwoDigits) === BRASIL_DDD;
  const startsWithAreaCode =
    Number(firstTwoDigits) >= FIRST_AREA_CODE &&
    Number(firstTwoDigits) <= LAST_AREA_CODE;

  if (!startsWithBrasilDDD && !startsWithAreaCode) {
    return {
      hasError: true,
      reason: "Prefixos incorretos",
      value,
      column: TableColumnEnum.TELEFONE_DESTINATARIO,
    };
  }

  if (startsWithBrasilDDD && valueWithoutSpecialCaracters.length <= 9) {
    return {
      hasError: true,
      reason: "Número inválido",
      value,
      column: TableColumnEnum.TELEFONE_DESTINATARIO,
    };
  }

  return {
    hasError: false,
    value,
    column: TableColumnEnum.TELEFONE_DESTINATARIO,
  };
};
