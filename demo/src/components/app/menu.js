import React from 'react';
import styles from './menu.css';

const tabs = [{
  name: 'calls',
  display: 'Calls',
}, {
  name: 'contacts',
  display: 'Contacts',
}];

const renderItem = (tab, selectTab, { name, display }) => (
  <div key={name} className={styles.item + (tab === name ? ` ${styles.selected}` : '')} onClick={selectTab.bind(null, name)}>
    {display}
  </div>
)

export default ({ selectTab, tab }) => (
  <div className={styles.menu}>
    {tabs.map(renderItem.bind(null, tab, selectTab))}
  </div>
);
