# 쿠팡 스타일 고객상담기록관리시스템 (CRM Lite)
![MainVisual](<img width="1920" height="1261" alt="Image" src="https://github.com/user-attachments/assets/278c0078-61b1-43a5-a1e3-941d7fe615e3" />)
### Before & After

| Before | After |
|--------|-------|
| 비포이미지 | 애프터이미지 |
## Link
-바로가기(web-site) : 링크
-기획서(fidma-slide) : 링크
-디자인시안(figma) : 링크 

## 제품 개요
CRM Lite는 쿠팡 고객센터 상담원이 사용하는 내부 상담 기록 관리 시스템입니다.  
고객 정보/상담 기록/업무 상태를 **실시간으로 통합 관리**하고, 상담 흐름에 맞는 **필터링·정렬·우선순위·상태 관리**를 제공하여 업무 생산성을 높입니다.

- 대상: 고객센터 상담원/슈퍼바이저
- 목적: 상담 이력 통합, 처리 상태 가시화, 클레임 관리, 내부 정책 공유
- 특징: **실무형 UI/데이터 구조**, **모듈 분리**, **업무 흐름 기반 화면 구성**

## 실행 환경
- 최신 Chrome / Edge
- **로컬 서버 없이도 실행 가능** (모듈 없이 전역 스크립트 로드)
- 로컬 서버 실행 시 JSON 실데이터 로드 가능

## 실행 방법
### 1) 로컬 파일로 실행 (권장)
- `index.html` 더블클릭 → 바로 실행

### 2) 로컬 서버 실행 (JSON 원본 사용)
Windows PowerShell 예시:
```
python -m http.server 5500
```
브라우저 접속:
```
http://localhost:5500/index.html
```

## 핵심 기능
### 고객 관리
- 고객 목록 테이블 + 실시간 검색 (이름/고객번호)
- 고객 상세 패널 (등급/누적 구매/선호 채널/상태 등)
- 선택 고객 기준 상담 기록 로딩

### 상담 기록 관리
- 상담 기록 등록/수정 (유형/상태/채널/우선순위/메모)
- **상담 등록 시 팝업**: 고객 성향/환불 사유/특이사항 입력
- 최근 상담 강조 표시 (최근 7일)
- 날짜 기준 정렬 (최신/오래된 순)
- 메모 접기/펼치기

### 업무 편의 기능
- 상담 유형/처리 상태 필터링
- 상태별 배지 색상 UI
- 데이터 없음/오류 UI 처리
- 근무 종료 버튼 알림
- 로고 클릭 시 홈(대시보드) 이동

### 관리 탭
- 상담 대시보드
- 고객 이력 분석 (고객 지표/지역 분포/상담 유형 분포)
- 클레임 처리 현황 (유형별 처리 상태/진행 중 클레임)
- 정책/FAQ
- 시스템 공지

## 상담 업무 흐름
1. 고객 검색 → 고객 선택
2. 상담 기록 확인
3. 상담 등록 버튼 클릭 → 팝업으로 내부 기록 입력
4. 상담 저장 → 목록 반영
5. 필터/정렬로 처리 상태 관리
6. 후속 일정/상태 업데이트

## 데이터 구조
### 고객 데이터 (`/data/customers.json`)
- `customers` 배열에 고객 단위 객체 저장
- 확장 가능한 구조: 기본 정보 + 이용 정보 + 동의/태그/메모
- 주요 필드:
  - `id`, `name`, `customerNo`, `phone`, `email`
  - `grade`, `vipLevel`, `accountStatus`
  - `totalOrders`, `totalSpend`, `preferredContact`
  - `consent`, `tags`, `notes`

### 상담 데이터 (`/data/consultations.json`)
- `consultations` 배열에 상담 단위 객체 저장
- 상담 유형/상태/채널/우선순위, 담당자, 티켓/주문 정보 포함
- 주요 필드:
  - `id`, `customerId`, `ticketNo`, `orderId`
  - `type`, `status`, `priority`, `channel`
  - `summary`, `memo`, `tags`, `resolutionCode`
  - `agent`, `createdAt`, `updatedAt`, `followUpAt`

### Fallback 데이터 (`/js/data/fallbackData.js`)
- 로컬 파일 실행 시에도 동작하도록 내장된 데이터
- 고객/상담 모두 실무형 시나리오로 구성
- `loadInitialData` 실패 시 자동 적용

## 화면/레이아웃 구성
- **사이드바 + 메인 콘텐츠**
- **카드 + 테이블 혼합 레이아웃**
- 상태 배지/필터/검색/폼/팝업 구성
- 업무용 대시보드 스타일 (쿠팡 내부 시스템 톤)

## 파일 구조
```
/
├─ index.html
├─ css/
│  ├─ base.css
│  ├─ layout.css
│  ├─ components.css
│  └─ themes.css
├─ data/
│  ├─ customers.json
│  └─ consultations.json
├─ js/
│  ├─ boot.js
│  ├─ app.js
│  ├─ data/
│  │  ├─ dataLoader.js
│  │  └─ fallbackData.js
│  ├─ state/
│  │  └─ store.js
│  ├─ customer/
│  │  ├─ customerService.js
│  │  └─ customerUI.js
│  ├─ consult/
│  │  ├─ consultService.js
│  │  ├─ consultUI.js
│  │  └─ consultForm.js
│  ├─ ui/
│  │  ├─ filters.js
│  │  ├─ metrics.js
│  │  ├─ analytics.js
│  │  └─ claims.js
│  └─ utils/
│     ├─ dom.js
│     ├─ date.js
│     └─ format.js
└─ assets/
```

## 운영 팁
- 로컬 파일 실행 시: fallback 데이터 사용
- 로컬 서버 실행 시: `/data/*.json` 실데이터 사용
- 상담 등록 시 팝업 입력 필수 항목: **고객 성향**

## 확장 계획 (옵션)
- 상담 대기열/재배정 기능
- SLA 기반 지연 알림
- 고객 이력 타임라인
- 업무량/상담 생산성 리포트
