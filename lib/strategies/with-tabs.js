import { findLastIndex } from '../utils/array';

const getCurrentPage = (pages, options) =>
  findLastIndex(pages, item => item.meta.tab === options.tab);

const onBack = (pages, meta, options) => {
  const currentPage = getCurrentPage(pages, options);
  pages.splice(currentPage, 1);
  return pages;
}

const canGoBack = (pages, options) =>
  pages.filter(page => page.meta.tab === options.tab).length >= 2;

export default base => ({
  ...base,
  getCurrentPage,
  canGoBack,
  onBack,
});
