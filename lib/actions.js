export const navigate = (url, meta) => ({
  type: '@@history/NAVIGATE',
  url,
  meta,
});

export const back = meta => ({
  type: '@@history/TRAVEL',
  meta,
});

export const clean = query => ({
  type: '@@history/CLEAN',
  query,
});
