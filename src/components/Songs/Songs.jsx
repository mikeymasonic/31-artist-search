import React from 'react';
import PropTypes from 'prop-types';
import Song from './Song';
import styles from './Songs.css';

const Songs = ({ songsArray, artistName }) => {
  const songList = songsArray.map(({ songTitle, songId }) => (
    <li key={songId}>
      <Song
        songTitle={songTitle}
        artistName={artistName}
      />
    </li>
  ));

  return (
    <ul className={styles.songs}>
      {songList}
    </ul>
  );
};

Songs.propTypes = {
  songsArray: PropTypes.arrayOf(PropTypes.shape({
    songTitle: PropTypes.string.isRequired,
    songId: PropTypes.string
  })).isRequired,
  artistName: PropTypes.string.isRequired
};

export default Songs;
