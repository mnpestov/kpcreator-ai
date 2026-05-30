import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@skbkontur/react-ui";
import "./Home.css";
import { MainApi } from "../../utils/MainApi";
import useKpStore from '../../hooks/useKpStore';
import PageContainer from "../../components/Layout/PageContainer";
import PageHeader from "../../components/Layout/PageHeader";
import KpCard from "../../components/common/KpCard/KpCard";

function Home({ dispatch, setIsNewKp }) {
  const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#888' }}>
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  const [searchNumber, setSearchNumber] = useState("");
  const [lastKps, setLastKps] = useState([]);
  const { resetFormData, resetListsKp } = useKpStore();

  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    MainApi.getLastKps()
      .then(data => setLastKps(data))
      .catch(err => console.error("Ошибка загрузки последних КП:", err));
  }, []);

  const navigate = useNavigate();

  const handleSearch = e => {
    e.preventDefault();
    if (searchNumber.trim() !== "") {
      navigate(`/kp/${searchNumber.trim()}`);
    }
  };

  const handleCreatNewKp = () => {
    resetFormData()
    resetListsKp();
    setIsNewKp(true)
    navigate('/new');
  }

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const visibleKps = Array.isArray(lastKps) ? lastKps.slice(0, visibleCount) : [];
  const hasMore = Array.isArray(lastKps) && visibleCount < lastKps.length;

  return (
    <PageContainer maxWidth="1000px">
      <PageHeader
        title="Коммерческие предложения"
        subtitle="Список последних КП и поиск"
        actions={
          <>
            <Button
              use="success"
              onClick={handleCreatNewKp}
            >
              Создать новое КП
            </Button>
            <form onSubmit={handleSearch} style={{ margin: 0, display: 'flex' }}>
              <Input
                placeholder="Номер КП..."
                value={searchNumber}
                onValueChange={setSearchNumber}
                width="150px"
                rightIcon={<span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', height: '100%', paddingRight: '4px' }} onClick={handleSearch}><SearchIcon /></span>}
              />
            </form>
          </>
        }
      />
      <div className="home">
        {/* Последние КП */}
        <div className="home__recent">

          {visibleKps.length > 0 ? (
            <div className="home__stream">
              {visibleKps.map((kp) => (
                <KpCard 
                  key={kp.id} 
                  kp={kp} 
                  onClick={() => navigate(`/kp/${kp.kpNumber}`)} 
                />
              ))}
            </div>
          ) : (
            <p className="home__no-kp">Нет данных для отображения.</p>
          )}

          {hasMore && (
            <div className="home__load-more">
              <button className="load-more-btn" onClick={handleLoadMore}>Загрузить ещё</button>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default Home;
