import { actions } from 'redux-app-state';

export const selectTab = (name) => actions.setOptions({
  tab: name,
});

export const showContact = (id) => actions.navigate(`contact?id=${id}`);

export const showContacts = () => actions.navigate('contacts');

export const showCall = (id) => actions.navigate(`call?id=${id}`);

export const showCalls = () => actions.navigate('calls');
