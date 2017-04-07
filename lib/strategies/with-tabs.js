import { findLastIndex } from '../utils/array';

const getCurrentPage = (pages, state) =>
  findLastIndex(pages, item => item.meta.tab === state.tab && !item.meta.dismissed);

const onBack = (pages, meta, state) => {
  const index = findLastIndex(pages, item => item.meta.tab === state.tab && !item.meta.dismissed);
  pages[index].meta.dismissed = true;
  return pages;
};

export default base => ({
  ...base,
  onBack,
  getCurrentPage,
});
