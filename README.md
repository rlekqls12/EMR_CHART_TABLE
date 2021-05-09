# EMR CHART TABLE

## 1. 설치 / 실행 방법

1. git clone https://github.com/rlekqls12/EMR_CHART_TABLE.git
2. npm install 또는 yarn
3. 최상단 경로에 .env.local 파일 생성 후 SERVER_URL에 서버 주소 입력 (http://ip:port)
4. npm run build 또는 yarn build
5. npm start 또는 yarn start
6. localhost:3000 로 접속

## 2. 프로젝트 구성

1. NextJS를 이용해 Server Side Rendering 구현.
2. Webpack5 적용
3. Jest + Enzyme로 Unit Test

## 3. 구현 내용 설명

### 3.1 프로젝트 구현 내용

1. ReactJS를 사용했습니다.
2. NextJS를 이용해 Webpack5와 Server Side Rendering을 구현했습니다.
3. Unit Test 라이브러리로 Jest와 Enzyme를 사용했습니다.
4. Recharts 라이브러리로 차트를 구현했습니다.

### 3.2 기능 구현 내용

1. 문제의 주축이되는 테이블을 우선적으로 만들었습니다.
2. 페이지를 이동할 수 있는 Pagination과 컬럼 개수를 조절할 수 있는 input을 만들었습니다.
3. 테이블 정렬 기능을 만들었습니다.
4. 테이블 필터 기능을 만들었습니다.
5. 테이블 위에 차트를 만들었습니다.
6. 확인 못하고 놓친 환자 상세 정보를 추가했습니다.
   6-1. 테스트 해보려고 했으나 INTERNAL SERVER ERROR가 발생해서 확인하지 못 했습니다.

### 3.3 어려웠던 부분

1. NestJS에 Jest + Enzyme를 연결하는 부분이 오래 걸렸습니다.
