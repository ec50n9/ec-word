import { commonAlova } from "..";

export const listMyWords = () => commonAlova.Get<string[]>("/list-my-words");

export const queryWord = (word: string) =>
  commonAlova.Get<string>("/query-word", { params: { word } });

export const recordWord = (words: string[]) =>
  commonAlova.Post("/record-word", { words });

export const translate = (
  word: string | string[],
  from?: string,
  to?: string
) => {
  const query = typeof word === "string" ? word : word.join("\n");
  return commonAlova.Post<{ word: string; translation: string }[]>(
    "/translate",
    { query, from, to },
    {
      transformData(data, headers) {
        console.log(data.data.query);
        const query = data.data.query.split("\n").map((item) => item.trim());
        const result = data.data.translation[0].split("\n").map((item) => item.trim());
        return query.map((q, i) => ({ word: q, translation: result[i] }));
      },
    }
  );
};
