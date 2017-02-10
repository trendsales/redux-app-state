const beforeNavigate = pages =>
  pages.filter(p => !p.getIn(['meta', 'dismissed']));

const getCurrentPage = pages =>
  pages.findLastIndex(item => !item.getIn(['meta', 'dismissed']));

const onBack = (pages) => {
  const index = pages.findLastIndex(item => !item.getIn(['meta', 'dismissed']));
  return pages.setIn([index, 'meta', 'dismissed'], true);
};

export default base => Object.assign({
  beforeNavigate,
  onBack,
  getCurrentPage,
}, base);
