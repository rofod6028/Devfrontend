import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const BASE_URL = 'https://devbackend-i7t6.onrender.com/api';

// ✨ 1. 사번 명단 정의 (App 함수 밖 상단에 배치)
const USER_MAP = {
  "225298": "김양섭",
  "219153": "조재빈",
  "223091": "이재성",
  "226069": "강현준",
  "219149": "가왕현",
  "214161": "유태현",
  "217024": "이용현",
  "218105": "김동우",
  "215212": "박일구",
  "225207": "이정무",
  "225245": "조윤수",
  "223100": "김회준",
  "211067": "김욱재"
  // 필요한 만큼 사번: "이름" 형태로 추가하세요.
};

// ============================================================
// 부품종류별 아이콘 — 키워드 매칭 방식
// 새로운 부품종류가 Excel에 추가돼도 자동으로 어울리는 아이콘이 붙습니다.
// ============================================================
function getPartIcon(name = '') {
  const n = name.trim().toLowerCase();

  // 베어링
  if (n.includes('베어링') || n.includes('bearing')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="17" />
      <circle cx="24" cy="24" r="7" />
      {[0,60,120,180,240,300].map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        const mx = 24 + 12 * Math.cos(r), my = 24 + 12 * Math.sin(r);
        return <circle key={i} cx={mx} cy={my} r="2.2" fill="currentColor" stroke="none" />;
      })}
    </svg>
  );

  // 오일·윤활·그리스
  if (n.includes('오일') || n.includes('윤활') || n.includes('그리스') || n.includes('oil')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="6" width="20" height="30" rx="5" />
      <line x1="14" y1="14" x2="34" y2="14" />
      <line x1="17" y1="20" x2="31" y2="20" />
      <line x1="17" y1="25" x2="29" y2="25" />
      <path d="M20 36 Q24 44 28 36" strokeDasharray="none" />
    </svg>
  );

  // 필터
  if (n.includes('필터') || n.includes('filter')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 10h32l-12 14v12l-8-4V24Z" />
    </svg>
  );

  // 벨트·체인
  if (n.includes('벨트') || n.includes('체인') || n.includes('belt') || n.includes('chain')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="24" r="7" />
      <circle cx="37" cy="24" r="7" />
      <line x1="11" y1="17" x2="37" y2="17" />
      <line x1="11" y1="31" x2="37" y2="31" />
      <circle cx="24" cy="17" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="24" cy="31" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );

  // 패킹·씰·오링·가스켓
  if (n.includes('패킹') || n.includes('씰') || n.includes('오링') || n.includes('가스켓') || n.includes('seal') || n.includes('o-ring')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="24" cy="28" rx="15" ry="6" />
      <ellipse cx="24" cy="22" rx="15" ry="6" />
      <line x1="9" y1="22" x2="9" y2="28" />
      <line x1="39" y1="22" x2="39" y2="28" />
    </svg>
  );

  // 볼트·너트·나사·스크류
  if (n.includes('볼트') || n.includes('너트') || n.includes('나사') || n.includes('스크류') || n.includes('bolt') || n.includes('nut') || n.includes('screw')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="24,5 31,11 31,19 24,23 17,19 17,11" />
      <line x1="24" y1="23" x2="24" y2="43" />
      <line x1="19" y1="28" x2="29" y2="28" />
      <line x1="19" y1="33" x2="29" y2="33" />
      <line x1="19" y1="38" x2="29" y2="38" />
    </svg>
  );

  // 감속기·기어박스
  if (n.includes('감속기') || n.includes('기어박스') || n.includes('reducer')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="14" width="15" height="20" rx="2" />
      <rect x="27" y="10" width="15" height="28" rx="2" />
      <circle cx="13.5" cy="24" r="4" />
      <circle cx="34.5" cy="24" r="6" />
      <line x1="21" y1="19" x2="27" y2="19" />
      <line x1="21" y1="29" x2="27" y2="29" />
    </svg>
  );

  // 기어·치차
  if (n.includes('기어') || n.includes('치차') || n.includes('gear')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="8" />
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return <line key={i} x1={24 + 8*Math.cos(r)} y1={24 + 8*Math.sin(r)} x2={24 + 13*Math.cos(r)} y2={24 + 13*Math.sin(r)} strokeWidth="4" strokeLinecap="square" />;
      })}
    </svg>
  );

  // 센서·감지
  if (n.includes('센서') || n.includes('감지') || n.includes('sensor') || n.includes('detector')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="16" y="20" width="16" height="18" rx="3" />
      <circle cx="24" cy="29" r="3" fill="currentColor" stroke="none" />
      <path d="M10 14 Q24 6 38 14" />
      <path d="M13 19 Q24 13 35 19" />
    </svg>
  );

  // 실린더·에어실린더·유압실린더
  if (n.includes('실린더') || n.includes('cylinder')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="16" width="24" height="16" rx="3" />
      <line x1="34" y1="24" x2="42" y2="24" />
      <line x1="6" y1="24" x2="10" y2="24" />
      <line x1="18" y1="16" x2="18" y2="32" strokeDasharray="3 2" />
    </svg>
  );

  // 솔레노이드·솔밸브·밸브
  if (n.includes('솔밸브') || n.includes('솔레노이드') || n.includes('밸브') || n.includes('valve') || n.includes('solenoid')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="24" x2="42" y2="24" />
      <polygon points="20,16 28,16 28,32 20,32" />
      <line x1="24" y1="10" x2="24" y2="16" />
      <rect x="20" y="7" width="8" height="4" rx="1" />
    </svg>
  );

  // 릴레이·전자접촉기·마그넷
  if (n.includes('릴레이') || n.includes('relay') || n.includes('전자접촉기') || n.includes('마그넷') || n.includes('contactor')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="12" y="10" width="24" height="28" rx="3" />
      <line x1="18" y1="10" x2="18" y2="6" />
      <line x1="24" y1="10" x2="24" y2="6" />
      <line x1="30" y1="10" x2="30" y2="6" />
      <line x1="18" y1="38" x2="18" y2="42" />
      <line x1="30" y1="38" x2="30" y2="42" />
      <rect x="17" y="18" width="14" height="12" rx="2" />
    </svg>
  );

  // 모터·전동기
  if (n.includes('모터') || n.includes('전동기') || n.includes('motor')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="14" width="26" height="20" rx="4" />
      <line x1="34" y1="24" x2="42" y2="24" />
      <circle cx="21" cy="24" r="5" />
      <line x1="8" y1="20" x2="4" y2="18" />
      <line x1="8" y1="28" x2="4" y2="30" />
    </svg>
  );

  // 펌프
  if (n.includes('펌프') || n.includes('pump')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="26" r="12" />
      <path d="M24 14 Q30 8 36 8" />
      <path d="M36 8 L36 14" />
      <path d="M12 26 Q6 26 6 20" />
      <circle cx="24" cy="26" r="4" />
    </svg>
  );

  // 계장·압력계·유량계·온도계·게이지
  if (n.includes('계장') || n.includes('압력계') || n.includes('유량계') || n.includes('온도계') || n.includes('게이지') || n.includes('gauge') || n.includes('meter')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 37 a16 16 0 1 1 30 0" />
      <line x1="24" y1="37" x2="32" y2="22" strokeWidth="2" />
      <circle cx="24" cy="37" r="2.5" fill="currentColor" stroke="none" />
      <line x1="11" y1="31" x2="14" y2="28" />
      <line x1="37" y1="31" x2="34" y2="28" />
      <line x1="24" y1="21" x2="24" y2="24" />
    </svg>
  );

  // 스프링·용수철
  if (n.includes('스프링') || n.includes('용수철') || n.includes('spring')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="24" y1="6" x2="24" y2="10" />
      <path d="M16 10 Q32 10 32 16 Q32 22 16 22 Q16 28 32 28 Q32 34 16 34 Q16 40 32 40" />
      <line x1="24" y1="40" x2="24" y2="44" />
    </svg>
  );

  // 호스·튜브·파이프
  if (n.includes('호스') || n.includes('튜브') || n.includes('파이프') || n.includes('hose') || n.includes('tube') || n.includes('pipe')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 18 Q8 10 16 10 L32 10 Q40 10 40 18 L40 30 Q40 38 32 38 L16 38 Q8 38 8 30 Z" />
      <path d="M14 18 Q14 16 16 16 L32 16 Q34 16 34 18 L34 30 Q34 32 32 32 L16 32 Q14 32 14 30 Z" />
    </svg>
  );

  // 전기·전선·케이블·퓨즈·브레이커
  if (n.includes('전선') || n.includes('케이블') || n.includes('퓨즈') || n.includes('브레이커') || n.includes('cable') || n.includes('fuse') || n.includes('breaker')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M27 6 L20 22 H26 L19 42 L36 20 H28 Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M27 6 L20 22 H26 L19 42 L36 20 H28 Z" />
    </svg>
  );

  // 롤러·로울러
  if (n.includes('롤러') || n.includes('로울러') || n.includes('roller')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="24" cy="24" rx="8" ry="16" />
      <line x1="16" y1="24" x2="8" y2="24" />
      <line x1="32" y1="24" x2="40" y2="24" />
      <line x1="24" y1="8" x2="24" y2="10" />
      <line x1="24" y1="38" x2="24" y2="40" />
    </svg>
  );

  // 기타 / 매칭 없음
  return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="32" height="32" rx="5" />
      <line x1="16" y1="20" x2="32" y2="20" />
      <line x1="16" y1="28" x2="26" y2="28" />
      <circle cx="32" cy="32" r="5" />
      <line x1="30" y1="32" x2="34" y2="32" />
      <line x1="32" y1="30" x2="32" y2="34" />
    </svg>
  );
}

