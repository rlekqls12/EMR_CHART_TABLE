import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import EMRApi from 'src/api/emrApi';
import styles from './index.module.css';
import Table from 'src/components/table';
import Pagination from 'src/components/pagination';

// 테이블 헤더
const patientHeadList = [
  {text: '환자 ID', value: 'personID', sort: 'person_id'},
  {text: '성별', value: 'gender', sort: 'gender'},
  {text: '생년월일', value: 'birthDatetime', sort: 'birth'},
  {text: '나이', value: 'age', sort: undefined},
  {text: '인종', value: 'race', sort: 'race'},
  {text: '민족', value: 'ethnicity', sort: 'ethnicity'},
  {text: '사망 여부', value: 'isDeath', sort: 'death'},
];

// 서버에서 가져오는 기본 데이터 Row 개수
const baseDataRows = 30;

// Pagination 표시 개수
const basePaginationShow = 10;

const Index = ({ data }) => {
  // nextjs router 객체
  const router = useRouter();
  // url query 값
  const query = useMemo(() => router?.query ?? {}, [router?.query]);
  // Page 값
  const [page, setPage] = useState(data?.page ?? 1);
  // 데이터 Row 값
  const [rows, setRows] = useState(query?.length ?? baseDataRows)
  // 최대 Page 값
  const maxPage = useMemo(() => Math.ceil((data?.totalLength ?? 0) / rows), [rows, data?.totalLength]);

  // Table Data 업데이트
  function dataUpdate() {
    const paramters = '/?' + Object.entries(query).map(v => v.join('=')).join('&');
    router.push(paramters);
  }

  // Row 값 업데이트 감시
  function onRowUpdate(e) {
    let value = e.target.value;
    if (value < 1) value = 1;
    setRows(value);
    query.length = value;
    dataUpdate();
  }

  // 컬럼 정렬 감시
  function onSort(key, isDesc) {
    if (key) {
      query.order_column = key;
      query.order_desc = isDesc;
    } else {
      delete query.order_column;
      delete query.order_desc;
    }

    dataUpdate();
  }

  // Page 값 업데이트 함수
  function updatePage(page) {
    // page 값이 숫자인지 확인
    if (!isNaN(page * 1)) {
      // 소수점 제거
      const pageNumber = Math.floor(page);
      setPage(pageNumber);
      query.page = pageNumber;
      dataUpdate();
    }
  };

  // 페이지 범위 이탈시 조절
  useEffect(() => {
    if (page === 1 && (!data?.list || (data?.totalLength ?? 0) === 0)) return;
    if (page < 1) updatePage(1);
    if (page > maxPage) updatePage(maxPage);
  }, [page, maxPage]);

  return (
    <div className={styles.wrapper}>
      <Table head={patientHeadList} data={data?.list} onSort={onSort}/>
      <div className={styles.control}>
        <div></div>
        <Pagination initialPage={page} maxPage={maxPage} showPageList={basePaginationShow} onPageChange={(page) => updatePage(page)}/>
        <div className={styles.length}>
          <span>표시 개수 :&nbsp;</span><input type="number" onChange={onRowUpdate} value={rows} />
        </div>
      </div>
    </div>
  )
};

// Server Side Rendering, 서버단에서 데이터 통신 후 클라이언트에 데이터 전송
export async function getServerSideProps(context) {
  const { page, length, order_column, order_desc } = context.query;

  if (page < 1) context.query.page = 1;
  if (length < 1) context.query.length = 1;
  if (!order_column || !order_desc) {
    delete context.query.order_column;
    delete context.query.order_desc;
  }

  let patientList = await EMRApi.getPatientList(context.query);

  return { props: { data: patientList } };
}

export default Index;