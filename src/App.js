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
  "219149": "가왕현"
  // 필요한 만큼 사번: "이름" 형태로 추가하세요.
};

// ============================================================
// 부품종류별 아이콘 (SVG)
// ============================================================
const categoryIcons = {
  '베어링': (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="18" />
      <circle cx="24" cy="24" r="6" />
      <circle cx="24" cy="12" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="34.4" cy="18" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="34.4" cy="30" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="24" cy="36" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="13.6" cy="30" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="13.6" cy="18" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  '오일필터': (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="8" width="20" height="32" rx="4" />
      <line x1="14" y1="16" x2="34" y2="16" />
      <line x1="16" y1="22" x2="32" y2="22" />
      <line x1="16" y1="27" x2="30" y2="27" />
      <line x1="16" y1="32" x2="28" y2="32" />
    </svg>
  ),
  '벨트': (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="24" r="7" />
      <circle cx="36" cy="24" r="7" />
      <line x1="12" y1="17" x2="36" y2="17" />
      <line x1="12" y1="31" x2="36" y2="31" />
    </svg>
  ),
  '패킹': (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="24" cy="24" rx="16" ry="8" />
      <ellipse cx="24" cy="20" rx="16" ry="8" />
      <ellipse cx="24" cy="16" rx="16" ry="8" />
    </svg>
  ),
  '볼트/너트': (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="24,6 30,12 30,18 24,22 18,18 18,12" />
      <line x1="24" y1="22" x2="24" y2="42" />
      <line x1="20" y1="27" x2="28" y2="27" />
      <line x1="20" y1="31" x2="28" y2="31" />
      <line x1="20" y1="35" x2="28" y2="35" />
    </svg>
  ),
  '감속기': (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="14" width="14" height="20" rx="2" />
      <rect x="26" y="10" width="14" height="28" rx="2" />
      <circle cx="15" cy="24" r="4" />
      <circle cx="33" cy="24" r="6" />
      <line x1="22" y1="20" x2="26" y2="20" />
      <line x1="22" y1="28" x2="26" y2="28" />
    </svg>
  ),
  '베어링': (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="18" />
      <circle cx="24" cy="24" r="6" />
      <circle cx="24" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="34.4" cy="18" r="2" fill="currentColor" stroke="none" />
      <circle cx="34.4" cy="30" r="2" fill="currentColor" stroke="none" />
      <circle cx="24" cy="36" r="2" fill="currentColor" stroke="none" />
      <circle cx="13.6" cy="30" r="2" fill="currentColor" stroke="none" />
      <circle cx="13.6" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),
  '계장부품': (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 38a14 14 0 1 1 28 0" />
      <path d="M24 38V20l6 4" />
      <line x1="14" y1="30" x2="16" y2="32" />
      <line x1="32" y1="30" x2="34" y2="32" />
    </svg>
  ),
  '기타': (
    <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12h32M8 24h32M8 36h32" />
      <rect x="6" y="6" width="36" height="36" rx="4" />
    </svg>
  ),
};

const defaultIcon = (
  <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="32" height="32" rx="4" />
    <line x1="8" y1="20" x2="40" y2="20" />
    <line x1="16" y1="30" x2="32" y2="30" />
  </svg>
);

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
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [facilities, setFacilities] = useState([]);
  

  // ✨ 알림 체크 (앱 시작 및 주기적)
   useEffect(() => {
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
    
    loadCategories();
    loadAlerts();
  }, []);

  // 1. 메인에서 공정(시트) 클릭 시 실행
  const handleSheetClick = (sheetName) => {
    setSelectedSheet(sheetName);
    
    // 전체 데이터에서 해당 시트 데이터만 필터링
    const sheetItems = inventoryData.filter(item => item.원본시트 === sheetName);
    
    // 해당 시트 내의 '적용설비' 중복 제거하여 추출
    const uniqueFacilities = [...new Set(sheetItems.map(item => item.적용설비))];
    
    setFacilities(uniqueFacilities);
    setPage('facility'); // 설비 선택 페이지로 이동
  };

  // 2. 설비 페이지에서 특정 설비 클릭 시 실행
  const handleFacilityClick = (facilityName) => {
    // 해당 공정 + 해당 설비 조건에 맞는 부품만 필터링
    const filteredItems = inventoryData.filter(item => 
      item.원본시트 === selectedSheet && item.적용설비 === facilityName
    );
    
    setDetailItems(filteredItems); 
    setSelectedCategory(facilityName); // 상세페이지 제목으로 표시
    setPage('detail'); // 부품 리스트(상세) 페이지로 이동
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
    // 💡 변경: 가공된 카테고리가 아니라 전체 리스트(/inventory)를 가져옵니다.
    const res = await axios.get(`${BASE_URL}/inventory`); 
    const allData = res.data.data;
    
    setInventoryData(allData); // 전체 데이터 저장
    
    // (기존 요약 기능 등을 위해 필요하다면 아래처럼 활용 가능)
    // setCategories(res.data.categories); 
  } catch (err) {
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
      console.error('알림 로드 실패:', err);
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
    await loadCategories();
    await loadAlerts();
    if (page === 'detail' && selectedCategory) {
      const res = await axios.get(`${BASE_URL}/inventory/category/${encodeURIComponent(selectedCategory)}`);
      setDetailItems(res.data.data);
    }
  }

  const renderPage = () => {
  if (loading) return <div className="loading-spinner"><div className="spinner"></div><p>로드 중...</p></div>;

  switch (page) {
    case 'detail': // 3단계: 특정 설비의 부품 리스트 및 수정
      return (
        <DetailPage
          items={detailItems}
          categoryName={selectedCategory} // 이제 '설비명'이 될 것입니다.
          onBack={() => setPage('facility')} // 뒤로가기 시 설비 선택 화면으로
          onUpdate={refreshData}
          userName={userName}
          highlightId={highlightId}
        />
      );

    case 'facility': // 2단계: 공정 내의 '적용설비' 리스트 선택 화면
      return (
        <FacilityPage
          selectedSheet={selectedSheet} // 선택된 공정 (충전/타정 등)
          items={categories.filter(item => item.원본시트 === selectedSheet)} // 해당 공정 데이터만
          onFacilityClick={handleFacilityClick}
          onBack={() => setPage('main')} // 뒤로가기 시 공정 선택(Main)으로
        />
      );

    case 'summary':
      return <SummaryPage summary={summary} onBack={() => setPage('main')} />;
    
    case 'logs':
      return <LogsPage onBack={() => setPage('main')} />;

    default: // 1단계: 메인화면 (공정 선택)
        return (
          <MainPage
            onSheetClick={(sheetName) => {
              setSelectedSheet(sheetName);
              // ✨ [로직 추가] 선택한 공정(시트)에 해당하는 설비들만 중복 없이 추출
              const sheetItems = inventoryData.filter(item => item.원본시트 === sheetName);
              const uniqueFacilities = [...new Set(sheetItems.map(item => item.적용설비))];
              setFacilities(uniqueFacilities); 
              setPage('facility'); 
            }}
            onSummaryClick={loadSummary}
            alerts={alerts}
            onSearch={handleSearch}
            searchResults={searchResults}
            isSearching={isSearching}
            onSearchResultClick={(item) => {
              setHighlightId(item.id);
              // 검색 결과 클릭 시 해당 아이템의 상세 정보로 바로 이동하는 로직
              const filtered = inventoryData.filter(d => 
                d.원본시트 === item.원본시트 && d.적용설비 === item.적용설비
              );
              setDetailItems(filtered);
              setSelectedSheet(item.원본시트);
              setSelectedCategory(item.적용설비);
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
            이력
          </button>
          <button className="nav-btn summary-btn" onClick={loadSummary}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            전체 요약
          </button>
        </div>
      </header>

      <main className="main-content">
        {error && <div className="error-bar">{error}</div>}
        {renderPage()}
      </main>

      <AIChatBar onInventoryUpdate={refreshData} />
    </div>
  );
}

const processIcons = {
  '충전': (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 42h16V18L24 6l-8 12v24z" />
      <path d="M16 18h16" /><path d="M20 18v-4a4 4 0 0 1 8 0v4" />
      <rect x="14" y="32" width="20" height="10" rx="1" />
    </svg>
  ),
  '타정': (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="18" /><circle cx="24" cy="24" r="12" strokeDasharray="3 3" />
      <path d="M12 24h24M24 12v24" strokeOpacity="0.3" /><path d="M7 7l4 4M37 37l4 4" />
    </svg>
  ),
  '제조': (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 10v20c0 5 6 8 14 8s14-3 14-8V10" />
      <path d="M10 15c0 3 6 5 14 5s14-2 14-5" /><path d="M24 20v12" />
      <path d="M18 32h12M20 28h8" /><path d="M8 8h32" />
    </svg>
  ),
  '공통': (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 14l18-8 18 8v20l-18 8-18-8V14z" />
      <path d="M6 14l18 8 18-8M24 22v20" />
    </svg>
  )
};

// 2. 컴포넌트 시작 (onSheetClick으로 변경)
function MainPage({ onSheetClick, onSummaryClick, alerts, onSearch, searchResults, isSearching, onSearchResultClick }) {
  const [searchQuery, setSearchQuery] = useState('');

  const processSheets = [
    { name: '충전', desc: '립스틱 / 틴트' },
    { name: '타정', desc: '파우더 / 팩트' },
    { name: '제조', desc: '원료 배합 / 탱크' },
    { name: '공통', desc: '공용 및 기타' }
  ];

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="main-page">
      <div className="page-header">
        <h1>스페어파츠 재고 관리</h1>
        <p className="page-subtitle">생산 공정을 선택하여 설비별 재고를 확인하세요</p>
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
            placeholder="모델명, 적용설비 검색..."
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
                  <span className="search-result-category">[{item.원본시트}] {item.부품종류}</span>
                  <span className={`search-result-qty ${item.현재수량 <= item.최소보유수량 ? 'low' : ''}`}>{item.현재수량}개</span>
                </div>
                <div className="search-result-model">{item.모델명}</div>
                <div className="search-result-facility">{item.적용설비}</div>
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

      {/* ✨ 공정 버튼 그리드 (카테고리 대신 공정으로 변경) */}
      <div className="category-grid">
        {processSheets.map((sheet) => (
          <button
            key={sheet.name}
            className="category-card"
            onClick={() => onSheetClick(sheet.name)}
          >
            <div className="category-icon-wrap">
              {processIcons[sheet.name]}
            </div>
            <div className="category-label">{sheet.name}</div>
            <div className="category-meta">
              <span className="category-count">{sheet.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
// ============================================================
// FacilityPage (2단계 — 공정 내 설비 리스트 선택)
// ============================================================
function FacilityPage({ selectedSheet, facilities, onFacilityClick, onBack, inventoryData }) {
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

      <div className="category-grid" style={{ marginTop: '20px' }}>
        {facilities.map((facility) => {
          // 해당 설비의 전체 부품 추출
          const facilityItems = inventoryData.filter(item => 
            item.원본시트 === selectedSheet && item.적용설비 === facility
          );
          // 재고 부족 항목 계산
          const lowStockCount = facilityItems.filter(item => 
            item.최소보유수량 > 0 && item.현재수량 <= item.최소보유수량
          ).length;

          return (
            <button
              key={facility}
              className={`category-card ${lowStockCount > 0 ? 'has-low-stock' : ''}`}
              onClick={() => onFacilityClick(facility)}
              style={{ minHeight: '140px' }}
            >
              <div className="category-icon-wrap" style={{ background: '#f0f9ff' }}>
                <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 36v-6l6-10h24l6 10v6H6zM14 20V10l10-4 10 4v10" />
                  <circle cx="16" cy="30" r="2" fill="currentColor" />
                  <circle cx="32" cy="30" r="2" fill="currentColor" />
                </svg>
              </div>
              <div className="category-label" style={{ fontSize: '1.1rem' }}>{facility}</div>
              <div className="category-meta">
                <span className="category-count">{facilityItems.length}개 품목</span>
                {lowStockCount > 0 && (
                  <span className="low-stock-badge">⚠️ {lowStockCount}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
// ============================================================
// DetailPage (카테고리 클릭 후 리스트 + ✨ 수동 수정 UI)
// ============================================================
function DetailPage({ items, categoryName, onBack, onUpdate, userName, highlightId }) { 
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

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
    try {
      setIsSaving(true);
      await axios.post(`${BASE_URL}/inventory/manual-update`, {
        id: item.id,
        현재수량: editValue,
        action: '수량변경', 
        user: userName 
      });
      setEditingId(null);
      await onUpdate(); 
    } catch (err) {
      alert('저장 실패: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };


  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12,19 5,12 12,5" />
          </svg>
          뒤로
        </button>
        <div className="detail-category-header">
  <h2 className="main-cat-title">{items[0]?.대분류 || categoryName}</h2>
  <span className="sub-cat-badge">{categoryName}</span>
</div>
      </div>

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
    {/* ✨ 부품종류(소분류) 텍스트 태그 추가 */}
    <span className="sub-category-tag">{item.부품종류}</span>
    
    <span className="detail-model">{item.모델명}</span>
    {isLow && <span className="low-stock-badge-inline">⚠️ 재고부족</span>}
  </div>
    {!isEditing && (
                  <span className={`detail-quantity ${isLow ? 'text-red' : ''}`}>
                    {item.현재수량} <small>개</small>
                  </span>
                )}
              </div>

              <div className="detail-card-body">
                <div className="detail-info-row">
                  <span className="detail-info-label">적용설비</span>
                  <span className="detail-info-value">{item.적용설비}</span>
                </div>
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
function SummaryPage({ summary, onBack }) {
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
          <div className="low-stock-table">
            <table>
              <thead>
                <tr>
                  <th>부품종류</th>
                  <th>모델명</th>
                  <th>적용설비</th>
                  <th>현재수량</th>
                  <th>최소보유수량</th>
                </tr>
              </thead>
              <tbody>
                {summary.lowStockItems.map((item) => (
                  <tr key={item.id}>
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
// ✨ LogsPage (재고 변경 이력)
// ============================================================
function LogsPage({ onBack }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/inventory/logs?limit=100`);
      setLogs(res.data.data);
    } catch (err) {
      console.error('로그 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading-spinner"><div className="spinner"></div><p>로드 중...</p></div>;

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

      <div className="logs-list">
        {logs.length === 0 && <div className="logs-empty">변경 이력이 없습니다</div>}
        {logs.map(log => (
          <div key={log.id} className={`log-item ${log.action}`}>
            <div className="log-header">
              <span className={`log-action ${log.action === '입고' ? 'in' : log.action === '출고' ? 'out' : 'edit'}`}>
                {log.action === '입고' ? '📥' : log.action === '출고' ? '📤' : '✏️'} {log.action}
              </span>
              <span className="log-time">{log.timestampKR}</span>
            </div>
            <div className="log-body">
              <div className="log-item-name">
                <span className="log-category">{log.부품종류}</span>
                <span className="log-model">{log.모델명}</span>
              </div>
              <div className="log-quantity">
                <span className="log-qty-before">{log.변경전수량}</span>
                <span className="log-qty-arrow">→</span>
                <span className={`log-qty-after ${log.변경수량 > 0 ? 'positive' : 'negative'}`}>
                  {log.변경후수량}
                </span>
                <span className={`log-qty-change ${log.변경수량 > 0 ? 'positive' : 'negative'}`}>
                  ({log.변경수량 > 0 ? '+' : ''}{log.변경수량})
                </span>
              </div>
              <div className="log-meta">
                <span>📍 {log.적용설비}</span>
                <span style={{ margin: '0 8px', color: '#ccc' }}>|</span>
                <span className="log-user-badge">👤 {log.user || '시스템'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// AIChatBar (하단 고정 AI 채팅 한 줄)
// ============================================================
function AIChatBar({ onInventoryUpdate }) {
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
        user: localStorage.getItem('inventory_user') || '미확인 사용자' // 실제 사용자 이름 전달
      });

      let aiText = res.data.message;
      
      if (res.data.inventoryUpdated && res.data.updateResult) {
        const { action, items } = res.data.updateResult;
        const itemsText = items.map(i => `${i.모델명} ${i.수량}개`).join(', ');
        aiText += `\n\n✅ ${action} 완료: ${itemsText}`;
        
        // ✅ 재고 업데이트 후 데이터 새로고침
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

export default App;