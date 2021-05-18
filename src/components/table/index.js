import React, { useEffect, useMemo, useState } from 'react';
import styles from './style.module.css';

const Table = ({ head = [], data = [], detailData = {}, selectKey = '', onSelect = (id) => {}, baseSort = [undefined, false], onSort = (key, isDesc) => {}, baseFilter = {}, onFilter = (key, value) => {} }) => {
  const memoSort = useMemo(() => baseSort, []);
  const memoFilter = useMemo(() => baseFilter, []);
  const [sortInfo, setSortInfo] = useState(() => memoSort);
  const [filterInfo, setFilterInfo] = useState(() => memoFilter);
  const [selectedID, setSelectedID] = useState();

  // 정렬
  function sort(key) {
    if (!key) return;

    let desc = false;
    const [sortKey, sortDesc] = sortInfo;
    if (sortKey === key) {
      if (sortDesc) {
        key = undefined;
      } else {
        desc = true;
      }
    }

    setSortInfo([key, desc]);
    onSort(key, desc);
  }

  // 필터
  function filterUpdate(key, value) {
    if (!key) return;

    if (value) filterInfo[key] = value;
    else delete filterInfo[key];
    setFilterInfo({...filterInfo});
  }
  function filterSend(key, value) {
    if (!key) return;

    onFilter(key, value);
  }

  // 컬럼 선택
  useEffect(() => {
    onSelect(selectedID);
  }, [selectedID]);

  // 테이블 헤더 생성
  const headElement = useMemo(() => {
    const [sortKey, sortDesc] = sortInfo;
    const headers = [];
    const filters = [];

    head.forEach((obj, index) => {
      const key = obj?.value ?? index;
      const filter = obj?.filter;

      // 정렬 상태 적용
      const isSortActive = (sortKey && sortKey === obj?.sort) ? (sortDesc ? '▲' : '▼') : '';

      // 헤더 추가
      headers.push(
        <th key={key} className={styles.pointer} onClick={() => sort(obj?.sort)}>{obj?.text}{isSortActive}</th>
      );

      // 필터 추가
      if (filter) {
        const filterKey = filter?.key;
        if (obj.filter.type === 'text') {
          // 문자 타입
          const changeFunc = (e) => filterUpdate(filterKey, e?.target?.value);
          const eventFunc = (e) => filterSend(filterKey, e?.target?.value);
          const enterEventFunc = (e) => { if (e.key.toLowerCase() === 'enter') eventFunc(e) };
          
          filters.push(
            <th key={key}><input type="text" placeholder={obj?.text + " 필터"} value={filterInfo[filterKey] ?? ''} onChange={changeFunc} onKeyDown={enterEventFunc} onBlur={eventFunc}/></th>
          );
        } else if (obj.filter.type === 'range') {
          // 범위 타입
          const filterRangeArr = filter?.range;
          const minParam = (e) => [filterKey + filterRangeArr[0], e?.target?.value];
          const maxParam = (e) => [filterKey + filterRangeArr[1], e?.target?.value];
          const eventFuncMin = (e) => {
            filterUpdate(...minParam(e));
            filterSend(...minParam(e));
          };
          const eventFuncMax = (e) => {
            filterUpdate(...maxParam(e));
            filterSend(...maxParam(e));
          };

          filters.push(
            <th key={key}>
              <input className={styles.halfInput} type="number" placeholder={"최소"} value={filterInfo[filterKey + filterRangeArr[0]] ?? ''} onChange={eventFuncMin} onBlur={eventFuncMin}/>
              ~
              <input className={styles.halfInput} type="number" placeholder={"최대"} value={filterInfo[filterKey + filterRangeArr[1]] ?? ''} onChange={eventFuncMax} onBlur={eventFuncMax}/>
            </th>
          );
        } else if (obj.filter.type === 'switch') {
          // 스위치 타입
          const param = (e) => [filterKey, e?.target?.value];
          const eventFunc = (e) => {
            filterUpdate(...param(e));
            filterSend(...param(e));
          };

          filters.push(
            <th key={key}>
              <input id={filterKey + 'all'} name={filterKey} className={styles.thirdInput} type="radio" value={undefined} onChange={eventFunc} checked={!filterInfo[filterKey]}/><label htmlFor={filterKey + 'all'}>전체</label>
              <input id={filterKey + 'y'} name={filterKey} className={styles.thirdInput} type="radio" value={'true'} onChange={eventFunc} checked={filterInfo[filterKey] === 'true'}/><label htmlFor={filterKey + 'y'}>여</label>
              <input id={filterKey + 'n'} name={filterKey} className={styles.thirdInput} type="radio" value={'false'} onChange={eventFunc} checked={filterInfo[filterKey] === 'false'}/><label htmlFor={filterKey + 'n'}>부</label>
            </th>
          );
        } else {
          filters.push(<th key={key} ></th>);
        }
      } else {
        filters.push(<th key={key} ></th>);
      }
    });

    return (
      <>
        {headers && <tr>{headers}</tr>}
        {filters && <tr>{filters}</tr>}
      </>
    );
  }, [head, sortInfo, filterInfo]);

  // 테이블 바디 생성
  const bodyElement = useMemo(() => {
    const { id, render } = detailData;

    return data.map((row, idx0) => 
      (<React.Fragment key={idx0}>
        <tr onClick={() => setSelectedID(row[selectKey])}>
          {head.map((obj, idx1) => (
            <td key={idx1}>{row[obj.value].toString()}</td>
          ))}
        </tr>
        {row[selectKey] == id && render}
      </React.Fragment>)
    );
  }, [data]);

  return (
    <table className={styles.table}>
      <thead>
        {headElement}
      </thead>
      <tbody>
        {bodyElement}
      </tbody>
    </table>
  )
};

export default React.memo(Table);