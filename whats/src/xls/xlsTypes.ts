export interface RowStatus {
  allRows: Row[];
  rowsWithErrors: Row[];
  rowsWithoutErrors: Row[];
}
export interface Row {
  line: number;
  hasErrors: boolean;
  columns: ColumnCell[];
  reason?: string;
}

export interface ColumnCell {
  hasError: boolean;
  reason?: string;
  value: string;
  column?: string;
}

export enum TableColumnEnum {
  ID = "A",
  TELEFONE_DESTINATARIO = "B",
  NOME_DO_ARQUIVO_OU_LINK = "C",
  NOME = "D",
  APARTAMENTO_OU_SALA = "E",
  GARAGEM = "F",
  HOMEBOX = "G",
  COMPETENCIA = "H",
  VENCIMENTO = "I",
  CONDOMINIO = "J",
  BLOCO_OU_UNIDADE = "K",
}

export const COLUMNS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];

export const ID = 0,
  TELEFONE_DESTINATARIO = 1,
  NOME_DO_ARQUIVO_OU_LINK = 2,
  NOME_DESTINATARIO = 3,
  APARTAMENTO_OU_SALA = 4,
  GARAGEM = 5,
  HOMEBOX = 6,
  COMPETENCIA = 7,
  VENCIMENTO = 8,
  CONDOMINIO = 9,
  BLOCO_OU_UNIDADE = 10;
