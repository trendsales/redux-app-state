import React from 'react';

import styles from './app.css';
import Topbar from './topbar.js';
import Menu from './menu';

export default ({
  tab,
  selectTab,
  View,
  params,
  hasBack,
  onBack,
}) => (
  <div className={styles.app}>
    <Topbar hasBack={hasBack} onBack={onBack}/>
    <div className={styles.content}>
      {View && <View {...params} />}
    </div>
    <Menu tab={tab} selectTab={selectTab} />
  </div>
)
