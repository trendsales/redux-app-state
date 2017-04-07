import {
  showCalls,
  showContacts,
} from 'actions/navigation';

export default (action, options) => {
  switch (options.tab) {
    case 'calls':
      return showCalls();
    case 'contacts':
      return showContacts();
  }

}
