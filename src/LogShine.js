import React, { Component } from 'react';
import ReactInterval from 'react-interval';
import axios from 'axios';
import './LogShine.css';

class LogShine extends Component {

  constructor(props) {
    super(props);
    this.state = {
      systemID: this.props.systemID,
      groupID: this.props.groupID,
      query: this.props.query,
      minID: null,
      maxID: null,
      follow: true,
      status: null,
      loading: false,
      errorMsg: null,
      events: []
    };
    this.instance = axios.create({
      baseURL: 'https://papertrailapp.com/api/v1',
      headers: {'X-Papertrail-Token': this.props.token}
    });
  }

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = (showLoading = true) => {
    if(showLoading)
      this.setState({loading: true});

    let params = {
      q: this.state.query,
      system_id: this.state.systemID,
      group_id: this.state.groupID,
      tail: this.state.follow
    }

    if (this.state.follow && this.state.maxId)
      params.min_id = this.state.maxID

    this.instance.get('events/search.json', {params: params})
    .then(function (response) {
      this.setState({
          loading: false,
          status: response.status,
          minID: response.data.min_id,
          maxID: response.data.max_id,
          events: this.state.events.concat(response.data.events)
        }
      );
      this.scrollBottom()
    }.bind(this))
    .catch(function (error) {
      this.setState({loading: false, errorMsg: error.message});
    }.bind(this));
  }

  scrollBottom() {
    this.refs.eventList.scrollTop = this.refs.eventList.scrollHeight;
  }

  submitQueryKeyUp = (event) => {
    if (event.key === 'Enter') {
      let searchQueryInput = this.refs.searchQueryInput
      this.setState({events: [], query: searchQueryInput.value}, this.fetchEvents);
    }
  }

  followStatusClicked = (event) => {
    this.setState({follow: !this.state.follow});
  }

  systemClicked = (event) => {
    let systemID = event.currentTarget.getAttribute('data-system-id');
    if (systemID) {
      this.setState({events: [], systemID: systemID, query: null}, this.fetchEvents)
    };
  }

  programClicked = (event) => {
    let systemID = event.currentTarget.getAttribute('data-system-id');
    let program = event.currentTarget.getAttribute('data-program');
    if (systemID && program) {
      this.setState({events: [], systemID: systemID, query: `program:${program}`}, this.fetchEvents)
    };
  }

  render() {
    let li;
    let topToolbar;
    let followBtnText = !this.state.follow ? 'Follow: OFF' : 'Follow: ON'
    let followBtnClassName = !this.state.follow ? 'LogShine follow-icon pointer' : 'LogShine follow-icon pointer'

    if (this.state.loading) {
      li = <li className="LogShine event"
               style={{color: this.props.messageColor}}>
               Fetching...
           </li>
    }
    else if (this.state.status === 200) {
      let self = this;
      li = this.state.events.map(function(event) {
        if (self.props.rowFormat) {
          return self.props.rowFormat(event)
        }
        else {
          return (
            <li className="LogShine event" key={event.id}>
              <time className="LogShine date"
                style={{color: self.props.dateTimeColor}}>
                {event.generated_at}
              </time>
              <span className="LogShine system">
                <a className="LogShine pointer"
                   style={{color: self.props.systemColor}}
                   alt={event.hostname}
                   data-system-name={event.source_name}
                   data-system-id={event.source_id}
                   onClick={self.systemClicked}>
                   ({event.hostname})
                </a>
              </span>
              <span className="LogShine program">
                <a className="LogShine pointer"
                   style={{color: self.props.programColor}}
                   alt={event.program}
                   data-system-name={event.source_name}
                   data-system-id={event.source_id}
                   data-program={event.program}
                   onClick={self.programClicked}>
                   [{event.program}]
                </a>
              </span>
              <span style={{color: self.props.messageColor}}
                className="LogShine message">
                {event.message}
              </span>
            </li>
          );
        }
      })
    }
    else {
      li = <li className=" LogShine event"
               style={{color: this.props.messageColor}}>
               {this.state.errorMsg}
          </li>
    }

    if (this.props.showTopToolbar === true)
      topToolbar = <div className="LogShine toolbar top-toolbar"
                           style={{backgroundColor: this.props.topToolbarBackgroundColor}}>
        <div className="LogShine search">
          <div className="LogShine query-wrapper">
            <input id="search-query-input"
                   ref="searchQueryInput"
                   className="LogShine input text"
                   type="text"
                   placeholder='Enter search terms…'
                   value={this.props.query || undefined}
                   onKeyUp={this.submitQueryKeyUp}
                   readOnly={this.props.query ? true : false}
                   autoComplete="off"
                   autoCapitalize="off"
                   autoCorrect="off"
            />
          </div>
        </div>
        <div className="LogShine follow-status">
          <a id="follow-status-btn"
             className={followBtnClassName}
             onClick={this.followStatusClicked}>
             {followBtnText}
          </a>
        </div>
      </div>

    return (
      <div className="LogShine" style={{width: this.props.width}}>
        <ReactInterval timeout={this.props.delay * 1000} enabled={this.state.follow} callback={() => this.fetchEvents(false)} />
        {topToolbar}
        <ul className="LogShine events event-list"
            style={{height: this.props.height, backgroundColor: this.props.backgroundColor}}
            ref="eventList">
          {li}
        </ul>
      </div>
    );
  }
}


LogShine.propTypes = {
  token: React.PropTypes.string.isRequired,
  height: React.PropTypes.string,
  width: React.PropTypes.string,
  query: React.PropTypes.string,
  follow: React.PropTypes.bool,
  delay: React.PropTypes.number,
  systemID: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
  groupID: React.PropTypes.number,
  showTopToolbar: React.PropTypes.bool,
  backgroundColor: React.PropTypes.string,
  dateTimeColor: React.PropTypes.string,
  systemColor: React.PropTypes.string,
  programColor: React.PropTypes.string,
  messageColor: React.PropTypes.string,
  topToolbarBackgroundColor: React.PropTypes.string,
  rowFormat: React.PropTypes.func
};

LogShine.defaultProps = {
  height: '500px',
  width: '100%',
  query: null,
  follow: true,
  delay: 10,
  systemID: null,
  groupID: null,
  showTopToolbar: true,
  backgroundColor: '#252830',
  dateTimeColor: '#e4d836',
  systemColor: '#1bc98e',
  programColor: '#9f86ff',
  messageColor: '#ffffff',
  topToolbarBackgroundColor: '#1bc98e',
  rowFormat: null
};

export default LogShine;