// ============================================================
// 설비명별 아이콘 — 키워드 매칭 방식
// ============================================================
function getFacilityIcon(name = '') {
  const n = name.trim().toLowerCase();

  // 충전기 (립스틱·틴트·파운데이션 등)
  if (n.includes('충전기') || n.includes('충전')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* 립스틱 튜브 */}
      <rect x="17" y="26" width="14" height="16" rx="2" />
      <path d="M19 26 Q24 14 29 26" />
      <line x1="17" y1="31" x2="31" y2="31" strokeDasharray="3 2" />
      {/* 충전 노즐 */}
      <line x1="8" y1="22" x2="17" y2="28" />
      <circle cx="7" cy="21" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );

  // 프레스·타정기
  if (n.includes('프레스') || n.includes('press') || n.includes('타정')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* 프레임 */}
      <rect x="10" y="6" width="28" height="6" rx="2" />
      <line x1="12" y1="12" x2="12" y2="40" />
      <line x1="36" y1="12" x2="36" y2="40" />
      <line x1="12" y1="40" x2="36" y2="40" />
      {/* 프레스 헤드 */}
      <rect x="18" y="14" width="12" height="8" rx="1" />
      <line x1="24" y1="22" x2="24" y2="30" />
      {/* 다이 */}
      <ellipse cx="24" cy="34" rx="8" ry="3" />
      {/* 화살표 */}
      <polyline points="21,26 24,30 27,26" />
    </svg>
  );

  // 컨베이어·이송기
  if (n.includes('컨베이어') || n.includes('conveyor') || n.includes('이송')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="20" x2="42" y2="20" />
      <line x1="6" y1="28" x2="42" y2="28" />
      <circle cx="10" cy="24" r="6" />
      <circle cx="38" cy="24" r="6" />
      <rect x="16" y="16" width="8" height="8" rx="1" />
      <rect x="27" y="16" width="8" height="8" rx="1" />
      <polyline points="35,22 39,24 35,26" fill="currentColor" />
    </svg>
  );

  // 믹서·교반기·혼합기
  if (n.includes('믹서') || n.includes('교반') || n.includes('혼합') || n.includes('mixer') || n.includes('agitator')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 12 Q14 38 24 40 Q34 38 34 12" />
      <ellipse cx="24" cy="12" rx="10" ry="3" />
      <line x1="24" y1="12" x2="24" y2="34" />
      <path d="M16 22 Q24 18 32 22" />
      <path d="M16 28 Q24 24 32 28" />
    </svg>
  );

  // 포장기·씰링기
  if (n.includes('포장') || n.includes('씰링') || n.includes('sealing') || n.includes('packing')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="16" width="28" height="20" rx="2" />
      <polyline points="10,24 24,32 38,24" />
      <line x1="24" y1="8" x2="24" y2="16" />
      <line x1="18" y1="11" x2="30" y2="11" />
    </svg>
  );

  // 펌프
  if (n.includes('펌프') || n.includes('pump')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="28" r="12" />
      <circle cx="24" cy="28" r="5" />
      <line x1="24" y1="16" x2="24" y2="10" />
      <line x1="10" y1="28" x2="6" y2="28" />
      <path d="M30 14 Q36 8 38 8 L38 14" />
    </svg>
  );

  // 로봇·암
  if (n.includes('로봇') || n.includes('robot') || n.includes('arm')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="18" y="36" width="12" height="6" rx="2" />
      <line x1="24" y1="36" x2="24" y2="28" />
      <line x1="24" y1="28" x2="34" y2="20" />
      <line x1="34" y1="20" x2="40" y2="26" />
      <circle cx="24" cy="28" r="3" />
      <circle cx="34" cy="20" r="3" />
      <line x1="38" y1="28" x2="42" y2="24" />
    </svg>
  );

  // 오븐·건조기·히터
  if (n.includes('오븐') || n.includes('건조') || n.includes('히터') || n.includes('oven') || n.includes('dryer') || n.includes('heater')) return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="10" width="32" height="28" rx="3" />
      <rect x="13" y="15" width="22" height="14" rx="2" />
      <circle cx="14" cy="33" r="2" />
      <circle cx="24" cy="33" r="2" />
      <circle cx="34" cy="33" r="2" />
      <line x1="18" y1="19" x2="30" y2="19" strokeDasharray="3 2" />
      <line x1="18" y1="23" x2="30" y2="23" strokeDasharray="3 2" />
    </svg>
  );

  // 기본 (매칭 없음) — 공장 기계 범용 아이콘
  return (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="28" width="36" height="14" rx="2" />
      <rect x="14" y="18" width="10" height="10" rx="1" />
      <rect x="28" y="14" width="10" height="14" rx="1" />
      <line x1="6" y1="28" x2="6" y2="42" />
      <line x1="42" y1="28" x2="42" y2="42" />
      <circle cx="14" cy="38" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="34" cy="38" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ============================================================
// App (루트 컴포넌트)
// ============================================================
function App() {
  const [page, setPage] = useState('main');
  const [highlightId, setHighlightId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userName, setUserName] = useState('');
  const [inventoryData, setInventoryData] = useState([]);
  const [facilityLists, setFacilityLists] = useState({ 충전: [], 타정: [], all: [] }); // { 충전:[...], 타정:[...], all:[...] }
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [dashboardFacility, setDashboardFacility] = useState(null);
  

  // ============================================================
  // 토스트 메시지
  // ============================================================
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  // ============================================================
  // 로그아웃 — 저장된 사번 인증 정보를 지우고 새로고침(재인증 유도)
  // ============================================================
  const handleLogout = () => {
    if (window.confirm(`${userName}님, 로그아웃하시겠습니까?`)) {
      localStorage.removeItem('inventory_user');
      window.location.reload();
    }
  };

  // ============================================================
  // 알림 항목 → 해당 부품으로 바로 이동 (공통 시트 전체 목록에서 하이라이트)
  // ============================================================
  const navigateToItem = (item) => {
    setHighlightId(item.id);
    setDetailItems(inventoryData);
    setSelectedSheet('공통');
    setSelectedCategory('공통');
    setPage('detail');
  };

  // ✨ 알림 체크 (앱 시작 및 주기적)
   useEffect(() => {
    // ✨ 이전에는 prompt()(동기/블로킹 함수)로 사번 인증이 끝날 때까지
    //    loadCategories()/loadAlerts() 호출 자체가 미뤄졌다. prompt 창이 떠 있는 동안은
    //    브라우저가 완전히 멈추므로, 사용자가 사번 입력을 마칠 때까지 데이터 요청이
    //    아예 시작되지 않아 체감 로딩 시간이 늘어나는 원인이 됐다.
    //    인증 여부와 무관하게 데이터 로딩은 먼저 시작해, 인증 완료 시점엔
    //    이미 응답이 와 있거나 곧 도착하도록 한다.
    loadCategories();
    loadAlerts();

    const savedName = localStorage.getItem('inventory_user');
    
    if (savedName && Object.values(USER_MAP).includes(savedName)) {
      setUserName(savedName);
    } else {
      // ✨ 2. 사번 인증이 완료될 때까지 무한 반복 (보안 차단)
      let authenticatedName = null;
      
      while (!authenticatedName) {
        const inputId = prompt("🔑 보안 인증: 사번을 입력하세요.\n(등록된 사용자만 접속 가능합니다)");
        
        if (inputId === null) {
          // 취소를 누르면 페이지를 하얗게 비우거나 경고창을 띄움
          alert("인증 없이는 이용할 수 없습니다. 페이지를 새로고침하세요.");
          document.body.innerHTML = "<h1 style='text-align:center; margin-top:200px;'>🔒 인증이 필요합니다.</h1>";
          return;
        }

        if (USER_MAP[inputId]) {
          authenticatedName = USER_MAP[inputId];
          alert(`✅ 인증 성공: ${authenticatedName}님 환영합니다.`);
        } else {
          alert("❌ 등록되지 않은 사번입니다.");
        }
      }

      setUserName(authenticatedName);
      localStorage.setItem('inventory_user', authenticatedName);
    }
  }, []);

  // 1. 메인에서 공정(시트) 클릭 시 실행
  // 설비 카드 목록 = 백엔드가 충전/타정 시트(적용설비 목록 전용)에서 추출해 내려주는 facilityLists 기준
  const handleSheetClick = (sheetName) => {
    setSelectedSheet(sheetName);
    const uniqueFacilities = [...new Set(facilityLists[sheetName] || [])].sort();
    setFacilities(uniqueFacilities);
    setPage('facility'); // 설비 선택 페이지로 이동
  };

  // 2. 설비 페이지에서 특정 설비 클릭 시 실행 → 이력/분석 대시보드로 바로 이동 (재고 목록은 노출 안 함)
  const handleFacilityClick = (facilityName) => {
    setSelectedCategory(facilityName); // 상세페이지 제목으로 표시
    setDashboardFacility(facilityName);
    setPage('facilityDashboard'); // 설비 대시보드로 이동
  };

  // 3. 메인에서 "공통" 카드 클릭 시 실행 → "~관련" 카테고리 선택 화면으로 이동
  const handleSparePartClick = () => {
    setSelectedSheet('공통');
    setPage('commonCategory');
  };

  // 3-1. 카테고리 선택 화면에서 특정 "~관련" 카테고리 클릭 시 실행 → 해당 카테고리 부품 리스트로 이동
  const handleCommonCategoryClick = (categoryName) => {
    const filtered = inventoryData.filter(item => (item.대분류 || '미분류') === categoryName);
    setSelectedSheet('공통');
    setDetailItems(filtered);
    setSelectedCategory(categoryName);
    setPage('detail');
  };

  // ✨ 브라우저 알림 권한 요청
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  async function loadCategories() {
  try {
    setLoading(true);
    console.log('📡 /api/inventory 데이터 로드 중...');
    // 💡 변경: 가공된 카테고리가 아니라 전체 리스트(/inventory)를 가져옵니다.
    const res = await axios.get(`${BASE_URL}/inventory`); 
    const allData = res.data.data;
    
    console.log(`✅ /api/inventory 응답 받음: ${allData.length}건`);
    console.log('   응답 데이터:');
    allData.slice(0, 3).forEach(item => {
      console.log(`   - ${item.원본시트} / ${item.부품종류} / ${item.모델명}`);
    });
    
    setInventoryData(allData); // 전체 데이터 저장
    setFacilityLists(res.data.facilityLists || { 충전: [], 타정: [], all: [] }); // 설비 목록(카드용) 저장
    
    // (기존 요약 기능 등을 위해 필요하다면 아래처럼 활용 가능)
    // setCategories(res.data.categories); 
  } catch (err) {
    console.error('❌ 데이터 로드 실패:', err.message);
    console.error('   백엔드 URL:', BASE_URL);
    console.error('   전체 에러:', err);
    setError('데이터 로드 실패');
  } finally {
    setLoading(false);
  }
}

  // ✨ 알림 로드 및 브라우저 푸시
  async function loadAlerts() {
    try {
      const res = await axios.get(`${BASE_URL}/inventory/alerts`);
      const newAlerts = res.data.data;
      setAlerts(newAlerts);

      // 긴급 알림 (재고 0) 브라우저 푸시
      if ('Notification' in window && Notification.permission === 'granted') {
        const criticalAlerts = newAlerts.filter(a => a.최소보유수량 > 0 && a.긴급도 === 'critical');
        if (criticalAlerts.length > 0) {
          new Notification('⚠️ 긴급 재고 부족', {
            body: `${criticalAlerts.length}개 품목의 재고가 완전 소진되었습니다!`,
            icon: '/favicon.ico',
            tag: 'inventory-critical'
          });
        }
      }
    } catch (err) {
      // ⚠️ 알림 엔드포인트가 없으면 무시 (임시 처리)
      console.warn('알림 시스템 미사용 중:', err.message);
      setAlerts([]);
    }
  }

  async function handleCategoryClick(categoryName) {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/inventory/category/${encodeURIComponent(categoryName)}`);
      setDetailItems(res.data.data);
      setSelectedCategory(categoryName);
      setPage('detail');
    } catch (err) {
      setError('상세 데이터를 로드하는 데 문제가 있습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function loadSummary() {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/inventory/summary`);
      setSummary(res.data.data);
      setPage('summary');
    } catch (err) {
      setError('요약 데이터를 로드하는 데 문제가 있습니다.');
    } finally {
      setLoading(false);
    }
  }

  // ✨ 검색 기능
  async function handleSearch(query) {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const res = await axios.get(`${BASE_URL}/inventory/search?q=${encodeURIComponent(query)}`);
      setSearchResults(res.data.data);
    } catch (err) {
      console.error('검색 실패:', err);
      setSearchResults([]);
    }
  }

  // ✨ 재고 업데이트 후 데이터 새로고침
  async function refreshData() {
    const res = await axios.get(`${BASE_URL}/inventory`);
    const allData = res.data.data;
    setInventoryData(allData);
    setFacilityLists(res.data.facilityLists || { 충전: [], 타정: [], all: [] });
    await loadAlerts();
    if (page === 'detail') {
      // detail 페이지는 항상 공통 시트 전체 목록을 보여준다
      setDetailItems(allData);
    }
  }

  const renderPage = () => {
  if (loading) return <div className="loading-spinner"><div className="spinner"></div><p>로드 중...</p></div>;

  switch (page) {
    case 'commonCategory': // 공통 탭: "~관련" 카테고리 선택 화면
      return (
        <CommonCategoryPage
          inventoryData={inventoryData}
          onCategoryClick={handleCommonCategoryClick}
          onBack={() => setPage('main')}
        />
      );

    case 'detail': // 부품 리스트 및 수정 (선택한 카테고리의 부품 목록)
      return (
        <DetailPage
          items={detailItems}
          categoryName={selectedCategory}
          onBack={() => setPage(selectedSheet === '공통' ? 'commonCategory' : 'facilityDashboard')}
          onUpdate={refreshData}
          userName={userName}
          highlightId={highlightId}
          showToast={showToast}
          isCommonSheet={true}
          inventoryData={inventoryData}
          facilityLists={facilityLists}
        />
      );

    case 'facilityDashboard': // 설비 대시보드 (소모분석 + 이력 + 부품 검색/출고)
      return (
        <FacilityDashboardPage
          facilityName={dashboardFacility}
          inventoryData={inventoryData}
          onBack={() => setPage('facility')}
          onUpdate={refreshData}
          userName={userName}
          showToast={showToast}
        />
      );

    case 'facility': // 2단계: 공정 내 설비 목록 선택 화면
      return (
        <FacilityPage
          selectedSheet={selectedSheet}
          facilities={facilities}
          onFacilityClick={handleFacilityClick}
          onBack={() => setPage('main')}
        />
      );

    case 'summary':
      return <SummaryPage summary={summary} onBack={() => setPage('main')} onNavigateToItem={navigateToItem} />;
    
    case 'logs':
      return <LogsPage onBack={() => setPage('main')} inventoryData={inventoryData} facilityLists={facilityLists} />;

    case 'usageSummary':
      return <UsageSummaryPage onBack={() => setPage('main')} />;

    default: // 1단계: 메인화면 (공통 + 공정별 설비 목록)
        return (
          <MainPage
            facilityLists={facilityLists}
            inventoryData={inventoryData}
            userName={userName}
            showToast={showToast}
            onDataRefresh={loadCategories}
            onSheetClick={handleSheetClick}
            onSparePartClick={handleSparePartClick}
            onUsageSummaryClick={() => setPage('usageSummary')}
            onSummaryClick={loadSummary}
            alerts={alerts}
            onSearch={handleSearch}
            searchResults={searchResults}
            isSearching={isSearching}
            onSearchResultClick={(item) => {
              setHighlightId(item.id);
              // 부품 검색 결과 클릭 시 공통 시트 전체 목록에서 해당 부품을 하이라이트
              setDetailItems(inventoryData);
              setSelectedSheet('공통');
              setSelectedCategory('공통');
              setPage('detail');
              setSearchResults([]);
              setIsSearching(false);
            }}
          />
        );
    }
  };

  return (
    <div className="app-root">
      <header className="top-nav">
        <div className="nav-left">
          <button className="nav-logo" onClick={() => { setPage('main'); setSearchResults([]); setIsSearching(false); }}>
            <svg viewBox="0 0 28 28" width="24" height="24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="10" height="10" rx="2" />
              <rect x="16" y="2" width="10" height="10" rx="2" />
              <rect x="2" y="16" width="10" height="10" rx="2" />
              <rect x="16" y="16" width="10" height="10" rx="2" />
            </svg>
            <span>Smart Inventory</span>
          </button>
          {/* ✨ 3. 현재 로그인 사용자 표시 */}
          <div className="user-badge-main">
            <span className="dot-online"></span>
            {userName}님 접속 중
          </div>
        </div>
        <div className="nav-right">
          {/* ✨ 알림 아이콘 */}
          {alerts.length > 0 && (
            <button className="nav-btn alert-btn" onClick={loadSummary} title={`${alerts.length}개 재고 부족`}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span className="alert-badge">{alerts.length}</span>
            </button>
          )}
          <button className="nav-btn" onClick={() => setPage('logs')}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            <span>이력</span>
          </button>
          <button className="nav-btn summary-btn" onClick={loadSummary}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>전체 요약</span>
          </button>
          <button className="nav-btn logout-btn" onClick={handleLogout} title="로그아웃">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>로그아웃</span>
          </button>
        </div>
      </header>

      <main className="main-content">
        {error && <div className="error-bar">{error}</div>}
        {renderPage()}
      </main>

      <AIChatBar onInventoryUpdate={refreshData} showToast={showToast} />

      {/* 토스트 메시지 컨테이너 */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'} {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

const processIcons = {
  '충전': (
    <svg viewBox="0 0 64 64" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#fff0f3"/>
      {/* 립스틱 튜브 본체 */}
      <rect x="22" y="28" width="20" height="22" rx="3" fill="#f43f5e" opacity="0.15" stroke="#f43f5e" strokeWidth="2"/>
      {/* 립스틱 상단 불릿 */}
      <path d="M26 28 Q32 18 38 28" fill="#f43f5e" stroke="#f43f5e" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* 튜브 나사선 */}
      <line x1="22" y1="34" x2="42" y2="34" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2"/>
      {/* 충전 번개 아이콘 */}
      <path d="M29 42 L33 36 L31 36 L35 30 L27 38 L30 38 Z" fill="#f43f5e" stroke="none"/>
    </svg>
  ),
  '타정': (
    <svg viewBox="0 0 64 64" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#eff6ff"/>
      {/* 타정기 프레스 상단 */}
      <rect x="20" y="14" width="24" height="8" rx="3" fill="#2563eb" opacity="0.8"/>
      {/* 프레스 기둥 */}
      <rect x="29" y="22" width="6" height="10" rx="1" fill="#2563eb" opacity="0.6"/>
      {/* 파우더/팩트 원형 */}
      <ellipse cx="32" cy="40" rx="12" ry="5" fill="#2563eb" opacity="0.15" stroke="#2563eb" strokeWidth="2"/>
      <ellipse cx="32" cy="40" rx="7" ry="3" fill="#2563eb" opacity="0.3"/>
      {/* 압축 화살표 */}
      <path d="M20 32 L20 36 M24 30 L24 36 M44 32 L44 36 M40 30 L40 36" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  '유틸리티': (
    <svg viewBox="0 0 64 64" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#fefce8"/>
      {/* 파이프/배관 */}
      <path d="M16 20 H30 V34 H48" stroke="#ca8a04" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="16" cy="20" r="3" fill="#ca8a04"/>
      <circle cx="48" cy="34" r="3" fill="#ca8a04"/>
      {/* 밸브 */}
      <circle cx="30" cy="27" r="5" fill="#ca8a04" opacity="0.15" stroke="#ca8a04" strokeWidth="2"/>
      <line x1="26" y1="23" x2="34" y2="31" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round"/>
      {/* 전기 번개 (유틸리티=전기/공압/용수 등) */}
      <path d="M38 42 L44 34 L40 34 L46 26 L36 36 L40 36 Z" fill="#ca8a04" stroke="none"/>
      {/* 압력계 */}
      <circle cx="18" cy="46" r="8" fill="#ca8a04" opacity="0.1" stroke="#ca8a04" strokeWidth="2"/>
      <line x1="18" y1="46" x2="21" y2="41" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  '제조': (
    <svg viewBox="0 0 64 64" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#f0fdf4"/>
      {/* 믹싱 탱크 */}
      <path d="M16 24 Q16 44 32 46 Q48 44 48 24 L44 18 H20 Z" fill="#16a34a" opacity="0.12" stroke="#16a34a" strokeWidth="2" strokeLinejoin="round"/>
      {/* 탱크 상단 뚜껑 */}
      <ellipse cx="32" cy="18" rx="12" ry="4" fill="#16a34a" opacity="0.25" stroke="#16a34a" strokeWidth="1.5"/>
      {/* 교반기 축 */}
      <line x1="32" y1="18" x2="32" y2="38" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
      {/* 교반 날개 */}
      <path d="M22 30 Q32 26 42 30" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M22 35 Q32 31 42 35" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
      {/* 배출 밸브 */}
      <rect x="28" y="44" width="8" height="5" rx="2" fill="#16a34a" opacity="0.5"/>
    </svg>
  ),
  '공통': (
    <svg viewBox="0 0 64 64" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#f8fafc"/>
      {/* 기어 큰 것 */}
      <circle cx="26" cy="30" r="9" fill="none" stroke="#475569" strokeWidth="2.5"/>
      <circle cx="26" cy="30" r="4" fill="#475569" opacity="0.2"/>
      {/* 기어 톱니 */}
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 26 + 9 * Math.cos(rad);
        const y1 = 30 + 9 * Math.sin(rad);
        const x2 = 26 + 12.5 * Math.cos(rad);
        const y2 = 30 + 12.5 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#475569" strokeWidth="3" strokeLinecap="round"/>;
      })}
      {/* 작은 기어 */}
      <circle cx="42" cy="22" r="6" fill="none" stroke="#94a3b8" strokeWidth="2"/>
      <circle cx="42" cy="22" r="2.5" fill="#94a3b8" opacity="0.3"/>
      {[0,60,120,180,240,300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 42 + 6 * Math.cos(rad);
        const y1 = 22 + 6 * Math.sin(rad);
        const x2 = 42 + 8.5 * Math.cos(rad);
        const y2 = 22 + 8.5 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"/>;
      })}
      {/* 렌치 */}
      <path d="M36 36 L46 46" stroke="#475569" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="34" cy="34" r="3" fill="none" stroke="#475569" strokeWidth="2"/>
    </svg>
  ),
  '미분류': (
    <svg viewBox="0 0 64 64" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#fffbeb"/>
      <circle cx="32" cy="26" r="14" fill="none" stroke="#d97706" strokeWidth="2.5"/>
      <text x="32" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#d97706">?</text>
      <rect x="18" y="46" width="28" height="4" rx="2" fill="#d97706" opacity="0.4"/>
    </svg>
  )
};

