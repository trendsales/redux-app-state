import React from 'react';
import styles from './list-item.css';

export default ({
  id,
  name,
  phone,
  email,
  avatar,
  onShowContact,
}) => (
  <div className={styles.item} onClick={onShowContact.bind(null, id)}>
    <div className={styles.info}>
      <div className={styles.name}>{name}</div>
      <div className={styles.phone}>{phone}</div>
      <div className={styles.mail}>{email}</div>
    </div>
    {/*<div>
      <img className={styles.image} src={avatar} />
    </div>*/}
  </div>
);
