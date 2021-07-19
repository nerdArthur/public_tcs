import XLSX from "xlsx";

/**
 * Transforma um arquivo xls ou xlsx para csv
 * @param xlsPath Caminho para o arquivo xls ou xlsx à ser transformado
 * @returns String no formato csv
 */
export const xlsToCsv = (filePath: string): string => {
  const workbook = XLSX.read(filePath, { type: "file" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const csv = XLSX.utils.sheet_to_csv(worksheet, {
    blankrows: false,
    rawNumbers: true,
    skipHidden: true,
  });

  return csv;
};
