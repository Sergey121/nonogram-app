import React, { useCallback } from 'react';
import styles from './header.module.scss';
import { Button } from '../button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { AppActions } from '../../store/app/actions';
import { Select } from '../select';
import { NonogramOptions } from '../../store/app/reducer';
import { Option } from '../../models/Option';

export const Header = () => {
  const dispatch = useDispatch();
  const { running, selectedOption } = useSelector((state: RootState) => state.app);

  const handleClick = useCallback(() => {
    dispatch(AppActions.setRunning(!running));
  }, [running]);

  const handleChangeOption = useCallback((option: Option) => {
    dispatch(AppActions.changeOption(option));
  }, [dispatch]);

  return (
    <nav className={styles.navigation}>
      <div className={styles.name}>Nonogram solver Visualizer</div>
      <Select disabled={running} className={styles.selector} options={NonogramOptions} value={selectedOption} onChange={handleChangeOption}/>
      <Button disabled={running} className={styles.btn} title={'Visualize!'} onClick={handleClick}/>
    </nav>
  )
};
