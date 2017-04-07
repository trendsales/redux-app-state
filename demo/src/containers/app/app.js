import { connect } from 'react-redux';
import { selectTab } from 'actions/navigation';

import App from 'components/app/app';
import containers from './containers';

export default connect(state => ({
  View: containers[state.history.currentPage.meta.container],
}), dispatch => ({
  selectTab: (name) => { dispatch(selectTab(name)) },
}))(App);
