export default (strategies) => {
  strategies.reduce((prev, next) => {
    const response = prev;
    Object.keys(next).forEach((key) => {
      if (prev[key]) {
        const inner = prev[key];
        response[key] = (pages) => {
          next[key](inner(pages));
        };
      } else {
        response[key] = next[key];
      }
    });
    return prev;
  }, {
  });
};
