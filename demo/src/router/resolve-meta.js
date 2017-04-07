export default ({
  url,
}) => {
  const [container, query] = url.split('?');
  let params = {};
  if (query) {
    params = query.split('&').map(q => {
      const [name, value] = query.split('=');
      return {
        name,
        value,
      };
    }).reduce((output, prop) => {
      output[prop.name] = prop.value;
      return output;
    }, {});
  }

  return {
    container,
    params,
  };
};
