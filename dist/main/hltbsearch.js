"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios');
const UserAgent = require('user-agents');
/**
 * Takes care about the http connection and response handling
 */
class HltbSearch {
    constructor() {
        this.payload = {
            "searchType": "games",
            "searchTerms": [],
            "searchPage": 1,
            "size": 20,
            "searchOptions": {
                "games": {
                    "userId": 0,
                    "platform": "",
                    "sortCategory": "popular",
                    "rangeCategory": "main",
                    "rangeTime": {
                        "min": 0,
                        "max": 0
                    },
                    "rangeYear": {
                        "min": null,
                        "max": null
                    },
                    "gameplay": {
                        "perspective": "",
                        "flow": "",
                        "genre": ""
                    },
                    "modifier": ""
                },
                "users": {
                    "sortCategory": "postcount"
                },
                "filter": "",
                "sort": 0,
                "randomizer": 0
            }
        };
    }
    detailHtml(gameId, signal) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield axios.get(`${HltbSearch.DETAIL_URL}${gameId}`, {
                    headers: {
                        'User-Agent': new UserAgent().toString(),
                        'origin': 'https://howlongtobeat.com',
                        'referer': 'https://howlongtobeat.com'
                    },
                    timeout: 20000,
                    signal,
                }).catch(e => { throw e; });
                return result.data;
            }
            catch (error) {
                if (error) {
                    throw new Error(error);
                }
                else if (error.response.status !== 200) {
                    throw new Error(`Got non-200 status code from howlongtobeat.com [${error.response.status}]
          ${JSON.stringify(error.response)}
        `);
                }
            }
        });
    }
    search(query, signal) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.searchWithOptions(query, null, signal);
        });
    }
    searchWithOptions(query, searchOptions, signal) {
        return __awaiter(this, void 0, void 0, function* () {
            // Use built-in javascript URLSearchOptions as a drop-in replacement to create axios.post required data param
            let search = Object.assign({}, this.payload);
            search.searchTerms = query;
            if (searchOptions != null) {
                if ('year' in searchOptions) {
                    search.searchOptions.games.rangeYear.min = searchOptions.year;
                }
                else if ('minYear' in searchOptions && 'maxYear' in searchOptions) {
                    search.searchOptions.games.rangeYear.min = searchOptions.minYear;
                    search.searchOptions.games.rangeYear.max = searchOptions.maxYear;
                }
            }
            try {
                let result = yield axios.post(HltbSearch.SEARCH_URL, search, {
                    headers: {
                        'User-Agent': new UserAgent().toString(),
                        'content-type': 'application/json',
                        'origin': 'https://howlongtobeat.com/',
                        'referer': 'https://howlongtobeat.com/'
                    },
                    timeout: 20000,
                    signal,
                });
                // console.log('Result', JSON.stringify(result.data));
                return result.data;
            }
            catch (error) {
                if (error) {
                    throw new Error(error);
                }
                else if (error.response.status !== 200) {
                    throw new Error(`Got non-200 status code from howlongtobeat.com [${error.response.status}]
          ${JSON.stringify(error.response)}
        `);
                }
            }
        });
    }
}
HltbSearch.BASE_URL = 'https://howlongtobeat.com/';
HltbSearch.DETAIL_URL = `${HltbSearch.BASE_URL}game?id=`;
HltbSearch.SEARCH_URL = `${HltbSearch.BASE_URL}api/search`;
HltbSearch.IMAGE_URL = `${HltbSearch.BASE_URL}games/`;
exports.HltbSearch = HltbSearch;
//# sourceMappingURL=hltbsearch.js.map