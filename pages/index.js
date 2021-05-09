import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import EMRApi from 'src/api/emrApi';
import styles from './index.module.css';
import Chart from 'src/components/chart';
import Table from 'src/components/table';
import Pagination from 'src/components/pagination';

// 테이블 헤더
const patientHeadList = [
  {
    text: '환자 ID',
    value: 'personID',
    sort: 'person_id',
    filter: undefined
  },
  {
    text: '성별',
    value: 'gender',
    sort: 'gender',
    filter: {
      key: 'gender',
      type: 'text'
    }
  },
  {
    text: '생년월일', 
    value: 'birthDatetime', 
    sort: 'birth', 
    filter: undefined
  },
  {
    text: '나이', 
    value: 'age', 
    sort: undefined, 
    filter: {
      key: 'age',
      type: 'range',
      range: ['_min', '_max']
    }
  },
  {
    text: '인종', 
    value: 'race', 
    sort: 'race', 
    filter: {
      key: 'race',
      type: 'text'
    }
  },
  {
    text: '민족', 
    value: 'ethnicity', 
    sort: 'ethnicity', 
    filter: {
      key: 'ethnicity',
      type: 'text'
    }
  },
  {
    text: '사망 여부', 
    value: 'isDeath', 
    sort: 'death', 
    filter: {
      key: 'death',
      type: 'switch'
    }
  },
];

// 서버에서 가져오는 기본 데이터 Row 개수
const baseDataRows = 30;

// Pagination 표시 개수
const basePaginationShow = 10;

// Chart Color 랜덤 값
const randomColor = Array.from({ length: 10 }, (_, i) => {
  const randomFF = () => {
    const FF = Math.floor(Math.random() * 255).toString(16);
    return FF.length === 1 ? '0' + FF : FF;
  }
  return '#' + randomFF() + randomFF() + randomFF();
});

const Index = ({ data = [], chart = [] }) => {
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

  // 초기 정렬 값
  const baseSort = useMemo(() => [query?.order_column, query?.order_desc == 'true'], []);
  // 초기 필터 값
  const baseFilter = useMemo(() => query, []);

  // 차트 데이터 구분해주는 함수
  function chartClassfication(keys) {
    if (!chart) return [];

    const tempChart = {};
    chart.forEach(temp => {
      let keyData;
      if (Array.isArray(keys)) keyData = keys.map(key => temp[key]).join(' + ');
      else keyData = temp[keys];

      if (tempChart[keyData]) tempChart[keyData] += temp.count;
      else tempChart[keyData] = temp.count;
    });
    return Object.entries(tempChart).map(v => ({ name: v[0], value: v[1] })).sort((a, b) => a.name === b.name ? 0 : (a.name < b.name ? -1 : 1));
  }

  // 차트 : 성별
  const genderChart = useMemo(() => chartClassfication('gender'), [chart]);
  // 차트 : 인종별
  const raceChart = useMemo(() => chartClassfication('race'), [chart]);
  // 차트 : 민족별
  const ethnicityChart = useMemo(() => chartClassfication('ethnicity'), [chart]);
  // 차트 : 성별 인종별
  const genderRaceChart = useMemo(() => chartClassfication(['gender', 'race']), [chart]);
  // 차트 : 성별 민족별
  const genderEthnicityChart = useMemo(() => chartClassfication(['gender', 'ethnicity']), [chart]);

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

  // 컬럼 필터 감시
  function onFilter(key, value) {
    if (!key) return;
    if (!value) delete query[key];
    else query[key] = value;
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
      <b>EMR 차트</b>
      <div className={styles.chartWrap}>
        <Chart name={"성별"} data={genderChart} colors={randomColor.slice(0, genderChart.length)} />
        <Chart name={"인종별"} data={raceChart} colors={randomColor.slice(0, raceChart.length)} />
        <Chart name={"민족별"} data={ethnicityChart} colors={randomColor.slice(0, ethnicityChart.length)} />
        <Chart name={"성별 + 인종별"} data={genderRaceChart} colors={randomColor.slice(0, genderRaceChart.length)} />
        <Chart name={"성별 + 민족별"} data={genderEthnicityChart} colors={randomColor.slice(0, genderEthnicityChart.length)} />
      </div>
      <br />
      <hr />
      <br />
      <b>EMR 테이블</b>
      <Table head={patientHeadList} data={data?.list} baseSort={baseSort} onSort={onSort} baseFilter={baseFilter} onFilter={onFilter}/>
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
  const { page, length, order_column, order_desc, gender, race, ethnicity } = context.query;

  if (page < 1) context.query.page = 1;
  if (length < 1) context.query.length = 1;
  if (!order_column || !order_desc) {
    delete context.query.order_column;
    delete context.query.order_desc;
  }

  const patientList = await EMRApi.getPatientList(context.query);

  let chartList = await EMRApi.getChartList();
  chartList = chartList.filter((chart) => {
    if (gender) return chart.gender === gender;
    if (race) return chart.race === race;
    if (ethnicity) return chart.ethnicity === ethnicity;

    return true;
  });

  return { props: { data: patientList, chart: chartList } };
}

export default Index;