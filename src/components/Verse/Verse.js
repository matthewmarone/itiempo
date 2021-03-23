import React, { useState, useMemo, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";

const defaultVerse = {
  en: {
    lang: "en",
    book: "John",
    chapter: 3,
    verseStart: 16,
    verseEnd: undefined,
    translation: "NIV",
    text:
      "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
  },
};

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "left",
  },
  verse: {
    paddingLeft: theme.spacing(1),
  },
}));

/**
 *
 * @param {*} props
 * @returns
 */
const Verse = (props) => {
  const classes = useStyles();
  const { lang = "en" } = props;
  const [verse] = useState(defaultVerse?.[lang] || defaultVerse.en);

  const citation = useMemo(() => {
    const { book, chapter, verseStart: vs, verseEnd: ve, translation } = verse;
    return `${book} ${chapter}:${vs}${
      !ve || ve === vs ? `` : `-${ve}`
    } (${translation})`;
  }, [verse]);

  return (
    <div>
      <Typography className={classes.title} variant="h6" gutterBottom>
        Verse of the Day:
      </Typography>
      <Typography
        variant="body1"
        color="textSecondary"
        gutterBottom
        className={classes.verse}
      >
        <i>{verse.text}</i>
      </Typography>
      <Typography
        variant="body1"
        color="textSecondary"
        className={classes.verse}
      >
        ~ {citation}
      </Typography>
      <Typography className={classes.title} variant="body2" color="secondary">
        Hide verses
      </Typography>
    </div>
  );
};
Verse.propTypes = { lang: PropTypes.string };

export default Verse;
