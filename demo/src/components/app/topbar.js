import React from 'react';

import styles from './topbar.css';

export default ({
  hasBack,
  onBack,
}) => (
  <div className={styles.topbar}>
    {hasBack ? <div onClick={onBack}>Back</div> : 'user@localhost:~$'}
  </div>
)
