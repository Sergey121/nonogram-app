import React, { useCallback } from 'react';
import styles from './header.module.scss';
import { Button } from '../button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { AppActions } from '../../store/app/actions';

export const Header = () => {
  const dispatch = useDispatch();
  const { running } = useSelector((state: RootState) => state.app);

  const handleClick = useCallback(() => {
    dispatch(AppActions.setRunning(!running));
  }, [running]);

  return (
    <nav className={styles.navigation}>
      <div className={styles.name}>Nonogram solver Visualizer</div>
      <Button disabled={running} className={styles.btn} title={'Visualize!'} onClick={handleClick}/>
    </nav>
  )
};
