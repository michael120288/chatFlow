import { sideBarItems, fontAwesomeIcons } from '@services/utils/static.data';
import { useSocialNavigation } from '@hooks/useSocialNavigation';
import '@components/bottom-nav/BottomNav.scss';

const BOTTOM_NAV_INDICES = [1, 2, 3, 8, 4];

const BottomNav = () => {
  const { checkUrl, navigateToPage } = useSocialNavigation();
  const items = sideBarItems.filter((item) => BOTTOM_NAV_INDICES.includes(item.index));

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map((item) => (
        <button
          key={item.index}
          className={`bottom-nav-item ${checkUrl(item.name) ? 'bottom-nav-item--active' : ''}`}
          onClick={() => navigateToPage(item.name, item.url)}
          aria-label={item.name}
          aria-current={checkUrl(item.name) ? 'page' : undefined}
        >
          <span className="bottom-nav-icon">{fontAwesomeIcons[item.iconName]}</span>
          <span className="bottom-nav-label">{item.name}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
