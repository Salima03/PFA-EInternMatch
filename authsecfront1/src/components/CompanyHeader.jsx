import React from 'react';
import NotificationDropdown from './NotificationDropdown';
import SearchProfiles from '../components/SearchProfiles';

const CompanyHeader = ({ userId }) => {
  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <SearchProfiles />
      </div>
      <div style={styles.right}>
        {userId && <NotificationDropdown userId={userId} />}
      </div>
    </header>
  );
};

export default CompanyHeader;

// 🎨 STYLES (inline avec JSX)
const styles = {
  header: {
    display: 'flex',
    //alignItems: 'center',
    //justifyContent: 'space-between',
    backgroundColor: ' #e0f2f1',
    padding: '5px 30px',
    borderBottom: '1px solid #ddd',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  left: {
    flex: 1,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
};
