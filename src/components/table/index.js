import React, { useMemo, useState } from 'react';
import styles from './style.module.css';

const Table = ({ head = [], data = [], onSort = (key, isDesc) => {} }) => {
  const [sortKey, setSortKey] = useState();
  const [sortDesc, setSortDesc] = useState(false);

  // 정렬
  function sort(key) {
    if (!key) return;

    let desc = false;
    if (sortKey === key) {
      if (sortDesc) {
        key = undefined;
      } else {
        desc = true;
      }
    }

    setSortKey(key);
    setSortDesc(desc);
    onSort(key, desc);
  }

  // 테이블 헤더 생성
  const headElement = useMemo(() => {
    return head.map((obj, index) => {
      const isSortActive = (sortKey && sortKey === obj?.sort) ? (sortDesc ? '▲' : '▼') : '';
      return (
        <th key={obj?.value ?? index} onClick={() => sort(obj?.sort)}>{obj?.text}{isSortActive}</th>
      );
    });
  }, [head, sortKey, sortDesc]);

  // 테이블 바디 생성
  const bodyElement = useMemo(() => {
    return data.map((row, index0) => (
      <tr key={index0}>
        {head.map((obj, index1) => (
          <td key={index1}>{row[obj.value].toString()}</td>
        ))}
      </tr>
    ));
  }, [data]);

  return (
    <table className={styles.table}>
      <thead>
        <tr>{headElement}</tr>
      </thead>
      <tbody>
        {bodyElement}
      </tbody>
    </table>
  )
};

export default React.memo(Table);