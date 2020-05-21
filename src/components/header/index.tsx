import React from 'react';
import styles from './header.module.scss';

export const Header = () => {
  return (
    <nav className={styles.navigation}>
      <div className={styles.name}>Nonogram solver Visualizer</div>
    </nav>
  )
};
