import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class ChooseCampaign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null
    }
    this.handleOptionChange = this.handleOptionChange.bind(this)
  }

  handleOptionChange(e) {
    this.setState({
      selectedOption: e.target.value
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const selectedOption = this.state.selectedOption;
    console.log('You have selected:', selectedOption);
    if(selectedOption === 'no-match') {
      this.props.router.push('/new-campaign/address')
    }
  }

  renderNearbyCampaigns(nearbyCampaignsArr, selectedOption, handleOptionChange) {
    return (
      nearbyCampaignsArr.map(c => (
        <div className="radio" key={c.street_address}>
          <label>
            <input
              type="radio"
              value={c.street_address}
              checked={selectedOption === c.street_address }
              onChange={(e) => handleOptionChange(e)} />
            { c.street_address }
          </label>
      </div>)
      )
    );
  }

  render() {
    const renderNearby = this.renderNearbyCampaigns;
    const { error, nearbyCampaigns, loading, loaded } = this.props.initialSearch;
    return (
      <div className="temporary-results-box">
        { loading && <p> Searching... </p> }
        { !loading && error && error.searchError && <p>{error.userMessage}</p> }
        { loaded && nearbyCampaigns && Array.isArray(nearbyCampaigns) &&
        <form>
          <p>{"We found these campaigns near you."}</p>
          <p>{"Do any of these campaigns represent where you live?"}</p>
          {renderNearby(nearbyCampaigns, this.state.selectedOption, this.handleOptionChange)}
          <div className="radio" key="no-match">
            <label>
              <input
                type="radio"
                value="no-match"
                checked={this.state.selectedOption === "no-match"}
                onChange={(e) => this.handleOptionChange(e)} />
              { "None of these match my address. Let's start a new campaign." }
            </label>
          </div>
        </form>
        }
        { !loading && nearbyCampaigns && nearbyCampaigns.status === 'okay' && !nearbyCampaigns.results &&
        <p>{"We didn't find any campaigns near you. Would you like to start one?"}</p>
        }
        <button className="btn" type="submit" onClick={(e) => this.handleFormSubmit(e)}>Next</button>
      </div>
    );
  }
}

export default connect(
  ({ initialSearch }) => ({ initialSearch }))(withRouter(ChooseCampaign));
