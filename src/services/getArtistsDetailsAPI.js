export const getArtists = (artistName, page) => {
  return fetch(`https://musicbrainz.org/ws/2/artist?query=${artistName}&fmt=json&limit=25&offset=${(page - 1) * 25}`)
    .then(res => {
      if(!res.ok) throw 'Unable to load artists, srry!';

      return res.json();
    })
    .then(({ count, artists }) => {
      // const totalPages = count;
      const totalPages = Math.ceil(count / 25);
      const singers = artists.map(singer => ({
        artistId: singer.id,
        artistName: singer.name
      }));
      return {
        singers,
        totalPages
      };
    });
};

export const getArtistReleases = (artistId, page) => {
  return fetch(`https://musicbrainz.org/ws/2/release?artist=${artistId}&fmt=json&limit=25&offset=${(page - 1) * 25}`)
    .then(res => {
      if(!res) throw 'Unable to load releases, srry!';

      return res.json();
    })
    .then((data) => {
      const totalPages = data['release-count'];
      const albums = data.releases.map(album => ({
        releaseId: album.id,
        releaseTitle: album.title,
        releaseDate: album['release-events'][0].date,
        coverArtCount: album['cover-art-archive'].front
      }));
      return {
        albums,
        totalPages
      };
    });
};

export const getSongs = (releaseId) => {
  return fetch(`https://musicbrainz.org/ws/2/recording?release=${releaseId}&fmt=json`)
    .then(res => {
      if(!res.ok) throw res.status;

      return res.json();
    })
    .then(({ recordings }) => {
      const songs = recordings.map(song => ({
        songId: song.id,
        songTitle: song.title
      }));
      return {
        songs
      };
    });
};

export const getLyrics = (artistName, songTitle) => {
  return fetch(`https://api.lyrics.ovh/v1/${artistName}/${songTitle}`)
    .then(res => {
      if(!res.ok) throw 'Unable to load lyrics...';

      return res.json();
    })
    .then((data) => {
      const lyrics = data.lyrics;
      return {
        lyrics
      };
    });
};
