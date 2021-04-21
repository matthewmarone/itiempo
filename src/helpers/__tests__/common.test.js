import { mergeSortedLists, isDigits, daysIntoYear } from "../common";

test("daysIntoYear", () => {
  [
    { d: new Date(2016, 0, 1), e: 1 },
    { d: new Date(2016, 1, 1), e: 32 },
    { d: new Date(2016, 2, 1), e: 61 },
    { d: new Date(2017, 2, 1), e: 60 },
    { d: new Date(2016, 5, 1), e: 153 },
    { d: new Date(2016, 11, 31), e: 366 },
    { d: new Date(2017, 11, 31), e: 365 },
    { d: new Date(2100, 11, 31), e: 365 },
  ].forEach(({ d, e }) => expect(daysIntoYear(d)).toBe(e));
});

test("isDigit", () => {
  expect(isDigits("123")).toBeTruthy();
  expect(isDigits("0")).toBeTruthy();
  expect(isDigits("0123456789")).toBeTruthy();
  expect(isDigits(null)).toBeFalsy();
  expect(isDigits(undefined)).toBeFalsy();
  expect(isDigits("")).toBeFalsy();
  expect(isDigits("a123")).toBeFalsy();
  expect(isDigits("1a23")).toBeFalsy();
  expect(isDigits("123a")).toBeFalsy();
  expect(isDigits(".123")).toBeFalsy();
  expect(isDigits("12.3")).toBeFalsy();
  expect(isDigits("123.")).toBeFalsy();
  expect(isDigits("123.0")).toBeFalsy();
  expect(isDigits("123F")).toBeFalsy();
});

const compareFunction = (i1, i2) => (i1 === i2 ? 0 : i1 < i2 ? -1 : 1);
test("mergeSortedLists", () => {
  const l1 = [20, 9, 8, 7, 6].reverse();
  const l2 = [11, 10, 9, 1, 1].reverse();
  const nonDupRes = [20, 11, 10, 9, 8, 7, 6, 1, 1].reverse();
  const dupRes = [20, 11, 10, 9, 9, 8, 7, 6, 1, 1].reverse();
  let res = mergeSortedLists(l1, l2, compareFunction);
  expect(res).toEqual(nonDupRes);
  res = mergeSortedLists(l1, l2, compareFunction, true, true);
  expect(res).toEqual(dupRes);
});
test("mergeSortedLists with a descending ordered list", () => {
  const l1 = [20, 9, 8, 7, 6];
  const l2 = [11, 10, 9, 1, 1];
  const nonDupRes = [20, 11, 10, 9, 8, 7, 6, 1, 1];
  const dupRes = [20, 11, 10, 9, 9, 8, 7, 6, 1, 1];
  let res = mergeSortedLists(l1, l2, compareFunction, false);
  expect(res).toEqual(nonDupRes);
  res = mergeSortedLists(l1, l2, compareFunction, false, true);
  expect(res).toEqual(dupRes);
  res = mergeSortedLists(l1, l2, compareFunction, true);
  expect(res).not.toEqual(nonDupRes);
  res = mergeSortedLists(l1, l2, compareFunction, true, true);
  expect(res).not.toEqual(dupRes);
});
test("mergeSortedLists w/ One or two empty lists", () => {
  const empty = [],
    notEmpty = [1, 2];
  let res = mergeSortedLists(empty, empty, compareFunction, true, false);
  expect(res).toEqual(empty);
  res = mergeSortedLists(empty, empty, compareFunction, true, true);
  expect(res).toEqual(empty);
  res = mergeSortedLists(empty, empty, compareFunction, false, true);
  expect(res).toEqual(empty);
  res = mergeSortedLists(empty, empty, compareFunction, false, false);
  expect(res).toEqual(empty);
  //
  res = mergeSortedLists(notEmpty, empty, compareFunction, true, false);
  expect(res).toEqual(notEmpty);
  res = mergeSortedLists(notEmpty, empty, compareFunction, true, true);
  expect(res).toEqual(notEmpty);
  res = mergeSortedLists(notEmpty, empty, compareFunction, false, true);
  expect(res).toEqual(notEmpty);
  res = mergeSortedLists(notEmpty, empty, compareFunction, false, false);
  expect(res).toEqual(notEmpty);
  //
  res = mergeSortedLists(empty, notEmpty, compareFunction, true, false);
  expect(res).toEqual(notEmpty);
  res = mergeSortedLists(empty, notEmpty, compareFunction, true, true);
  expect(res).toEqual(notEmpty);
  res = mergeSortedLists(empty, notEmpty, compareFunction, false, true);
  expect(res).toEqual(notEmpty);
  res = mergeSortedLists(empty, notEmpty, compareFunction, false, false);
  expect(res).toEqual(notEmpty);
});
