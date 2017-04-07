import React from 'react';
import ListItem from './list-item.js';

export default ({
  contacts,
  onShowContact,
}) => (
  <div>
    {contacts.map((contact, i) => <ListItem key={i} id={i} {...contact} onShowContact={onShowContact} />)}
  </div>
);
