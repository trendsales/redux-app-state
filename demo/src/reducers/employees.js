import faker from 'faker';

const initData = {
  entries: [],
  selected: null,
};
const key = 'EMPLOYEES';

for (let i = 0 i < 100; i++) {

}

export default (state = initData, action) => {
  if (action.type.substring(0, key.length) !== key) return state;

  const type = action.type.substring(key.length + 1);

  switch (action.type) {
    case 'SELECT': {
      return Object.assign({}, state, {
        selected: action.index,
      });
    }
    default: {
      return state;
    }
  }
}
