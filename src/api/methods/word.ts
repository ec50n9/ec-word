import { commonAlova } from "..";

type Word = {
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

export const listMyWords = () => commonAlova.Get<string[]>("/list-my-words");

export const queryWord = (word: string) =>
  commonAlova.Get<string>("/query-word", { params: { word } });

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

export const recordWord = (words: Object[]) =>
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
        const query = data.data.query.split("\n").map((item) => item.trim());
        const result = data.data.translation[0]
          .split("\n")
          .map((item) => item.trim());
        return query.map((q, i) => ({ word: q, translation: result[i] }));
      },
    }
  );
};