// 2. 컴포넌트 시작 (onSheetClick으로 변경)
function MainPage({ onSheetClick, onSparePartClick, onUsageSummaryClick, facilityLists, inventoryData, userName, showToast, onDataRefresh, onSummaryClick, alerts, onSearch, searchResults, isSearching, onSearchResultClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [partModalMode, setPartModalMode] = useState(null); // null | 'add' | 'delete'

  // 설비 목록 응답(충전/타정 등)에서 'all'을 제외한 공정 시트 이름을 동적으로 추출
  const processSheets = Object.keys(facilityLists || {}).filter(k => k !== 'all').sort();

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="main-page">
      <div className="page-header">
        <h1>스페어파트 재고 관리</h1>
        <p className="page-subtitle">설비를 선택해 이력을 확인하거나, 공통 탭에서 재고를 관리하세요</p>
      </div>

      {/* ✨ 검색 바 (기존 유지) */}
      <div className="search-container">
        <div className="search-input-wrap">
          <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="모델명, 부품종류 검색..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => { setSearchQuery(''); onSearch(''); }}>✕</button>
          )}
        </div>

        {isSearching && searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(item => (
              <div key={item.id} className="search-result-item" onClick={() => { onSearchResultClick(item); setSearchQuery(''); }}>
                <div className="search-result-top">
                  <span className="search-result-category">{item.부품종류}</span>
                  <span className={`search-result-qty ${item.현재수량 <= item.최소보유수량 ? 'low' : ''}`}>{item.현재수량}개</span>
                </div>
                <div className="search-result-model">{item.모델명}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✨ 긴급 알림 배너 (기존 유지) */}
      {alerts.filter(a => a.최소보유수량 > 0 && a.긴급도 === 'critical').length > 0 && (
        <div className="alert-banner critical">
          <div className="alert-banner-icon">🚨</div>
          <div className="alert-banner-text"><strong>긴급!</strong> {alerts.filter(a => a.긴급도 === 'critical').length}개 품목 재고 소진</div>
          <button className="alert-banner-btn" onClick={onSummaryClick}>확인</button>
        </div>
      )}

      {/* ✨ 설비 공정 버튼 그리드 — 설비 목록(충전/타정) 기반 동적 목록, 맨 위에 배치 */}
      <div className="category-grid">
        {processSheets.map((sheet) => (
          <button
            key={sheet}
            className="category-card"
            onClick={() => onSheetClick(sheet)}
          >
            <div className="category-icon-wrap">
              {processIcons[sheet] || '🏭'}
            </div>
            <div className="category-label">{sheet}</div>
            <div className="category-meta">
              <span className="category-count">설비 이력 보기</span>
            </div>
          </button>
        ))}
      </div>

      {/* ✨ 공통(전체 재고 관리) + 전체 사용내역 요약 + 부품추가/삭제 — 한 줄에 나란히 배치해 한눈에 보이도록 */}
      <div className="common-row">
        <button
          className="category-card common-card"
          onClick={onSparePartClick}
          style={{ borderColor: '#2563eb' }}
        >
          <div className="category-icon-wrap">📦</div>
          <div className="category-label">공통</div>
          <div className="category-meta">
            <span className="category-count">전체 부품 재고 관리</span>
          </div>
        </button>

        <button
          className="category-card common-card"
          onClick={onUsageSummaryClick}
          style={{ borderColor: '#7c3aed' }}
        >
          <div className="category-icon-wrap">📊</div>
          <div className="category-label">사용내역 요약</div>
          <div className="category-meta">
            <span className="category-count">설비·부품별 통계</span>
          </div>
        </button>

        {/* 부품 추가 / 부품 삭제 — 수동 전용, AI 챗봇 미관여 */}
        <div className="part-manage-box">
          <button className="part-manage-btn part-manage-add" onClick={() => setPartModalMode('add')}>
            <span className="part-manage-icon">＋</span>
            <span>부품추가</span>
          </button>
          <button className="part-manage-btn part-manage-delete" onClick={() => setPartModalMode('delete')}>
            <span className="part-manage-icon">－</span>
            <span>부품삭제</span>
          </button>
        </div>
      </div>

      {partModalMode && (
        <PartManageModal
          mode={partModalMode}
          inventoryData={inventoryData}
          userName={userName}
          showToast={showToast}
          onDataRefresh={onDataRefresh}
          onClose={() => setPartModalMode(null)}
        />
      )}
    </div>
  );
}
// ============================================================
// ✨ 부품 추가 / 부품 삭제 모달 — 완전 수동 전용 (AI 챗봇 미관여)
// ============================================================
function PartManageModal({ mode, inventoryData, userName, showToast, onDataRefresh, onClose }) {
  // ---- 삭제 모드 상태 ----
  const [deleteQuery, setDeleteQuery] = useState('');
  const [selectedPart, setSelectedPart] = useState(null); // 검색해서 고른 부품
  const [confirmStep, setConfirmStep] = useState(false);  // "정말 삭제하시겠습니까?" 2차 확인 단계
  const [deleting, setDeleting] = useState(false);

  // ---- 추가 모드 상태 (최종수정시각 제외, 엑셀 헤더 그대로) ----
  const [form, setForm] = useState({
    대분류: '', 부품종류: '', 모델명: '', 적용설비: '',
    현재수량: '', 최소보유수량: '', 용도: '', 보관장소: ''
  });
  const [adding, setAdding] = useState(false);

  const normalize = (s) => String(s || '').toLowerCase().replace(/[\s\-_]+/g, '');
  const deleteResults = deleteQuery.trim()
    ? (inventoryData || []).filter(item => {
        const q = normalize(deleteQuery);
        return normalize(item.모델명).includes(q) ||
               normalize(item.적용설비).includes(q) ||
               normalize(item.부품종류).includes(q);
      }).slice(0, 30)
    : [];

  const handleFormChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleAddSubmit = async () => {
    if (!form.모델명.trim()) { showToast('모델명은 필수입니다.', 'error'); return; }
    if (!form.부품종류.trim()) { showToast('부품종류는 필수입니다.', 'error'); return; }

    if (!window.confirm(`"${form.모델명}" 부품을 새로 등록하시겠습니까?`)) return;

    try {
      setAdding(true);
      const res = await axios.post(`${BASE_URL}/inventory/add-part`, {
        ...form,
        현재수량: form.현재수량 === '' ? 0 : Number(form.현재수량),
        최소보유수량: form.최소보유수량 === '' ? 0 : Number(form.최소보유수량),
        user: userName
      });
      if (res.data.success) {
        showToast('부품이 등록되었습니다.', 'success');
        onDataRefresh && onDataRefresh();
        onClose();
      }
    } catch (err) {
      showToast(err.response?.data?.message || '등록 실패', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      const res = await axios.post(`${BASE_URL}/inventory/delete-part`, {
        id: selectedPart.id,
        user: userName
      });
      if (res.data.success) {
        showToast(`"${selectedPart.모델명}" 삭제 완료`, 'success');
        onDataRefresh && onDataRefresh();
        onClose();
      }
    } catch (err) {
      showToast(err.response?.data?.message || '삭제 실패', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="part-manage-modal" onClick={e => e.stopPropagation()}>
        <div className="part-manage-modal-header">
          <h3>{mode === 'add' ? '➕ 부품 추가' : '🗑️ 부품 삭제'}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {mode === 'add' && (
          <div className="part-manage-form">
            <label>대분류
              <input value={form.대분류} onChange={e => handleFormChange('대분류', e.target.value)} placeholder="예: 솔밸브류" />
            </label>
            <label>부품종류 <span className="required-mark">*</span>
              <input value={form.부품종류} onChange={e => handleFormChange('부품종류', e.target.value)} placeholder="예: 솔밸브" />
            </label>
            <label>모델명 <span className="required-mark">*</span>
              <input value={form.모델명} onChange={e => handleFormChange('모델명', e.target.value)} placeholder="예: SF4101-IP" />
            </label>
            <label>적용설비
              <input value={form.적용설비} onChange={e => handleFormChange('적용설비', e.target.value)} placeholder="예: 유성충전기 (1공장)" />
            </label>
            <div className="part-manage-form-row">
              <label>현재수량
                <input type="number" value={form.현재수량} onChange={e => handleFormChange('현재수량', e.target.value)} placeholder="0" />
              </label>
              <label>최소보유수량
                <input type="number" value={form.최소보유수량} onChange={e => handleFormChange('최소보유수량', e.target.value)} placeholder="0" />
              </label>
            </div>
            <label>용도
              <input value={form.용도} onChange={e => handleFormChange('용도', e.target.value)} placeholder="예: 내부 분전반 제어" />
            </label>
            <label>보관장소
              <input value={form.보관장소} onChange={e => handleFormChange('보관장소', e.target.value)} placeholder="예: 자재창고 A-3" />
            </label>

            <button className="part-manage-submit-btn add" onClick={handleAddSubmit} disabled={adding}>
              {adding ? '등록 중...' : '부품 등록'}
            </button>
          </div>
        )}

        {mode === 'delete' && !selectedPart && (
          <div className="part-manage-form">
            <input
              type="text"
              className="part-delete-search-input"
              placeholder="🔍 삭제할 부품의 모델명 또는 설비명 검색..."
              value={deleteQuery}
              onChange={e => setDeleteQuery(e.target.value)}
              autoFocus
            />
            <div className="part-delete-result-list">
              {deleteQuery.trim() && deleteResults.length === 0 && (
                <div className="part-delete-empty">검색 결과가 없습니다.</div>
              )}
              {deleteResults.map(item => (
                <div key={item.id} className="part-delete-result-item" onClick={() => setSelectedPart(item)}>
                  <div className="part-delete-result-top">
                    <span className="part-delete-result-model">{item.모델명}</span>
                    <span className={`part-delete-result-qty ${item.현재수량 <= item.최소보유수량 ? 'low' : ''}`}>{item.현재수량}개</span>
                  </div>
                  <div className="part-delete-result-sub">{item.부품종류} · {item.적용설비 || '설비 미지정'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === 'delete' && selectedPart && !confirmStep && (
          <div className="part-manage-form">
            <div className="part-delete-detail-card">
              <div className="part-delete-detail-row"><span>모델명</span><strong>{selectedPart.모델명}</strong></div>
              <div className="part-delete-detail-row"><span>부품종류</span><strong>{selectedPart.부품종류}</strong></div>
              <div className="part-delete-detail-row"><span>적용설비</span><strong>{selectedPart.적용설비 || '-'}</strong></div>
              <div className="part-delete-detail-row"><span>현재수량</span><strong>{selectedPart.현재수량}개</strong></div>
              <div className="part-delete-detail-row"><span>최소보유수량</span><strong>{selectedPart.최소보유수량}개</strong></div>
              <div className="part-delete-detail-row"><span>보관장소</span><strong>{selectedPart.보관장소 || '-'}</strong></div>
            </div>
            <p className="part-delete-warning">정말로 이 부품을 삭제하시겠습니까?</p>
            <div className="part-manage-form-row">
              <button className="part-manage-submit-btn cancel" onClick={() => setSelectedPart(null)}>다른 부품 검색</button>
              <button className="part-manage-submit-btn delete" onClick={() => setConfirmStep(true)}>삭제하기</button>
            </div>
          </div>
        )}

        {mode === 'delete' && selectedPart && confirmStep && (
          <div className="part-manage-form">
            <p className="part-delete-warning final">
              ⚠️ "{selectedPart.모델명}"({selectedPart.현재수량}개)를 삭제합니다.<br/>
              이 작업은 되돌릴 수 없습니다. 처리자: <strong>{userName || '미확인 사용자'}</strong>
            </p>
            <div className="part-manage-form-row">
              <button className="part-manage-submit-btn cancel" onClick={() => setConfirmStep(false)}>취소</button>
              <button className="part-manage-submit-btn delete" onClick={handleDeleteConfirm} disabled={deleting}>
                {deleting ? '삭제 중...' : '최종 삭제'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function FacilityPage({ selectedSheet, facilities, onFacilityClick, onBack }) {
  const [query, setQuery] = useState('');

  const normalize = (s) => String(s || '').toLowerCase().replace(/[\s\-_]+/g, '');
  const filtered = (facilities || []).filter(f => normalize(f).includes(normalize(query)));

  return (
    <div className="facility-page">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" />
          </svg>
          공정 선택으로
        </button>
        <div className="detail-category-header">
          <h2 className="main-cat-title">{selectedSheet} 공정</h2>
          <span className="sub-cat-badge">설비를 선택하세요</span>
        </div>
      </div>

      {/* 설비 검색창 */}
      <div className="search-input-wrap" style={{ position: 'relative', marginTop: '16px' }}>
        <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder={`${selectedSheet} 설비명 검색...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery('')}>✕</button>
        )}
      </div>

      <div style={{ fontSize: '0.7rem', color: '#9ca3af', textAlign: 'right', margin: '8px 2px 4px' }}>
        {filtered.length}개 설비{query ? ` (전체 ${facilities.length}개 중 검색)` : ''}
      </div>

      {/* 설비 목록 — 카드 그리드 대신 스캔하기 쉬운 리스트 형식 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {filtered.length > 0 ? (
          filtered.map((facility) => (
            <button
              key={facility}
              onClick={() => onFacilityClick(facility)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                width: '100%', textAlign: 'left', cursor: 'pointer',
                background: '#fff', border: '1px solid #eef0f3', borderRadius: '10px',
                padding: '10px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{
                width: '34px', height: '34px', borderRadius: '8px', background: '#f0f9ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0,
              }}>
                {getFacilityIcon(facility)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a1f2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {facility}
                </div>
              </div>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#9ca3af', fontSize: '0.85rem' }}>
            {facilities && facilities.length > 0 ? '검색 결과가 없습니다' : '⚠️ 등록된 설비가 없습니다'}
          </div>
        )}
      </div>
    </div>
  );
}
// ============================================================
// CommonCategoryPage (공통 탭 1단계 — "~관련" 카테고리 선택 화면)
// ============================================================
function CommonCategoryPage({ inventoryData, onCategoryClick, onBack }) {
  const categories = React.useMemo(() => {
    const map = {};
    (inventoryData || []).forEach(item => {
      const catName = item.대분류 || '미분류';
      if (!map[catName]) {
        map[catName] = { name: catName, itemCount: 0, lowStockCount: 0 };
      }
      map[catName].itemCount += 1;
      if (item.최소보유수량 > 0 && item.현재수량 <= item.최소보유수량) {
        map[catName].lowStockCount += 1;
      }
    });
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }, [inventoryData]);

  return (
    <div className="facility-page">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" />
          </svg>
          메인으로
        </button>
        <div className="detail-category-header">
          <h2 className="main-cat-title">공통 부품</h2>
          <span className="sub-cat-badge">카테고리를 선택하세요</span>
        </div>
      </div>

      <div className="category-grid" style={{ marginTop: '20px' }}>
        {categories.length > 0 ? (
          categories.map((cat) => (
            <button
              key={cat.name}
              className="category-card"
              onClick={() => onCategoryClick(cat.name)}
              style={{ minHeight: '110px' }}
            >
              <div className="category-icon-wrap" style={{ background: '#f0f9ff' }}>🔧</div>
              <div className="category-label" style={{ fontSize: '1.1rem' }}>{cat.name}</div>
              <div className="category-meta">
                <span className="category-count">
                  {cat.itemCount}개 품목{cat.lowStockCount > 0 ? ` · 부족 ${cat.lowStockCount}` : ''}
                </span>
              </div>
            </button>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#666' }}>
            <p>⚠️ 등록된 카테고리가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
// ============================================================
// DetailPage (카테고리 클릭 후 리스트 + ✨ 수동 수정 UI)
// ============================================================
function DetailPage({ items, categoryName, onBack, onUpdate, userName, highlightId, showToast, isCommonSheet, hideHeader, inventoryData, facilityLists }) { 
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  // 방안C: 공통부품 출고 시 설비 선택 팝업
  const [commonPopup, setCommonPopup] = useState(null); // { item, newQty, oldQty }
  const [selectedFacility, setSelectedFacility] = useState('');
  const [facilitySearch, setFacilitySearch] = useState('');
  const [showFacilityDropdown, setShowFacilityDropdown] = useState(false);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    if (!showFacilityDropdown) return;
    const handler = () => setShowFacilityDropdown(false);
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showFacilityDropdown]);

  // ✨ [추가] 검색된 부품 위치로 부드럽게 자동 스크롤하는 효과
  useEffect(() => {
    if (highlightId) {
      // 데이터가 렌더링될 시간을 조금 벌기 위해 0.1초 뒤 실행
      const timer = setTimeout(() => {
        const element = document.getElementById(`item-${highlightId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [highlightId, items]);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditValue(item.현재수량);
  };

  const handleSave = async (item) => {
    // 방안C: 공통부품 출고(수량 감소)인 경우 설비 선택 팝업 먼저 띄우기
    const isCommonPart = isCommonSheet || item.isCommonPart || String(item.적용설비 || '').includes('공통');
    const isOutgoing = editValue < item.현재수량;
    if (isCommonPart && isOutgoing) {
      setCommonPopup({ item, newQty: editValue, oldQty: item.현재수량 });
      setSelectedFacility('');
      setFacilitySearch('');
      setShowFacilityDropdown(false);
      return;
    }
    await doSave(item, editValue, item.현재수량, null);
  };

  const doSave = async (item, newQty, oldQty, facilityName) => {
    try {
      setIsSaving(true);
      const isCommonPart = isCommonSheet || item.isCommonPart || String(item.적용설비 || '').includes('공통');
      if (isCommonPart && facilityName) {
        // 공통부품 출고 — 전용 API 호출
        // 모델명/원본시트/적용설비를 함께 전송 → 서버에서 id 매칭 실패 시 fallback 검색에 사용
        await axios.post(`${BASE_URL}/inventory/common-update`, {
          id: item.id,
          모델명: item.모델명,
          원본시트: item.원본시트,
          적용설비: item.적용설비,
          현재수량: newQty,
          action: '출고',
          user: userName,
          실제사용설비: facilityName,
        });
      } else {
        await axios.post(`${BASE_URL}/inventory/manual-update`, {
          id: item.id,
          모델명: item.모델명,
          원본시트: item.원본시트,
          적용설비: item.적용설비,
          현재수량: newQty,
          action: newQty < oldQty ? '출고' : newQty > oldQty ? '입고' : '수량변경',
          user: userName,
        });
      }
      setEditingId(null);
      setCommonPopup(null);
      showToast('수량이 저장되었습니다.');
      await onUpdate();
    } catch (err) {
      showToast('저장 실패: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };


  const handleCancel = () => {
    setEditingId(null);
    setCommonPopup(null);
    setFacilitySearch('');
    setShowFacilityDropdown(false);
  };

  return (
    <div className="detail-page">
      {/* 방안C: 공통부품 출고 설비 선택 팝업 */}
      {commonPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '24px 20px',
            maxWidth: '360px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
          }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1a1f2e', marginBottom: '6px' }}>
              🏭 사용 설비 선택
            </div>
            <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '16px', lineHeight: 1.5 }}>
              <strong style={{ color: '#2563eb' }}>{commonPopup.item.모델명}</strong>은 공통 부품입니다.<br/>
              실제로 사용할 설비를 검색하거나 직접 입력해 주세요.
            </div>
            {/* 검색창 + 드롭다운 방식 */}
            {(() => {
              const facilityList = (
                Array.isArray(commonPopup.item.후보설비목록) && commonPopup.item.후보설비목록.length > 0
                  ? commonPopup.item.후보설비목록
                  : (facilityLists?.all || [])
              ).slice().sort();
              const filtered = facilityList.filter(f =>
                f.toLowerCase().includes(facilitySearch.toLowerCase())
              );
              // 문제4: 현재 입력값이 실제 설비 목록에 있는지 검증
              const isValidFacility = facilityList.includes(selectedFacility.trim());
              return (
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                      fontSize: '0.95rem', color: '#9ca3af', pointerEvents: 'none'
                    }}>🔍</span>
                    <input
                      type="text"
                      placeholder="설비명 검색 후 선택해 주세요..."
                      value={facilitySearch}
                      onChange={e => {
                        setFacilitySearch(e.target.value);
                        // 직접 입력 중엔 selectedFacility를 비워 검증 실패 처리
                        setSelectedFacility('');
                        setShowFacilityDropdown(true);
                      }}
                      onFocus={() => setShowFacilityDropdown(true)}
                      style={{
                        width: '100%', padding: '10px 12px 10px 34px',
                        borderRadius: showFacilityDropdown && filtered.length > 0 ? '8px 8px 0 0' : '8px',
                        border: `1.5px solid ${isValidFacility ? '#16a34a' : '#2563eb'}`,
                        fontSize: '0.88rem',
                        boxSizing: 'border-box', outline: 'none',
                        background: isValidFacility ? '#f0fdf4' : '#f8faff',
                      }}
                    />
                  </div>
                  {/* 드롭다운 목록 — 문제3: onClick 대신 onMouseDown으로 교체해 blur보다 먼저 실행 */}
                  {showFacilityDropdown && filtered.length > 0 && (
                    <div style={{
                      position: 'absolute', left: 0, right: 0, zIndex: 10,
                      background: '#fff',
                      border: '1.5px solid #2563eb', borderTop: 'none',
                      borderRadius: '0 0 8px 8px',
                      maxHeight: '180px', overflowY: 'auto',
                      boxShadow: '0 4px 16px rgba(37,99,235,0.10)',
                    }}>
                      {filtered.map((f, idx) => (
                        <div
                          key={f}
                          onMouseDown={e => {
                            // 문제3 핵심: preventDefault로 input blur 막고, 클릭 이벤트 선처리
                            e.preventDefault();
                            const cleaned = f.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
                            setSelectedFacility(cleaned);
                            setFacilitySearch(cleaned);
                            setShowFacilityDropdown(false);
                          }}
                          style={{
                            padding: '9px 14px',
                            fontSize: '0.85rem',
                            color: selectedFacility === f ? '#16a34a' : '#1a1f2e',
                            background: selectedFacility === f ? '#f0fdf4' : idx % 2 === 0 ? '#fafafa' : '#fff',
                            fontWeight: selectedFacility === f ? 700 : 400,
                            cursor: 'pointer',
                            borderBottom: idx < filtered.length - 1 ? '1px solid #f0f0f0' : 'none',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                          onMouseLeave={e => e.currentTarget.style.background = selectedFacility === f ? '#f0fdf4' : idx % 2 === 0 ? '#fafafa' : '#fff'}
                        >
                          {f}
                        </div>
                      ))}
                    </div>
                  )}
                  {/* 문제4: 입력했지만 목록에 없는 경우 경고 */}
                  {facilitySearch.trim() && !isValidFacility && filtered.length === 0 && (
                    <div style={{
                      marginTop: '4px', fontSize: '0.75rem', color: '#dc2626',
                      background: '#fef2f2', borderRadius: '6px', padding: '4px 10px',
                    }}>
                      ⚠️ 존재하지 않는 설비입니다. 목록에서 선택해 주세요.
                    </div>
                  )}
                </div>
              );
            })()}
            {/* 선택된 설비 표시 */}
            {selectedFacility.trim() && (
              <div style={{
                fontSize: '0.78rem', color: '#16a34a', marginBottom: '10px',
                background: '#f0fdf4', borderRadius: '6px', padding: '5px 10px',
                fontWeight: 600,
              }}>
                ✓ 선택됨: {selectedFacility}
              </div>
            )}
            {(() => {
              const facilityList2 = (
                Array.isArray(commonPopup.item.후보설비목록) && commonPopup.item.후보설비목록.length > 0
                  ? commonPopup.item.후보설비목록
                  : (facilityLists?.all || [])
              );
              const isValid = facilityList2.includes(selectedFacility.trim());
              return (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  if (!isValid) {
                    showToast('목록에 있는 설비를 선택해 주세요.', 'error');
                    return;
                  }
                  doSave(commonPopup.item, commonPopup.newQty, commonPopup.oldQty, selectedFacility);
                }}
                disabled={!isValid || isSaving}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                  background: isValid ? '#2563eb' : '#9ca3af',
                  color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: isValid ? 'pointer' : 'not-allowed',
                }}
              >
                {isSaving ? '저장 중...' : '✓ 출고 확인'}
              </button>
              <button
                onClick={() => setCommonPopup(null)}
                disabled={isSaving}
                style={{
                  padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #e5e7eb',
                  background: '#f9fafb', color: '#6b7280', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                }}
              >
                취소
              </button>
            </div>
              );
            })()}
          </div>
        </div>
      )}

      {!hideHeader && (
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12,19 5,12 12,5" />
          </svg>
          뒤로
        </button>
        <div className="detail-category-header">
  {isCommonSheet ? (
    <>
      <h2 className="main-cat-title">{items[0]?.대분류 || categoryName}</h2>
      <span className="sub-cat-badge">{categoryName}</span>
    </>
  ) : (
    <h2 className="main-cat-title">{categoryName}</h2>
  )}
</div>
      </div>
      )}

      <div className="detail-list">
        {items.map((item) => {
          const isLow = item.현재수량 <= item.최소보유수량;
          const stockPercent = Math.min((item.현재수량 / item.최소보유수량) * 100, 100);
          const isEditing = editingId === item.id;
          const isHighlighted = item.id == highlightId;

          return (
            <div 
              key={item.id} 
              id={`item-${item.id}`} // ✨ [추가] 스크롤이 찾아올 수 있도록 ID 부여
              // ✨ [변경] 강조 대상일 경우 'highlighted-card' 클래스 추가
              className={`detail-card ${isHighlighted ? 'highlighted-card' : ''} ${isLow ? 'low-stock' : ''}`}
            >
  <div className="detail-card-top">
  <div className="detail-model-wrapper">
    <span className="part-icon-inline">{getPartIcon(item.부품종류)}</span>
    {/* ✨ 부품종류(소분류) 텍스트 태그 추가 */}
    <span className="sub-category-tag">{item.부품종류}</span>
    
    <span className="detail-model">{item.모델명}</span>
    {isLow && <span className="low-stock-badge-inline">⚠️ 재고부족</span>}
    {item.isCommonPart && (
      <span
        title="이 부품은 여러 설비가 공용으로 사용합니다. 출고 시 실제 사용 설비를 확인합니다."
        style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700, background: '#f3e8ff', borderRadius: '6px', padding: '1px 7px', marginLeft: '4px' }}
      >
        🔗 공용 부품
      </span>
    )}
  </div>
    {!isEditing && (
                  <span className={`detail-quantity ${isLow ? 'text-red' : ''}`}>
                    {item.현재수량} <small>개</small>
                  </span>
                )}
              </div>

              <div className="detail-card-body">
                <div className="detail-info-row">
                  <span className="detail-info-label">최소보유수량</span>
                  <span className="detail-info-value">{item.최소보유수량} 개</span>
                </div>
                <>
                <div className="detail-info-row">
                  <span className="detail-info-label">최종수정시각</span>
                  <span className="detail-info-value">{item.최종수정시각}</span>
                </div>
                <div className="detail-info-row">
                   <span className="detail-info-label">최종 작업자</span>
                   <span className="detail-info-value">👤 {item.작업자 || '기록 없음'}</span>
              </div>
              <div className="detail-usage-section">
                <div className="detail-info-label">사용 용도</div>
                <div className="detail-usage-box">
                {item.용도 || '등록된 용도 정보가 없습니다.'}
              </div>
              {/* ✨ 아이콘 없이 깔끔하게 텍스트로 보관 위치 표시 */}
                <div className="detail-info-row" style={{ marginTop: '4px', color: '#374151' }}>
   <span className="detail-info-label">보관 위치</span>
   <span className="detail-info-value" style={{ fontWeight: '600', color: '#059669' }}>
     {item.보관장소 || '위치 미지정'}
   </span>
</div>
                <div className="detail-usage-section"></div>
              </div>
              </>

              {/* ✨ 수동 수정 UI */}
              {isEditing ? (
                <div className="edit-controls">
                  <div className="edit-input-group">
                    <button className="edit-btn-dec" onClick={() => setEditValue(Math.max(0, editValue - 1))}>−</button>
                    <input
                      type="number"
                      className="edit-input"
                      value={editValue}
                      onChange={(e) => setEditValue(Math.max(0, parseInt(e.target.value) || 0))}
                      min="0"
                    />
                    <button className="edit-btn-inc" onClick={() => setEditValue(editValue + 1)}>+</button>
                  </div>
                  <div className="edit-actions">
  <button
    className="edit-save-btn"
    style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
    onClick={() => handleSave(item)}
    disabled={isSaving}
  >
    {isSaving ? '저장 중...' : '✓ 변경확인'}
  </button>
  <button 
    className="edit-cancel-btn" 
    onClick={handleCancel} 
    disabled={isSaving}
    style={{ marginLeft: '8px' }}
  >
    ✕ 취소
  </button>
</div>
                </div>
              ) : (
                <button className="edit-trigger-btn" onClick={() => handleEdit(item)}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  수정
                </button>
              )}
              </div>

              {/* 재고 게이지 바 */}
              <div className="stock-gauge-bg">
                <div className={`stock-gauge-fill ${isLow ? 'gauge-low' : 'gauge-ok'}`} style={{ width: `${stockPercent}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// SummaryPage (전체 사용량 요약)
// ============================================================
function SummaryPage({ summary, onBack, onNavigateToItem }) {
  if (!summary) return null;

  return (
    <div className="summary-page">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12,19 5,12 12,5" />
          </svg>
          뒤로
        </button>
        <h2>전체 사용량 요약</h2>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-icon blue">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          </div>
          <div className="summary-card-value">{summary.totalItems}</div>
          <div className="summary-card-label">전체 부품종류</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-icon green">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4"/></svg>
          </div>
          <div className="summary-card-value">{summary.totalQuantity}</div>
          <div className="summary-card-label">전체 재고 수량</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-icon red">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div className="summary-card-value">{summary.lowStockCount}</div>
          <div className="summary-card-label">재고 부족 항목</div>
        </div>
      </div>

      {summary.lowStockItems.length > 0 && (
        <div className="summary-section">
          <h3 className="section-title red-title">⚠ 재고 부족 목록</h3>
          <p className="summary-hint">항목을 탭하면 해당 부품으로 바로 이동합니다</p>
          <div className="low-stock-table">
            <table>
              <thead>
                <tr>
                  <th>부품종류</th>
                  <th>모델명</th>
                  <th>참고 표기(엑셀 원본)</th>
                  <th>현재수량</th>
                  <th>최소보유수량</th>
                </tr>
              </thead>
              <tbody>
                {summary.lowStockItems.map((item) => (
                  <tr
                    key={item.id}
                    className="clickable-row"
                    onClick={() => onNavigateToItem && onNavigateToItem(item)}
                  >
                    <td>{item.부품종류}</td>
                    <td>{item.모델명}</td>
                    <td>{item.적용설비}</td>
                    <td className="text-red bold">{item.현재수량}</td>
                    <td>{item.최소보유수량}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ✨ UsageSummaryPage (전체 사용내역 요약)
// 설비이력 전체를 기준으로 월별/연도별 사용량, 설비별/부품별 랭킹을 한눈에 보여줌
// ============================================================
function UsageSummaryPage({ onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly'); // 'monthly' | 'yearly'
  const [selectedIdx, setSelectedIdx] = useState(null); // null = 기본값(이번 달)을 자동 선택, 클릭 시 해당 인덱스로 고정
  const [windowOffset, setWindowOffset] = useState(0); // 6개월 단위 구간 오프셋 (0 = 이번 달부터 6개월)
  const [expandedFacility, setExpandedFacility] = useState(null); // 설비별 사용량 그래프에서 클릭해 펼친 설비명
  const [showRanking, setShowRanking] = useState(false); // 전체 기간 순위 별도 화면

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/inventory/usage-summary`);
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        console.error('사용내역 요약 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div><p>로드 중...</p></div>;
  if (!data) return <div className="loading-spinner"><p>데이터를 불러올 수 없습니다.</p></div>;

  if (showRanking) {
    return <UsageRankingPage data={data} onBack={() => setShowRanking(false)} />;
  }

  const WINDOW_SIZE = 6;
  // ✨ 이번 달이 6개월 창의 가운데쯤(3번째 자리, 인덱스 2)에 오도록 기본 시작 위치를 계산.
  //    과거 이력이 있으면 자연스럽게 왼쪽에 몇 달이 보이고, 오른쪽으로는 미래도 보인다.
  //    windowOffset은 "달 단위"로 좌우 이동(1개월씩)하며, 데이터 배열 범위를 벗어나지 않게 제한한다.
  const currentIdx = data.currentMonthIndex >= 0 ? data.currentMonthIndex : 0;
  const defaultStart = Math.max(0, currentIdx - 2); // 이번 달을 3번째 자리에 두기 위한 기본 시작 인덱스
  const windowStart = Math.min(
    Math.max(0, defaultStart + windowOffset),
    Math.max(0, data.monthly.length - WINDOW_SIZE)
  );
  const monthlyWindow = data.monthly.slice(windowStart, windowStart + WINDOW_SIZE);

  // 좌우 이동 가능 범위: 왼쪽은 배열 맨 앞(가장 오래된 이력)까지, 오른쪽은 배열 맨 끝까지
  const minOffset = -defaultStart; // 이 이상 왼쪽으로 못 감 (배열 시작에 닿음)
  const maxOffset = Math.max(0, data.monthly.length - WINDOW_SIZE) - defaultStart; // 배열 끝에 닿을 때까지

  const entries = period === 'monthly' ? monthlyWindow : data.yearly;
  const maxTotal = Math.max(...entries.map(e => e.total), 1);
  // ✨ 현재 시각 기준으로 항상 최신 상태를 반영: 달/기간이 바뀌면(윈도우 이동, 탭 전환) 선택 인덱스가
  //    범위를 벗어날 수 있으므로 안전하게 보정. 월별 탭의 기본 선택은 "이번 달"이 되도록 한다.
  const defaultSelectedInWindow = period === 'monthly' ? Math.min(currentIdx - windowStart, entries.length - 1) : 0;
  const safeSelectedIdx = selectedIdx !== null && selectedIdx >= 0 && selectedIdx < entries.length
    ? selectedIdx
    : Math.max(0, defaultSelectedInWindow);
  const selected = entries[safeSelectedIdx] || null;

  // 선택된 기간(달/년)의 설비별 사용량 — 그래프로 그릴 전체 목록(내림차순)
  const selectedFacilityUsage = selected
    ? Object.entries(selected.byFacility).sort(([, a], [, b]) => b - a)
    : [];
  const facilityMaxQty = Math.max(...selectedFacilityUsage.map(([, q]) => q), 1);

  // 선택된 기간 + 펼친 설비의 부품 사용 내역 (해당 월/기간에 그 설비가 쓴 부품만)
  const expandedFacilityParts = expandedFacility && selected?.byFacilityPart
    ? Object.entries(selected.byFacilityPart[expandedFacility] || {}).sort(([, a], [, b]) => b - a)
    : [];

  const handlePrint = () => window.print();

  return (
    <div className="usage-summary-page">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" />
          </svg>
          뒤로
        </button>
        <h2>📊 전체 사용내역 요약</h2>
        <button className="print-btn" onClick={handlePrint}>🖨️ 출력/캡처</button>
      </div>

      <div className="usage-summary-print-area">
        {/* 기간 선택 탭 */}
        <div className="usage-period-tabs">
          <button
            className={`usage-period-tab ${period === 'monthly' ? 'active' : ''}`}
            onClick={() => { setPeriod('monthly'); setSelectedIdx(null); setExpandedFacility(null); }}
          >
            월별
          </button>
          <button
            className={`usage-period-tab ${period === 'yearly' ? 'active' : ''}`}
            onClick={() => { setPeriod('yearly'); setSelectedIdx(null); setExpandedFacility(null); }}
          >
            연도별
          </button>
          <button className="usage-ranking-link-btn" onClick={() => setShowRanking(true)}>
            🏆 전체 기간 순위 보기
          </button>
        </div>

        {/* 6개월 구간 선택 — 월별 탭일 때만 노출 */}
        {period === 'monthly' && (
          <div className="usage-window-selector">
            <button
              className="usage-window-nav-btn"
              disabled={windowOffset <= minOffset}
              onClick={() => { setWindowOffset(o => Math.max(minOffset, o - 1)); setExpandedFacility(null); }}
            >
              ◀
            </button>
            <span className="usage-window-label">
              {monthlyWindow[0]?.label} ~ {monthlyWindow[monthlyWindow.length - 1]?.label}
            </span>
            <button
              className="usage-window-nav-btn"
              disabled={windowOffset >= maxOffset}
              onClick={() => { setWindowOffset(o => Math.min(maxOffset, o + 1)); setExpandedFacility(null); }}
            >
              ▶
            </button>
          </div>
        )}

        {/* 출고 추이 그래프 — 달/년을 클릭해 선택 */}
        <div className="usage-chart-card">
          <div className="usage-chart-title">
            {period === 'monthly' ? '📆 월별 출고 추이 (6개월)' : '📅 연도별 출고 추이'}
          </div>
          <div className="usage-chart-bars">
            {entries.map((e, i) => {
              const barH = e.total > 0 ? Math.max((e.total / maxTotal) * 140, 4) : 2;
              return (
                <div
                  key={e.key}
                  className={`usage-chart-bar-col ${safeSelectedIdx === i ? 'selected' : ''}`}
                  onClick={() => { setSelectedIdx(i); setExpandedFacility(null); }}
                >
                  <div className="usage-chart-bar-value">{e.total > 0 ? e.total : ''}</div>
                  <div className="usage-chart-bar-track">
                    <div className="usage-chart-bar-fill" style={{ height: `${barH}px` }} />
                  </div>
                  <div className="usage-chart-bar-label">{e.label}</div>
                </div>
              );
            })}
          </div>
          <p className="usage-chart-hint">막대를 클릭해 기간을 선택하면 아래 설비별 사용량이 바뀝니다.</p>
        </div>

        {/* ✨ 선택된 기간의 설비별 사용량 그래프 — 기본값: 현재 달 */}
        <div className="usage-chart-card">
          <div className="usage-chart-title">
            🏭 {selected?.label || ''} 설비별 부품 사용량
          </div>
          {selectedFacilityUsage.length === 0 ? (
            <div className="usage-empty">해당 기간 사용 이력이 없습니다.</div>
          ) : (
            <div className="usage-facility-bars">
              {selectedFacilityUsage.map(([facility, qty]) => {
                const barW = Math.max((qty / facilityMaxQty) * 100, 3);
                const isExpanded = expandedFacility === facility;
                return (
                  <div key={facility} className="usage-facility-bar-item">
                    <div
                      className={`usage-facility-bar-row ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => setExpandedFacility(isExpanded ? null : facility)}
                    >
                      <span className="usage-facility-bar-name" title={facility}>{facility}</span>
                      <div className="usage-facility-bar-track">
                        <div className="usage-facility-bar-fill" style={{ width: `${barW}%` }} />
                      </div>
                      <span className="usage-facility-bar-qty">{qty.toLocaleString()}개</span>
                      <span className="usage-rank-caret">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                    {isExpanded && (
                      <div className="usage-facility-parts-box">
                        <div className="usage-facility-parts-fullname">🏭 {facility}</div>
                        {expandedFacilityParts.length === 0 ? (
                          <div className="usage-empty">사용 부품 내역이 없습니다.</div>
                        ) : (
                          expandedFacilityParts.map(([model, q]) => (
                            <div key={model} className="usage-facility-part-row">
                              <span>{model}</span>
                              <span>{q.toLocaleString()}개</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <p className="usage-chart-hint">설비를 클릭하면 해당 기간 그 설비가 사용한 부품을 볼 수 있습니다.</p>
        </div>

        {/* 맨 아래 — 전체 출고 건수/수량 (작게 표시) */}
        <div className="usage-summary-totals-mini">
          <span>전체 출고 건수 <strong>{data.totalOutCount.toLocaleString()}건</strong></span>
          <span className="usage-totals-mini-divider">·</span>
          <span>전체 출고 수량 <strong>{data.totalOutQty.toLocaleString()}개</strong></span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ✨ UsageRankingPage (전체 기간 설비별/부품별 사용량 순위 — 별도 화면)
// ============================================================
function UsageRankingPage({ data, onBack }) {
  const [expandedFacility, setExpandedFacility] = useState(null);

  const expandedFacilityParts = expandedFacility
    ? Object.entries(data.facilityPartBreakdown?.[expandedFacility] || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
    : [];

  return (
    <div className="usage-summary-page">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" />
          </svg>
          뒤로
        </button>
        <h2>🏆 전체 기간 사용량 순위</h2>
        <button className="print-btn" onClick={() => window.print()}>🖨️ 출력/캡처</button>
      </div>

      <div className="usage-detail-grid">
        <div className="usage-detail-card">
          <div className="usage-detail-col-title">🏭 전체 기간 설비별 사용량 순위</div>
          <p className="usage-chart-hint" style={{ margin: '-4px 0 8px' }}>설비를 클릭하면 사용된 부품을 볼 수 있습니다.</p>
          {data.facilityRanking.slice(0, 10).map((f, i) => (
            <div key={f.facility}>
              <div
                className={`usage-rank-row usage-rank-row-clickable ${expandedFacility === f.facility ? 'expanded' : ''}`}
                onClick={() => setExpandedFacility(expandedFacility === f.facility ? null : f.facility)}
              >
                <span className="usage-rank-num">{i + 1}</span>
                <span className="usage-rank-name">{f.facility}</span>
                <span className="usage-rank-qty">{f.total.toLocaleString()}개</span>
                <span className="usage-rank-caret">{expandedFacility === f.facility ? '▲' : '▼'}</span>
              </div>
              {expandedFacility === f.facility && (
                <div className="usage-facility-parts-box">
                  {expandedFacilityParts.length === 0 ? (
                    <div className="usage-empty">사용 부품 내역이 없습니다.</div>
                  ) : (
                    expandedFacilityParts.map(([model, qty]) => (
                      <div key={model} className="usage-facility-part-row">
                        <span>{model}</span>
                        <span>{qty.toLocaleString()}개</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="usage-detail-card">
          <div className="usage-detail-col-title">🔧 전체 기간 부품별 사용량 순위</div>
          {data.partRanking.slice(0, 10).map((p, i) => (
            <div key={p.model} className="usage-rank-row">
              <span className="usage-rank-num">{i + 1}</span>
              <span className="usage-rank-name">{p.model}{p.partType ? ` (${p.partType})` : ''}</span>
              <span className="usage-rank-qty">{p.total.toLocaleString()}개</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ✨ LogsPage (재고 변경 이력)
// ============================================================
function LogsPage({ onBack, inventoryData, facilityLists }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState(''); // ✨ 설비명/모델명/부품종류 통합 검색어
  const LIMIT = 50;

  // 검색어 입력 중 과도한 요청을 막기 위한 디바운스
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogs([]);
      setOffset(0);
      fetchLogs(0, true, searchQuery);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  async function fetchLogs(offsetVal, reset = false, q = searchQuery) {
    try {
      reset ? setLoading(true) : setLoadingMore(true);
      const params = new URLSearchParams({ limit: LIMIT, offset: offsetVal });
      if (q && q.trim()) params.append('q', q.trim());
      const res = await axios.get(`${BASE_URL}/inventory/logs?${params}`);
      const newLogs = res.data.data;
      setTotal(res.data.total);
      setLogs(prev => reset ? newLogs : [...prev, ...newLogs]);
      setOffset(offsetVal + newLogs.length);
    } catch (err) {
      console.error('로그 로드 실패:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const handleLoadMore = () => fetchLogs(offset);

  if (loading && logs.length === 0) return <div className="loading-spinner"><div className="spinner"></div><p>로드 중...</p></div>;

  const inLogs  = logs.filter(l => l.action === '입고');
  const outLogs = logs.filter(l => l.action === '출고');
  const etcLogs = logs.filter(l => l.action !== '입고' && l.action !== '출고');

  const LogCard = ({ log }) => (
    <div className="log-item-col">
      <div className="log-col-time">{log.timestampKR}</div>
      <div className="log-col-name">
        <span className="log-category">{log.부품종류}</span>
        <span className="log-model">{log.모델명}</span>
      </div>
      <div className="log-col-qty">
        <span className="log-qty-before">{log.변경전수량}</span>
        <span className="log-qty-arrow">→</span>
        <span className={`log-qty-after ${log.변경수량 > 0 ? 'positive' : 'negative'}`}>
          {log.변경후수량}
        </span>
        <span className={`log-qty-change ${log.변경수량 > 0 ? 'positive' : 'negative'}`}>
          ({log.변경수량 > 0 ? '+' : ''}{log.변경수량})
        </span>
      </div>
      <div className="log-col-meta">
        <span>📍 {log.적용설비}</span>
        <span className="log-user-badge">👤 {log.user || '시스템'}</span>
      </div>
    </div>
  );

  return (
    <div className="logs-page">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12,19 5,12 12,5" />
          </svg>
          뒤로
        </button>
        <h2>재고 변경 이력</h2>
      </div>

      {/* 검색 영역 — 설비명 / 모델명 / 부품종류 통합 검색 */}
      <div className="logs-filter-bar">
        <input
          type="text"
          className="logs-search-input"
          placeholder="🔍 설비명 또는 부품 모델명으로 검색..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="logs-filter-clear" onClick={() => setSearchQuery('')}>
            ✕ 초기화
          </button>
        )}
        <span className="logs-total-count">총 {total}건</span>
      </div>

      {/* 입고 / 출고 2컬럼 */}
      <div className="logs-split-wrap">
        {/* 입고 컬럼 */}
        <div className="logs-col logs-col-in">
          <div className="logs-col-header logs-col-header-in">
            📥 입고 <span className="logs-col-count">{inLogs.length}건</span>
          </div>
          <div className="logs-col-body">
            {inLogs.length === 0
              ? <div className="logs-empty-col">입고 내역 없음</div>
              : inLogs.map(log => <LogCard key={log.id} log={log} />)
            }
          </div>
        </div>

        {/* 구분선 */}
        <div className="logs-divider" />

        {/* 출고 컬럼 */}
        <div className="logs-col logs-col-out">
          <div className="logs-col-header logs-col-header-out">
            📤 출고 <span className="logs-col-count">{outLogs.length}건</span>
          </div>
          <div className="logs-col-body">
            {outLogs.length === 0
              ? <div className="logs-empty-col">출고 내역 없음</div>
              : outLogs.map(log => <LogCard key={log.id} log={log} />)
            }
          </div>
        </div>
      </div>

      {/* 수량변경 등 기타 (있을 경우만) */}
      {etcLogs.length > 0 && (
        <div className="logs-etc-section">
          <div className="logs-col-header logs-col-header-etc">
            ✏️ 수량변경 <span className="logs-col-count">{etcLogs.length}건</span>
          </div>
          {etcLogs.map(log => (
            <div key={log.id} className="log-item-col log-item-etc">
              <div className="log-col-time">{log.timestampKR}</div>
              <div className="log-col-name">
                <span className="log-category">{log.부품종류}</span>
                <span className="log-model">{log.모델명}</span>
              </div>
              <div className="log-col-qty">
                <span className="log-qty-before">{log.변경전수량}</span>
                <span className="log-qty-arrow">→</span>
                <span className="log-qty-after">{log.변경후수량}</span>
              </div>
              <div className="log-col-meta">
                <span>📍 {log.적용설비}</span>
                <span className="log-user-badge">👤 {log.user || '시스템'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 더보기 버튼 */}
      {logs.length < total && (
        <button
          className="logs-load-more"
          onClick={handleLoadMore}
          disabled={loadingMore}
        >
          {loadingMore ? '로드 중...' : `더보기 (${total - logs.length}건 남음)`}
        </button>
      )}
    </div>
  );
}

// ============================================================
// AIChatBar (하단 고정 AI 채팅 한 줄)
// ============================================================
function AIChatBar({ onInventoryUpdate, showToast }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = React.useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // ~~~INVENTORY_UPDATE ... ~~~ 블록을 메시지에서 제거
  function cleanAIMessage(text) {
    return text.replace(/~~~INVENTORY_UPDATE[\s\S]*?~~~/g, '').trim();
  }

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ 
        role: m.role === 'model' ? 'model' : 'user',
        text: m.text 
      }));
      
      const res = await axios.post(`${BASE_URL}/ai/chat`, {
        message: userMsg.text,
        conversationHistory: history,
        user: localStorage.getItem('inventory_user') || '미확인 사용자'
      });

      let aiText = cleanAIMessage(res.data.message);
      
      if (res.data.inventoryUpdated && res.data.updateResult) {
        const { action, items } = res.data.updateResult;
        const itemsText = items.map(i => `${i.모델명} ${i.수량}개`).join(', ');
        aiText += `\n\n✅ ${action} 완료: ${itemsText}`;
        showToast && showToast(`${action} 완료: ${itemsText}`);
        setTimeout(() => onInventoryUpdate(), 500);
      }

      const aiMsg = { role: 'model', text: aiText };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = { role: 'model', text: '⚠️ AI 응답 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="ai-chat-container">
      {isChatOpen && (
        <div className="ai-chat-popup">
          <div className="ai-chat-popup-header">
            <span>🤖 AI 재고 관리 어시스턴트</span>
            <button className="chat-close-btn" onClick={() => setIsChatOpen(false)}>✕</button>
          </div>
          <div className="ai-chat-messages">
            {messages.length === 0 && (
              <div className="ai-chat-placeholder">재고에 대해 궁금한 점을 물어보세요!</div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`ai-chat-msg ${msg.role === 'user' ? 'user' : 'ai'}`}>
                <div className="ai-chat-bubble">{msg.text}</div>
              </div>
            ))}
            {isLoading && (
              <div className="ai-chat-msg ai">
                <div className="ai-chat-bubble ai-typing">
                  <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      )}

      <div className="ai-chat-bar">
        <button className="ai-chat-toggle" onClick={() => setIsChatOpen(prev => !prev)}>
          🤖
        </button>
        <input
          type="text"
          className="ai-chat-input"
          placeholder="AI에게 재고 관련 질문하기... (Enter로 전송)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsChatOpen(true)}
        />
        <button className="ai-chat-send" onClick={handleSend} disabled={isLoading}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22,2 15,22 11,13 2,9" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ============================================================
// FacilityDashboardPage — 설비별 부품 사용 이력 차트 대시보드
// ============================================================
function FacilityDashboardPage({ facilityName, inventoryData, onBack, onUpdate, userName, showToast }) {
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' | 'history' | 'search'
  const [facilityLogs, setFacilityLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // ── 이력 목록 필터 / 검색 ──
  const [historyFilter, setHistoryFilter] = useState('all'); // 'all' | 'in' | 'out'
  const [historySearch, setHistorySearch] = useState('');

  // ── 부품 검색 (이 설비에서 쓸 공통부품을 찾아 바로 출고) ──
  const [partSearchQuery, setPartSearchQuery] = useState('');
  const [partSearchResults, setPartSearchResults] = useState([]);
  const [isPartSearching, setIsPartSearching] = useState(false);
  const [issuePopup, setIssuePopup] = useState(null); // { item, qty }
  const [isIssuing, setIsIssuing] = useState(false);

  async function handlePartSearch(query) {
    setPartSearchQuery(query);
    if (!query || query.trim().length < 1) {
      setPartSearchResults([]);
      setIsPartSearching(false);
      return;
    }
    try {
      setIsPartSearching(true);
      const res = await axios.get(`${BASE_URL}/inventory/search?q=${encodeURIComponent(query)}`);
      setPartSearchResults(res.data.data || []);
    } catch (e) {
      console.error('부품 검색 실패:', e);
      setPartSearchResults([]);
    }
  }

  async function handleIssueConfirm() {
    if (!issuePopup) return;
    const { item, qty } = issuePopup;
    if (!qty || qty <= 0 || qty > item.현재수량) {
      showToast && showToast(`출고 수량을 확인해 주세요 (현재고 ${item.현재수량}개)`, 'error');
      return;
    }
    try {
      setIsIssuing(true);
      await axios.post(`${BASE_URL}/inventory/common-update`, {
        id: item.id,
        현재수량: item.현재수량 - qty,
        action: '출고',
        user: userName,
        실제사용설비: facilityName
      });
      showToast && showToast(`${item.모델명} ${qty}개 출고 완료 (${facilityName})`, 'success');
      setIssuePopup(null);
      setPartSearchQuery('');
      setPartSearchResults([]);
      setIsPartSearching(false);
      onUpdate && await onUpdate();
    } catch (e) {
      console.error('출고 실패:', e);
      showToast && showToast(e.response?.data?.message || '출고 처리 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsIssuing(false);
    }
  }

  const [rollbackingId, setRollbackingId] = useState(null);

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await axios.get(`${BASE_URL}/inventory/facility-logs?facility=${encodeURIComponent(facilityName)}&limit=500`);
      setFacilityLogs(res.data.data || []);
    } catch (e) {
      console.error('설비이력 로드 실패:', e);
      setFacilityLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilityName]);

  // 실수로 처리한 출고/입고를 되돌리기 (가장 최근 이력만 가능 — 서버에서 재검증)
  async function handleRollback(log) {
    if (!window.confirm(`${log.모델명}의 "${log.action}" 처리를 되돌리시겠습니까?\n재고가 ${log.변경후수량}개 → ${log.변경전수량}개로 복원되고, 이 이력은 사용내역에서 삭제됩니다.`)) {
      return;
    }
    try {
      setRollbackingId(log.id);
      await axios.post(`${BASE_URL}/inventory/rollback-log`, {
        logId: log.id,
        user: userName,
      });
      showToast && showToast(`${log.모델명} 이력을 되돌리고 삭제했습니다.`, 'success');
      await fetchLogs();
      onUpdate && await onUpdate();
    } catch (e) {
      console.error('되돌리기 실패:', e);
      showToast && showToast(e.response?.data?.message || '되돌리기 처리 중 오류가 발생했습니다.', 'error');
    } finally {
      setRollbackingId(null);
    }
  }

  // ── 최근 6개월 필터 (주별 추이는 6개월, 소모분석은 1개월) ──
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  function parseKSTDate(raw) {
    if (!raw) return null;
    // "2026. 4. 22. 오전/오후 HH:MM:SS" 또는 "2026. 4. 22. AM/PM HH:MM:SS"
    const m = raw.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
    if (!m) return null;
    return new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]));
  }

  const recentLogs = facilityLogs.filter(l => {
    const d = parseKSTDate(l.timestampKR);
    return d && d >= oneMonthAgo;
  });

  const outLogs = recentLogs.filter(l => l.변경수량 < 0 || l.action === '출고');

  // 전체 출고 (위험예측용 — 전체 이력 기반)
  const allOutLogs = facilityLogs.filter(l => l.변경수량 < 0 || l.action === '출고');
  const allPartConsumption = {};
  allOutLogs.forEach(log => {
    const key = log.모델명 || '미상';
    const partType = log.부품종류 || '';
    const qty = Math.abs(Number(log.변경수량) || 0);
    if (!allPartConsumption[key]) allPartConsumption[key] = { model: key, partType, total: 0, count: 0 };
    allPartConsumption[key].total += qty;
    allPartConsumption[key].count += 1;
  });

  // ── 소모 분석: 최근 1개월 ──
  const partConsumption = {};
  outLogs.forEach(log => {
    const key = log.모델명 || '미상';
    const partType = log.부품종류 || '';
    const qty = Math.abs(Number(log.변경수량) || 0);
    if (!partConsumption[key]) partConsumption[key] = { model: key, partType, total: 0, count: 0 };
    partConsumption[key].total += qty;
    partConsumption[key].count += 1;
  });

  const sortedParts = Object.values(partConsumption)
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);
  const maxTotal = sortedParts[0]?.total || 1;

  // 주별 출고 추이 — 최근 6개월 기준, 부품명별 집계
  const weeklyTrend = {}; // { 'M/D': { total, parts: { 모델명: qty } } }
  const sixMonthOutLogs = facilityLogs.filter(l => {
    const d = parseKSTDate(l.timestampKR);
    return d && d >= sixMonthsAgo && (l.변경수량 < 0 || l.action === '출고');
  });
  // 상위 3개 부품 추출 (전체 6개월 기준)
  const top3Models = Object.entries(
    sixMonthOutLogs.reduce((acc, l) => {
      const m = l.모델명 || '미상';
      acc[m] = (acc[m] || 0) + Math.abs(Number(l.변경수량) || 0);
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([m]) => m);

  const trendColors = ['#2563eb', '#7c3aed', '#059669'];

  sixMonthOutLogs.forEach(log => {
    const d = parseKSTDate(log.timestampKR);
    if (!d) return;
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
    const key = `${monday.getMonth() + 1}/${monday.getDate()}`;
    const model = log.모델명 || '미상';
    const qty = Math.abs(Number(log.변경수량) || 0);
    if (!weeklyTrend[key]) weeklyTrend[key] = { total: 0, parts: {} };
    weeklyTrend[key].total += qty;
    weeklyTrend[key].parts[model] = (weeklyTrend[key].parts[model] || 0) + qty;
  });
  const trendEntries = Object.entries(weeklyTrend).sort(([a], [b]) => {
    const [am, ad] = a.split('/').map(Number);
    const [bm, bd] = b.split('/').map(Number);
    return am !== bm ? am - bm : ad - bd;
  });
  const maxTrend = Math.max(...trendEntries.map(([, v]) => v.total), 1);

  // ── 1개월 주별 출고 추이 (최근 1개월, outLogs 기준) ──
  const weeklyTrend1M = {};
  outLogs.forEach(log => {
    const d = parseKSTDate(log.timestampKR);
    if (!d) return;
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
    const key = `${monday.getMonth() + 1}/${monday.getDate()}`;
    const model = log.모델명 || '미상';
    const qty = Math.abs(Number(log.변경수량) || 0);
    if (!weeklyTrend1M[key]) weeklyTrend1M[key] = { total: 0, parts: {} };
    weeklyTrend1M[key].total += qty;
    weeklyTrend1M[key].parts[model] = (weeklyTrend1M[key].parts[model] || 0) + qty;
  });
  const trend1MEntries = Object.entries(weeklyTrend1M).sort(([a], [b]) => {
    const [am, ad] = a.split('/').map(Number);
    const [bm, bd] = b.split('/').map(Number);
    return am !== bm ? am - bm : ad - bd;
  });
  const maxTrend1M = Math.max(...trend1MEntries.map(([, v]) => v.total), 1);

  // ── 6개월 월별 출고 추이 (sixMonthOutLogs 기준, 데이터 없는 달도 0으로 표시) ──
  const monthlyTrendMap = {}; // key: 'YYYY-M'
  sixMonthOutLogs.forEach(log => {
    const d = parseKSTDate(log.timestampKR);
    if (!d) return;
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    const model = log.모델명 || '미상';
    const qty = Math.abs(Number(log.변경수량) || 0);
    if (!monthlyTrendMap[key]) monthlyTrendMap[key] = { total: 0, parts: {} };
    monthlyTrendMap[key].total += qty;
    monthlyTrendMap[key].parts[model] = (monthlyTrendMap[key].parts[model] || 0) + qty;
  });
  const monthlyEntries = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1); // 월말 overflow 방지
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    const label = `${d.getMonth() + 1}월`;
    monthlyEntries.push([label, monthlyTrendMap[key] || { total: 0, parts: {} }]);
  }
  const maxMonthlyTrend = Math.max(...monthlyEntries.map(([, v]) => v.total), 1);

  // ── 부품별 출고량 부가 통계 (전체 대비 비중 계산용) ──
  const totalAllPartQty = Object.values(partConsumption).reduce((s, p) => s + p.total, 0) || 1;

  // ── 이력 목록: 필터(입고/출고) + 검색(모델명/부품종류) 적용 ──
  const filteredHistoryLogs = facilityLogs.filter(log => {
    const isOut = log.변경수량 < 0 || log.action === '출고';
    if (historyFilter === 'in' && isOut) return false;
    if (historyFilter === 'out' && !isOut) return false;
    if (historySearch.trim()) {
      const q = historySearch.trim().toLowerCase().replace(/[\s\-_]+/g, '');
      const model = String(log.모델명 || '').toLowerCase().replace(/[\s\-_]+/g, '');
      const type = String(log.부품종류 || '').toLowerCase().replace(/[\s\-_]+/g, '');
      if (!model.includes(q) && !type.includes(q)) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* 헤더 */}
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" />
          </svg>
          설비 선택으로
        </button>
        <div className="detail-category-header">
          <h2 className="main-cat-title" style={{ fontSize: '1.05rem' }}>{facilityName}</h2>
          <span className="sub-cat-badge">대시보드</span>
        </div>
      </div>

      {/* 요약 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', padding: '14px 0 4px' }}>
        {[
          { label: '사용 부품 종류', value: Object.keys(allPartConsumption).length + '종', color: '#2563eb', bg: 'linear-gradient(135deg, #dbeafe, #eff6ff)', icon: '🔧' },
          { label: '1개월 출고', value: outLogs.length + '건', color: '#7c3aed', bg: 'linear-gradient(135deg, #ede9fe, #f5f3ff)', icon: '📦' },
        ].map(card => (
          <div key={card.label} style={{
            background: card.bg, borderRadius: '14px', padding: '14px 10px', textAlign: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.6)',
          }}>
            <div style={{ fontSize: '1.05rem', marginBottom: '2px' }}>{card.icon}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: card.color, letterSpacing: '-0.02em' }}>{card.value}</div>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px', fontWeight: 600 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', gap: '4px', background: '#f3f4f6', borderRadius: '10px', padding: '4px', marginTop: '14px' }}>
        {[
          { id: 'analysis', icon: '📊', label: '소모 분석' },
          { id: 'history', icon: '📋', label: '이력 목록' },
          { id: 'search', icon: '🔍', label: '부품 검색' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, border: 'none', borderRadius: '8px', padding: '8px 4px', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? '#2563eb' : '#6b7280',
              background: activeTab === tab.id ? '#fff' : 'transparent',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {loadingLogs ? (
        <div className="loading-spinner"><div className="spinner"></div><p>이력 로드 중...</p></div>
      ) : (
        <div style={{ paddingTop: '14px' }}>

          {/* ── 탭1: 소모 분석 ── */}
          {activeTab === 'analysis' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* 기간 레이블 */}
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', textAlign: 'right' }}>
                📊 소모분석: 최근 1개월 | 추이: 1개월(주별) · 6개월(월별)
              </div>

              {/* 부품별 출고량 (전체 폭) */}
              <div style={{ background: '#fff', borderRadius: '12px', padding: '11px 10px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1a1f2e', marginBottom: '10px', lineHeight: 1.3 }}>
                  🔧 부품별 출고량
                  <span style={{ fontSize: '0.62rem', color: '#9ca3af', fontWeight: 400, marginLeft: '4px' }}>최근 1개월</span>
                </div>
                {sortedParts.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#9ca3af', padding: '16px 0', fontSize: '0.72rem' }}>이력 없음</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {sortedParts.map((part, i) => {
                      const pct = (part.total / maxTotal) * 100;
                      const share = ((part.total / totalAllPartQty) * 100).toFixed(1);
                      const avgPerOut = (part.total / part.count).toFixed(1);
                      const currentItem = inventoryData.find(item => item.모델명 === part.model);
                      const isLow = currentItem && currentItem.최소보유수량 > 0 && currentItem.현재수량 <= currentItem.최소보유수량;
                      const barColor = isLow ? '#dc2626' : i < 3 ? '#2563eb' : '#93c5fd';
                      return (
                        <div key={part.model}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.66rem', color: '#374151', fontWeight: 600, maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {isLow && <span style={{ color: '#dc2626' }}>⚠ </span>}
                              {part.model}
                            </span>
                            <span style={{ fontSize: '0.64rem', color: barColor, fontWeight: 700, whiteSpace: 'nowrap' }}>
                              {part.total}개
                            </span>
                          </div>
                          <div style={{ background: '#f3f4f6', borderRadius: '3px', height: '6px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, borderRadius: '3px', background: barColor, transition: 'width 0.5s ease' }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
                            <span style={{ fontSize: '0.58rem', color: '#9ca3af' }}>
                              {part.count}건 · 평균 {avgPerOut}개/건
                            </span>
                            <span style={{ fontSize: '0.58rem', color: '#6b7280', fontWeight: 600 }}>
                              전체 비중 {share}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 1개월 / 6개월 출고 추이 (가로 2분할) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'start' }}>

                {/* 왼쪽: 1개월 주별 추이 */}
                <div style={{ background: '#fff', borderRadius: '12px', padding: '11px 10px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1a1f2e', marginBottom: '4px', lineHeight: 1.3 }}>
                    📅 주별 추이
                    <span style={{ fontSize: '0.62rem', color: '#9ca3af', fontWeight: 400, marginLeft: '4px' }}>최근 1개월</span>
                  </div>
                  {top3Models.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {top3Models.map((m, i) => (
                        <span key={m} style={{ fontSize: '0.55rem', color: trendColors[i], fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: trendColors[i], display: 'inline-block' }} />
                          {m.length > 8 ? m.slice(0, 8) + '…' : m}
                        </span>
                      ))}
                    </div>
                  )}
                  {trend1MEntries.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9ca3af', padding: '16px 0', fontSize: '0.7rem' }}>1개월 이내 출고 내역 없음</div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '120px', padding: '0 2px', overflowX: 'auto' }}>
                      {trend1MEntries.map(([week, val]) => {
                        const barH = Math.max((val.total / maxTrend1M) * 80, 4);
                        const segments = top3Models.map(m => ({
                          model: m,
                          qty: val.parts[m] || 0,
                          color: trendColors[top3Models.indexOf(m)],
                        })).filter(s => s.qty > 0);
                        const otherQty = val.total - segments.reduce((s, x) => s + x.qty, 0);
                        if (otherQty > 0) segments.push({ model: '기타', qty: otherQty, color: '#d1d5db' });
                        return (
                          <div key={week} style={{ minWidth: '28px', flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                            <div style={{ fontSize: '0.55rem', color: '#6b7280', fontWeight: 600 }}>{val.total}</div>
                            <div style={{ width: '18px', display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', height: '80px', justifyContent: 'flex-start' }}>
                              {segments.map((seg, si) => {
                                const segH = Math.max((seg.qty / val.total) * barH, 2);
                                return (
                                  <div key={si} title={`${seg.model}: ${seg.qty}개`} style={{
                                    width: '100%', height: `${segH}px`,
                                    background: seg.color,
                                    borderRadius: si === segments.length - 1 ? '3px 3px 0 0' : '0',
                                  }} />
                                );
                              })}
                            </div>
                            <div style={{ fontSize: '0.5rem', color: '#9ca3af', textAlign: 'center', lineHeight: 1.2 }}>
                              {week}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 오른쪽: 6개월 월별 추이 */}
                <div style={{ background: '#fff', borderRadius: '12px', padding: '11px 10px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1a1f2e', marginBottom: '4px', lineHeight: 1.3 }}>
                    📆 월별 추이
                    <span style={{ fontSize: '0.62rem', color: '#9ca3af', fontWeight: 400, marginLeft: '4px' }}>최근 6개월</span>
                  </div>
                  {top3Models.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {top3Models.map((m, i) => (
                        <span key={m} style={{ fontSize: '0.55rem', color: trendColors[i], fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: trendColors[i], display: 'inline-block' }} />
                          {m.length > 8 ? m.slice(0, 8) + '…' : m}
                        </span>
                      ))}
                      {sixMonthOutLogs.length > 0 && <span style={{ fontSize: '0.55rem', color: '#9ca3af', marginLeft: 'auto' }}>기타 포함</span>}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '120px', padding: '0 2px' }}>
                    {monthlyEntries.map(([label, val]) => {
                      const barH = val.total > 0 ? Math.max((val.total / maxMonthlyTrend) * 80, 4) : 0;
                      const segments = top3Models.map(m => ({
                        model: m,
                        qty: val.parts[m] || 0,
                        color: trendColors[top3Models.indexOf(m)],
                      })).filter(s => s.qty > 0);
                      const otherQty = val.total - segments.reduce((s, x) => s + x.qty, 0);
                      if (otherQty > 0) segments.push({ model: '기타', qty: otherQty, color: '#d1d5db' });
                      return (
                        <div key={label} style={{ minWidth: '24px', flex: '1 1 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                          <div style={{ fontSize: '0.55rem', color: '#6b7280', fontWeight: 600 }}>{val.total}</div>
                          <div style={{ width: '18px', display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', height: '80px', justifyContent: 'flex-start' }}>
                            {val.total === 0 ? (
                              <div style={{ width: '100%', height: '2px', background: '#f3f4f6', borderRadius: '3px' }} />
                            ) : segments.map((seg, si) => {
                              const segH = Math.max((seg.qty / val.total) * barH, 2);
                              return (
                                <div key={si} title={`${seg.model}: ${seg.qty}개`} style={{
                                  width: '100%', height: `${segH}px`,
                                  background: seg.color,
                                  borderRadius: si === segments.length - 1 ? '3px 3px 0 0' : '0',
                                }} />
                              );
                            })}
                          </div>
                          <div style={{ fontSize: '0.5rem', color: '#9ca3af', textAlign: 'center', lineHeight: 1.2 }}>
                            {label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── 탭2: 이력 목록 ── */}
          {activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              {/* 필터 버튼 + 검색 */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'all', label: '전체' },
                  { id: 'in', label: '📥 입고' },
                  { id: 'out', label: '📤 출고' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setHistoryFilter(f.id)}
                    style={{
                      flex: 1, padding: '7px 0', borderRadius: '8px', cursor: 'pointer',
                      fontSize: '0.75rem', fontWeight: 700,
                      border: historyFilter === f.id ? '1.5px solid #2563eb' : '1.5px solid #e5e7eb',
                      background: historyFilter === f.id ? '#eff6ff' : '#fff',
                      color: historyFilter === f.id ? '#2563eb' : '#6b7280',
                      transition: 'all 0.15s',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="search-input-wrap" style={{ position: 'relative' }}>
                <svg className="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="모델명, 부품종류로 이력 검색..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                />
                {historySearch && (
                  <button className="search-clear" onClick={() => setHistorySearch('')}>✕</button>
                )}
              </div>

              <div style={{ fontSize: '0.68rem', color: '#9ca3af', textAlign: 'right' }}>
                {filteredHistoryLogs.length}건 표시 중 (전체 {facilityLogs.length}건)
              </div>

              {filteredHistoryLogs.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '30px 0', fontSize: '0.85rem' }}>
                  {facilityLogs.length === 0 ? '이력이 없습니다' : '조건에 맞는 이력이 없습니다'}
                </div>
              ) : (
                filteredHistoryLogs.map(log => {
                  const isOut = log.변경수량 < 0 || log.action === '출고';
                  return (
                    <div key={log.id} style={{
                      background: '#fff', borderRadius: '12px', padding: '12px 14px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                      borderLeft: `4px solid ${isOut ? '#dc2626' : '#16a34a'}`,
                      transition: 'box-shadow 0.15s',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                          background: isOut ? '#fee2e2' : '#dcfce7', color: isOut ? '#dc2626' : '#16a34a',
                        }}>
                          {isOut ? '📤 출고' : '📥 입고'}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>{log.timestampKR}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a1f2e' }}>{log.모델명}</div>
                          <div style={{ fontSize: '0.68rem', color: '#6b7280', marginTop: '1px' }}>{log.부품종류}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: isOut ? '#dc2626' : '#16a34a' }}>
                            {isOut ? '' : '+'}{log.변경수량}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>
                            {log.변경전수량} → {log.변경후수량}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        {log.user ? (
                          <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>👤 {log.user}</div>
                        ) : <div />}
                        <button
                          onClick={() => handleRollback(log)}
                          disabled={rollbackingId === log.id}
                          style={{
                            fontSize: '0.65rem', fontWeight: 700, color: '#2563eb',
                            background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px',
                            padding: '3px 8px', cursor: 'pointer',
                          }}
                        >
                          {rollbackingId === log.id ? '처리 중...' : '↩️ 되돌리기'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── 탭3: 부품 검색 (이 설비에서 쓸 공통부품을 찾아 바로 출고) ── */}
          {activeTab === 'search' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '10px 13px', fontSize: '0.75rem', color: '#1e40af', border: '1px solid #bfdbfe', lineHeight: 1.6 }}>
                💡 모델명이나 부품종류(예: "공압", "센서")로 검색하면, 찾은 부품을 바로 <strong>{facilityName}</strong>에서 출고 처리할 수 있습니다.
              </div>

              <div className="search-input-wrap" style={{ position: 'relative' }}>
                <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="모델명, 부품종류(예: 공압, 센서, 모터) 검색..."
                  value={partSearchQuery}
                  onChange={(e) => handlePartSearch(e.target.value)}
                />
                {partSearchQuery && (
                  <button className="search-clear" onClick={() => { setPartSearchQuery(''); setPartSearchResults([]); setIsPartSearching(false); }}>✕</button>
                )}
              </div>

              {isPartSearching && (
                partSearchResults.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#9ca3af', padding: '24px 0', fontSize: '0.82rem' }}>검색 결과가 없습니다</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {partSearchResults.map(item => (
                      <div
                        key={item.id}
                        onClick={() => setIssuePopup({ item, qty: 1 })}
                        style={{
                          background: '#fff', borderRadius: '10px', padding: '10px 12px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.68rem', color: '#6b7280' }}>{item.적용설비} · {item.부품종류}</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a1f2e' }}>{item.모델명}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: item.현재수량 <= item.최소보유수량 ? '#dc2626' : '#1a1f2e' }}>
                            {item.현재수량}개
                          </div>
                          <div style={{ fontSize: '0.62rem', color: '#2563eb', fontWeight: 600 }}>탭하여 출고</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* 출고 확인 팝업 */}
              {issuePopup && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
                     onClick={() => !isIssuing && setIssuePopup(null)}>
                  <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', width: '90%', maxWidth: '360px' }}
                       onClick={(e) => e.stopPropagation()}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>{issuePopup.item.모델명}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '14px' }}>
                      {facilityName}에서 출고 · 현재고 {issuePopup.item.현재수량}개
                    </div>
                    <label style={{ fontSize: '0.75rem', color: '#374151', fontWeight: 600 }}>출고 수량</label>
                    <input
                      type="number"
                      min="1"
                      max={issuePopup.item.현재수량}
                      value={issuePopup.qty}
                      onChange={(e) => setIssuePopup({ ...issuePopup, qty: parseInt(e.target.value) || 0 })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', marginTop: '4px', marginBottom: '16px', fontSize: '1rem' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setIssuePopup(null)}
                        disabled={isIssuing}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', fontWeight: 600 }}
                      >
                        취소
                      </button>
                      <button
                        onClick={handleIssueConfirm}
                        disabled={isIssuing}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700 }}
                      >
                        {isIssuing ? '처리 중...' : '출고 확정'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default App;
