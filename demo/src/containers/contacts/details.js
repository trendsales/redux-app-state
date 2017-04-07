import { connect } from 'react-redux';
import { showContact } from 'actions/navigation';
import Contact from 'components/contacts/details';

export default connect(state => ({
  ...state.contacts[(state.history.currentPage.meta.params || {}).id],
}), dispatch => ({
  onShowContact: (id) => { dispatch(showContact(id)); }
}))(Contact);
