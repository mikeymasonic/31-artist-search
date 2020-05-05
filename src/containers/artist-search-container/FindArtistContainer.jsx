import React, { Component } from 'react';
import Artists from '../../components/Artists/Artists';
import SearchArtist from '../../components/Search-Artist/SearchArtist';
import { getArtists } from '../../services/getArtistsDetailsAPI';
import PropTypes from 'prop-types';
import Paging from '../../components/Paging/Paging';
import Nav from '../nav/Nav';

export default class FindArtistsContainer extends Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object
  }

  state = {
    artistArray: [],
    artist: '',
    loading: false,
    error: null,
    page: 1,
    totalPages: 1
  }

  onInputChange = ({ target }) => {
    this.setState({ artist: target.value }, () => {
      this.props.history.push(`/?query=${this.state.artist}`);
    });
  }

  fetchArtists = () => {
    return getArtists(this.state.artist, this.state.page)
      .then(({ totalPages, singers }) => {
        this.setState({
          artistArray: singers,
          loading: false,
          totalPages: Math.ceil(totalPages / 25)
        });
      })
      .catch(err => this.setState({
        error: err,
        loading: true
      }));
  }

  onButtonClick = (event) => {
    event.preventDefault();
    this.setState({ loading: true, page: 1 }, () => this.fetchArtists());
  }

  changePageCount = (page) => {
    this.setState({ page });
    this.props.history.push(`/?query=${this.state.artist}&page=${page}`);
  }

  componentDidMount() {
    const searchArtist = new URLSearchParams(this.props.location.search);
    const queryArtist = searchArtist.get('query') || '';
    const page = parseInt(searchArtist.get('page')) || 1;
    if(queryArtist) {
      this.setState({ artist: queryArtist, page }, () => {
        return this.fetchArtists();
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.page !== this.state.page) return this.fetchArtists();
  }

  render() {
    const {
      artistArray,
      artist,
      loading,
      error,
      page,
      totalPages
    } = this.state;

    if(error) return (
      <section>
        <h2>Srry, no artist matches that name...</h2>
      </section>
    );

    if(loading) return (
      <section>
        <h3>loading...</h3>
      </section>
    );

    if(totalPages === 1) return (
      <section>
        <h2>Search for an artist....</h2>
        <SearchArtist
          artist={artist}
          onButtonClick={this.onButtonClick}
          onInputChange={this.onInputChange}
        />
        <Artists artistArray={artistArray} />
      </section>
    );

    if(totalPages === 0) return (
      <section>
        <Nav />
        <h2>Srry, no artist matches that name...</h2>
      </section>
    );

    return (
      <section>
        <h2>Search for an artist...</h2>
        <SearchArtist
          artist={artist}
          onButtonClick={this.onButtonClick}
          onInputChange={this.onInputChange}
        />
        <Paging
          onClickPrevious={() => this.changePageCount(page - 1)}
          onClickNext={() => this.changePageCount(page + 1)}
          disableNext={totalPages === page}
          disablePrev={page === 1}
          currentPage={page}
          totalPages={totalPages}
        />
        <Artists artistArray={artistArray} />
      </section>
    );
  }
}

