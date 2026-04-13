import { Outlet } from 'react-router-dom';
import '@pages/social/Social.scss';
import Header from '@components/header/Header';
import Sidebar from '@components/sidebar/Sidebar';
import BottomNav from '@components/bottom-nav/BottomNav';

const Social = () => {
  return (
    <>
      <Header />
      <div className="dashboard">
        <div className="dashboard-sidebar">
          <Sidebar />
        </div>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
      <BottomNav />
    </>
  );
};
export default Social;
