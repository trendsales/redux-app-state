export const findIndexes = (array, compare) => {
  let elms = [...array];
  const indices = [];
  let idx = elms.findIndex(compare);
  let offset = 0;
  elms = elms.slice(idx + 1);
  while (idx !== -1) {
    indices.push(offset + idx);
    offset += idx + 1;
    idx = elms.findIndex(compare);
    elms = elms.slice(idx + 1);
  }
  return indices;
};

export const findLastIndex = (array, compare) => {
  const result = findIndexes(array, compare);
  return result[result.length - 1];
};
