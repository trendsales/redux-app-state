import React from 'react';

import styles from './app.css';
import Menu from './menu';

export default ({
  selectTab,
  View
}) => (
  <div className={styles.app}>
    <div className={styles.content}>
      {View}
    </div>
    <Menu selectTab={selectTab} />
  </div>
)
