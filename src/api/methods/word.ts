import { commonAlova } from "..";

export type Word = {
  _id: string;
  wordId: string;
  speech: string;
  usphone: string;
  usspeech: string;
  ukphone: string;
  ukspeech: string;
  picture: string;
  trans: {
    descCn: string;
    descOther: string;
    pos: string;
    tranCn: string;
    tranOther: string;
  }[];
  remMethod: {
    desc: string;
    val: string;
  };
  phrase: {
    phrases: {
      pCn: string;
      pContent: string;
    }[];
    desc: string;
  };
  syno: {
    synos: {
      pos: string;
      tran: string;
      hwds: { w: string }[];
    }[];
    desc: string;
  };
  exam: {
    examType: number;
    question: string;
    answer: {
      explain: string;
      rightIndex: number;
    };
    choices: {
      choiceIndex: number;
      choice: string;
    }[];
  }[];
  sentences: {
    desc: string;
    sentences: {
      sCn: string;
      sContent: string;
    }[];
  };
  realExamSentence: {
    desc: string;
    sentences: {
      sContent: string;
      sourceInfo: {
        level: string;
        paper: string;
        type: string;
        year: string;
      };
    }[];
  };
  relWord: {
    desc: string;
    rels: {
      pos: string;
      words: {
        hwd: string;
        tran: string;
      }[];
    }[];
  };
};

export type WordSimpResp = {
  word: string;
  detail?: WordDetail;
  note?: string;
};

export type WordDetail = Pick<
  Word,
  | "usphone"
  | "ukphone"
  | "speech"
  | "usspeech"
  | "ukspeech"
  | "picture"
  | "trans"
  | "remMethod"
>;

// 获取我的单词列表
export const listMyWords = () =>
  commonAlova.Get<WordSimpResp[]>("/list-my-words");

// 翻译单词
export const queryWord = (word: string) =>
  commonAlova.Get<string>("/query-word", { params: { word } });

// 批量翻译单词
export const batchQueryWord = (words: string[]) =>
  commonAlova.Post<Map<string, Word>>(
    "/batch-query-word",
    { words },
    {
      transformData(data: any, _headers) {
        const result = data.reduce((acc: Map<string, Word>, cur: Word) => {
          acc.set(cur._id, cur);
          return acc;
        }, new Map<string, Word>());
        return result;
      },
    }
  );

// 记录单词
export const recordWord = (words: object[]) =>
  commonAlova.Post("/record-word", { words });

// 有道翻译
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
      transformData(data, _headers) {
        // @ts-ignore
        const query = data.data.query.split("\n").map((item) => item.trim());
        // @ts-ignore
        const result = data.data.translation[0]
          .split("\n")
          // @ts-ignore
          .map((item) => item.trim());
        // @ts-ignore
        return query.map((q, i) => ({ word: q, translation: result[i] }));
      },
    }
  );
};

export type WordBook = {
  _id: string;
  title: string;
  cover: string;
  desc: string;
  word_count: number;
  file_size: number;
  reciters_num: number;
  book_id: string;
  tags: string[];
};

// 获取词书列表
export const listWordBooks = () =>
  commonAlova.Get<WordBook[]>("/list-word-books", {
    transformData(data: any, _headers) {
      return data.data;
    },
  });

// 用户绑定词书
export const bindWordBook = (bookIds: string[]) =>
  commonAlova.Post<{ data: boolean }>("/bind-word-book", { bookIds });

// 用户取消绑定词书
export const unbindWordBook = (bookIds: string[]) =>
  commonAlova.Post<{ data: boolean }>("/unbind-word-book", { bookIds });

// 获取用户已绑定的词书
export const listMyWordBooks = () =>
  commonAlova.Get<WordBook[]>("/list-my-word-books");
