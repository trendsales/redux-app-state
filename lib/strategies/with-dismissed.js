import { findLastIndex } from '../utils/array';

const beforeNavigate = pages =>
  pages.filter(p => !p.meta.dismissed);

const getCurrentPage = pages =>
  findLastIndex(pages, item => !item.meta.dismissed);

const onBack = (pages) => {
  const index = findLastIndex(pages, item => !item.meta.dismissed);
  pages[index].meta.dismissed = true;
  return pages;
};

export default base => Object.assign({
  beforeNavigate,
  onBack,
  getCurrentPage,
}, base);
