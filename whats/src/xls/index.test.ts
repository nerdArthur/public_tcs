// import { it, expect, describe } from "@jest/globals";
// import { allowdDigitsCount } from "../utils/constant";
// // import { isValidNumber } from "./index";

// describe("Deve verificar se o campo passado é um número válido", () => {
//   it("deve verificar se é um número, mesmo com caracteres especiais", () => {
//     const validNumber = "(55) 48-991318756";
//     let isNumber = isValidNumber(validNumber);
//     expect(isNumber).toBe(true);

//     const invalidNumber = "994131af";
//     isNumber = isValidNumber(invalidNumber);
//     expect(isNumber).toBe(false);
//   });

//   it("deve lançar erro caso o não possua a quantidade de dígitos correta", async () => {
//     const numberWithValidLength = "5548991647263";
//     let isNumber = isValidNumber(numberWithValidLength);
//     expect(isNumber).toBe(true);

//     const numberWithInvalidLength = "559137080";
//     isNumber = isValidNumber(numberWithInvalidLength);
//     expect(isNumber).toBe(false);

//     const numbersWithValidLength = [
//       "5548991756432",
//       "554891310701",
//       "48991030506",
//       "4899131071",
//     ];

//     numbersWithValidLength.forEach((number) => {
//       expect(allowdDigitsCount.includes(number.length)).toBe(true);
//     });
//   });
// });
