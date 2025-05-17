// components/Offre/FavoriteIcon.js

import React from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

const FavoriteIcon = ({ isFavorite, onClick }) => {
  return (
    <div className="favorite-icon" onClick={onClick} style={{ cursor: 'pointer' }}>
      {isFavorite ? <FaHeart color="gray" /> : <FaRegHeart color="gray" />}
    </div>
  );
};

export default FavoriteIcon;
