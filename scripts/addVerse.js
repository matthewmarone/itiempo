const readline = require("readline");

const myArgs = process.argv.slice(2);
const [translation = "NIV"] = myArgs;
const rl = readline.createInterface(process.stdin, process.stdout);

const parseBookChapterAndVerse = (str) => {
  const bookChapterAndVers = str.split(" ");
  if (bookChapterAndVers.length === 3) {
    const [num, bookName, chapterVerse] = bookChapterAndVers;
    return [`${num} ${bookName}`, chapterVerse];
  } else if (bookChapterAndVers.length === 2) {
    return bookChapterAndVers;
  } else {
    throw new Error("Couldn't parse Book Chapter & Verse");
  }
};

const firstQuestion = () => {
  rl.question("Book Chapter & Verse? ", function (answer) {
    const [book, chapterVerse] = parseBookChapterAndVerse(answer)
    const [chapter, verse] = chapterVerse.split(":");
    const [verseStart, verseEnd] = verse.split("-");

    secondQuestion({
      book,
      chapter: Number(chapter),
      verseStart: Number(verseStart),
      verseEnd: verseEnd ? Number(verseEnd) : null,
      translation,
    });
  });
};

const secondQuestion = (verseObj) => {
  rl.question("Text? ", function (text) {
    thirdQuestion({
      ...verseObj,
      text,
    });
  });
};

const thirdQuestion = (verseObj) => {
  rl.question("Next Line? (Leave blank if done)", function (answer) {
    if (answer === "") {
      fourthQuestion(verseObj);
    } else {
      verseObj.text = verseObj.text + answer;
      thirdQuestion(verseObj);
    }
  });
};

const fourthQuestion = (verseObj) => {
  rl.question("Look right (edit)? ", function (text) {
    printVerse({ ...verseObj, text });
  });

  verseObj.text = formate(verseObj.text);
  rl.write(verseObj.text);
};

const formate = (text) =>
  text
    .replaceAll("\\n", " ")
    .replace(/\s\s+/g, " ")
    .replace(/\.[0-9]/g, ".")
    .trim();

const printVerse = (verseObj) => {
  const { book, chapter, verseStart, verseEnd, text } = verseObj;

  console.log(`
    -----

    ${text}

    ${book} ${chapter}:${verseStart}${verseEnd ? `-${verseEnd}` : ``}

    -----

    `);

  console.log("," + JSON.stringify(verseObj) + "\n");

  firstQuestion();
};

firstQuestion();

// const [book, chapterVerse, text, translation = "NIV" ] = myArgs;

// const [chapter, verse] = chapterVerse.split(':')

// const [verseStart, verseEnd] = verse.split('-')

// const retVal = {
//     book,
//     chapter: Number(chapter),
//     verseStart: Number(verseStart),
//     verseEnd: verseEnd ? Number(verseEnd) : null,
//     translation,
//     text: text.replaceAll('\\n', '' ).replace(/\s\s+/g, ' ').trim()
//   }

// console.log(JSON.stringify(retVal))
