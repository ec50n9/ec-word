import { commonAlova } from "..";

export const listMyWords = () => commonAlova.Get<string[]>("/list-my-words");

export const queryWord = (word: string) =>
  commonAlova.Get<string>("/query-word", { params: { word } });

export const recordWord = (words: string[]) =>
  commonAlova.Post("/record-word", { words });
