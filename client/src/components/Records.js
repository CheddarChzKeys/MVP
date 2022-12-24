import React, { Component } from "react";
import Accolades from "./Accolades.js";

import { css } from "@emotion/react";
import MoonLoader from "react-spinners/MoonLoader";

const axios = require("axios").default;

class StatsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullStats: [],
      weekStats: [],
      sort: null,
      loading: true,
    };

    this.props.changeClicked("records");
    this.override = css`
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 2% auto;
    `;
  }

  moonLoader() {
    return (
      <MoonLoader
        color="#79d9ff"
        loading={this.state.loading}
        css={this.override}
        size="150px"
      />
    );
  }

  componentDidMount() {
    this.props.changeBackground("./Backgrounds/season1.png");
    this.props.getMemberList();
    this.getDbStats();
  }

  getDbStats() {
    axios.get("/getDbStats").then((results) => {
      console.log("getWeekStats results:", results);
      results.data.weeklyStats = results.data.weeklyStats.sort((a, b) =>
        a["kdRatio"] < b["kdRatio"] ? 1 : -1
      );
      results.data.lifetimeStats = results.data.lifetimeStats.sort((a, b) =>
        a["kdRatio"] < b["kdRatio"] ? 1 : -1
      );
      this.setState({
        weekStats: results.data.weeklyStats,
        fullStats: results.data.lifetimeStats,
        loading: false,
      });
    });
  }

  sortBy(whichStats, property) {
    let newList = [];
    if (
      this.state[whichStats][0][property] <
      this.state[whichStats][this.state[whichStats].length - 1][property]
    ) {
      newList = this.state[whichStats]
        .slice()
        .sort((a, b) => (a[property] < b[property] ? 1 : -1));
    } else {
      newList = this.state[whichStats]
        .slice()
        .sort((a, b) => (a[property] > b[property] ? 1 : -1));
    }
    const newState = {};
    const key = whichStats;
    newState[key] = newList;
    this.setState(newState);
  }

  render() {
    return (
      <div className="mainComponent" id="recordsDiv">
        <div className="componentBox">
          <h1 className="componentHeader" id="accoladesHeader">
            Weekly Accolades
          </h1>
          {this.state.loading ? (
            this.moonLoader()
          ) : (
            <Accolades
              weekStats={this.state.weekStats}
              memberList={this.props.memberList}
            />
          )}
        </div>
        {/* Stat Tables */}
        <div className="componentBox">
          <h1 className="componentHeader">Weekly Stats</h1>
          {this.state.loading ? (
            this.moonLoader()
          ) : (
            <table id="rankings">
              <thead id="thead">
                <th className="position" id="positionHead">
                  #
                </th>
                <th className="gamerTag" id="gamerTagHead">
                  GamerTag
                </th>
                <th
                  className="KDR"
                  id="KDRHead"
                  onClick={() => this.sortBy("weekStats", "kdRatio")}
                >
                  KDR
                </th>
                <th
                  className="wins"
                  id="winsHead"
                  onClick={() => this.sortBy("weekStats", "killsPerGame")}
                >
                  Kills/Game
                </th>
                <th
                  className="games"
                  id="gamesHead"
                  onClick={() => this.sortBy("weekStats", "matchesPlayed")}
                >
                  Games
                </th>
                <th
                  className="kills"
                  id="killsHead"
                  onClick={() => this.sortBy("weekStats", "kills")}
                >
                  Kills
                </th>
                <th
                  className="deaths"
                  id="deathsHead"
                  onClick={() => this.sortBy("weekStats", "deaths")}
                >
                  Deaths
                </th>
                <th
                  className="downs"
                  id="downsHead"
                  onClick={() => this.sortBy("weekStats", "assists")}
                >
                  Assists
                </th>
                <th
                  className="revives"
                  id="revivesHead"
                  onClick={() => this.sortBy("weekStats", "gulagKills")}
                >
                  Gulag Kills
                </th>
                <th
                  className="top5"
                  id="top5Head"
                  onClick={() => this.sortBy("weekStats", "gulagDeaths")}
                >
                  Gulag Deaths
                </th>
              </thead>
              <tbody id="tbody">
                {this.state.weekStats.map((member) => {
                  return (
                    <tr className="recordsRows">
                      <td className="position">
                        {this.state.weekStats.indexOf(member) + 1}
                      </td>
                      <td className="gamerTag">{member.username}</td>
                      <td className="KDR">{member.kdRatio}</td>
                      <td className="wins">{member.killsPerGame}</td>
                      <td className="games">{member.matchesPlayed}</td>
                      <td className="kills">{member.kills}</td>
                      <td className="deaths">{member.deaths}</td>
                      <td className="downs">{member.assists}</td>
                      <td className="revives">{member.gulagKills}</td>
                      <td className="top5">{member.gulagDeaths}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="componentBox">
          <h1 className="componentHeader">Lifetime Stats</h1>
          {this.state.loading ? (
            this.moonLoader()
          ) : (
            <table id="rankings">
              <thead id="thead">
                <th className="position" id="positionHead">
                  #
                </th>
                <th className="gamerTag" id="gamerTagHead">
                  GamerTag
                </th>
                <th
                  className="KDR"
                  id="KDRHead"
                  onClick={() => this.sortBy("fullStats", "kdRatio")}
                >
                  KDR
                </th>
                <th
                  className="wins"
                  id="winsHead"
                  onClick={() => this.sortBy("fullStats", "wins")}
                >
                  Wins
                </th>
                <th
                  className="games"
                  id="gamesHead"
                  onClick={() => this.sortBy("fullStats", "gamesPlayed")}
                >
                  Games
                </th>
                <th
                  className="kills"
                  id="killsHead"
                  onClick={() => this.sortBy("fullStats", "kills")}
                >
                  Kills
                </th>
                <th
                  className="deaths"
                  id="deathsHead"
                  onClick={() => this.sortBy("fullStats", "deaths")}
                >
                  Deaths
                </th>
                <th
                  className="downs"
                  id="downsHead"
                  onClick={() => this.sortBy("fullStats", "downs")}
                >
                  Downs
                </th>
                <th
                  className="revives"
                  id="revivesHead"
                  onClick={() => this.sortBy("fullStats", "revives")}
                >
                  Revives
                </th>
                <th
                  className="top5"
                  id="top5Head"
                  onClick={() => this.sortBy("fullStats", "topFive")}
                >
                  Top 5
                </th>
              </thead>
              <tbody id="tbody">
                {this.state.fullStats.map((member) => {
                  return (
                    <tr className="recordsRows">
                      <td className="position">
                        {this.state.fullStats.indexOf(member) + 1}
                      </td>
                      <td className="gamerTag">{member.username}</td>
                      <td className="KDR">{member.kdRatio.toFixed(2)}</td>
                      <td className="wins">{member.wins}</td>
                      <td className="games">{member.gamesPlayed}</td>
                      <td className="kills">{member.kills}</td>
                      <td className="deaths">{member.deaths}</td>
                      <td className="downs">{member.downs}</td>
                      <td className="revives">{member.revives}</td>
                      <td className="top5">{member.topFive}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        )
      </div>
    );
  }
}

export default StatsTable;
