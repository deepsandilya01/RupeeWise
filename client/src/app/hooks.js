import { useDispatch, useSelector } from 'react-redux';

/**
 * Convenient dispatch hook for Redux actions
 */
export const useAppDispatch = () => useDispatch();

/**
 * Convenient selector hook for Redux store state
 */
export const useAppSelector = useSelector;
