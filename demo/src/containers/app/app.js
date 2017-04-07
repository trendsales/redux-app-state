import { connect } from 'react-redux';
import { selectTab } from 'actions/navigation';
import { actions } from 'redux-app-state';

import App from 'components/app/app';
import containers from './containers';

export default connect(state => ({
  View: containers[state.history.currentPage.meta.container],
  params: state.history.currentPage.meta.params,
  hasBack: state.history.hasBack,
  tab: state.history.options.tab,
}), dispatch => ({
  selectTab: (name) => { dispatch(selectTab(name)) },
  onBack: () => { dispatch(actions.back())}
}))(App);
