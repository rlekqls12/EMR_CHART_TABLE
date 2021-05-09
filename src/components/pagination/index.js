import React, { useState, useMemo, useEffect } from 'react';
import styles from './style.module.css';

const Pagination = ({ initialPage = 1, maxPage = 1, showPageList = 1, onPageChange = (page) => {} }) => {
  // 페이지 변수
  const [page, setPage] = useState(initialPage);
  // 페이지 숫자 목록
  const pageList = useMemo(() => {
    const halfPageCount = Math.ceil(showPageList / 2);
    let startNumber = page - halfPageCount;

    if (maxPage - page < halfPageCount) startNumber = maxPage - showPageList + 1;
    if (page <= halfPageCount || startNumber < 1) startNumber = 1;

    return Array.from({ length: Math.min(maxPage, showPageList) }, (_, i) => {
      const target = startNumber + i;
      return (
        <span key={i} className={target === page ? styles.active : ''} onClick={() => updatePage(target)}>{target}</span>
      );
    });
  }, [page, maxPage, showPageList]);

  // 현재 페이지 표시 업데이트
  function updatePage(now) {
    setPage(now);
    onPageChange(now);
  }
  function prevPage() {
    if (page > 1) updatePage(page - 1);
  }
  function nextPage() {
    if (page < maxPage) updatePage(page + 1);
  }

  // 부모 컴포넌트에서 값 변경 시 업데이트
  useEffect(() => {
    setPage(Math.min(initialPage, maxPage));
  }, [initialPage]);

  return (
    <div className={styles.pagination}>
        <button onClick={prevPage}>◀</button>
        <div className={styles.pageList}>{pageList}</div>
        <button onClick={nextPage}>▶</button>
      </div>
  )
};

export default React.memo(Pagination);