import { connect } from 'react-redux';
import { showContact } from 'actions/navigation';
import Contacts from 'components/contacts/list';

export default connect(state => ({
  contacts: state.contacts,
}), dispatch => ({
  onShowContact: (id) => { dispatch(showContact(id)); }
}))(Contacts);
