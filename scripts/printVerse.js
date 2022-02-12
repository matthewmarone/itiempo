const verse = require("../src/assets/verses/en.json")
const {book, chapter, verseStart, verseEnd, text } = verse[0]

console.log(`
${text}

${book} ${chapter}:${verseStart}${verseEnd ? `:${verseEnd}`: ``}
`)
