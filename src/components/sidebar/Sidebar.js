import { useEffect, useState } from 'react';
import { sideBarItems, fontAwesomeIcons } from '@services/utils/static.data';
import '@components//sidebar/Sidebar.scss';
import { useSocialNavigation } from '@hooks/useSocialNavigation';

const Sidebar = () => {
  const [sidebar, setSideBar] = useState([]);
  const { checkUrl, navigateToPage } = useSocialNavigation();

  useEffect(() => {
    setSideBar(sideBarItems);
  }, []);

  return (
    <div className="app-side-menu">
      <div className="side-menu">
        <ul className="list-unstyled">
          {sidebar.map((data) => (
            <li key={data.index} onClick={() => navigateToPage(data.name, data.url)}>
              <div data-testid="sidebar-list" className={`sidebar-link ${checkUrl(data.name) ? 'active' : ''}`}>
                <div className="menu-icon">{fontAwesomeIcons[data.iconName]}</div>
                <div className="menu-link">
                  <span>{`${data.name}`}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
