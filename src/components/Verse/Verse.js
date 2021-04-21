import React, { useMemo, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import { useVerse } from "hooks";

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
  const { lang } = props;
  const [verse, setVerseOptions] = useVerse({ lang: lang || "en" });

  useEffect(() => {
    if (lang) setVerseOptions({ lang });
  }, [lang, setVerseOptions]);

  const citation = useMemo(() => {
    if (verse) {
      const {
        book,
        chapter,
        verseStart: vs,
        verseEnd: ve,
        translation,
      } = verse;
      return `${book} ${chapter}:${vs}${
        !ve || ve === vs ? `` : `-${ve}`
      } (${translation})`;
    } else {
      return "";
    }
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
        <i>{verse?.text || ""}</i>
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
