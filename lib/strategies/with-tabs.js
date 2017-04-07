import { findLastIndex } from '../utils/array';

const getCurrentPage = (pages, options) =>
  findLastIndex(pages, item => item.meta.tab === options.tab && !item.meta.dismissed);

const onBack = (pages, meta, options) => {
  const index = findLastIndex(pages, item => item.meta.tab === options.tab && !item.meta.dismissed);
  pages[index].meta.dismissed = true;
  return pages;
};

export default base => ({
  ...base,
  onBack,
  getCurrentPage,
});
