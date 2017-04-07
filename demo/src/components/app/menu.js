import React from 'react';

export default ({ selectTab }) => (
  <div>
    <div onClick={selectTab.bind(null, 'calls')}>
      Calls
    </div>
    <div onClick={selectTab.bind(null, 'contacts')}>
      Contacts
    </div>
    <div onClick={selectTab.bind(null, 'settings')}>
      Settings
    </div>
  </div>
);
