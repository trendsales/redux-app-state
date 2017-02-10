export const onBack = pages =>
  pages.filter(p => !p.getIn(['meta', 'dismissed']));

const getCurrentPage = pages =>
  pages.findLastIndex(p => !p.getIn(!['meta', 'dissmissed']));

export default base => Object.assign({
  onBack,
  getCurrentPage,
}, base);
