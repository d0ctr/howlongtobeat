const axios: any = require('axios');
const UserAgent: any = require('user-agents');

export type SearchOptions = {
  year: number
} | {
  minYear: number,
  maxYear: number
};

/**
 * Takes care about the http connection and response handling
 */
export class HltbSearch {
  public static BASE_URL: string = 'https://howlongtobeat.com/';
  public static DETAIL_URL: string = `${HltbSearch.BASE_URL}game?id=`;
  public static SEARCH_URL: string = `${HltbSearch.BASE_URL}api/search`;
  public static IMAGE_URL: string = `${HltbSearch.BASE_URL}games/`;

  payload: any = {
    "searchType": "games",
    "searchTerms": [

    ],
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
  }

  async detailHtml(gameId: string, signal?: AbortSignal): Promise<string> {
    try {
      let result =
        await axios.get(`${HltbSearch.DETAIL_URL}${gameId}`, {
          headers: {
            'User-Agent': new UserAgent().toString(),
            'origin': 'https://howlongtobeat.com',
            'referer': 'https://howlongtobeat.com'
          },
          timeout: 20000,
          signal,
        }).catch(e => { throw e; });
      return result.data;
    } catch (error) {
      if (error) {
        throw new Error(error);
      } else if (error.response.status !== 200) {
        throw new Error(`Got non-200 status code from howlongtobeat.com [${error.response.status}]
          ${JSON.stringify(error.response)}
        `);
      }
    }
  }
  async search(query: Array<string>, signal?: AbortSignal): Promise<any> {
    return this.searchWithOptions(query, null, signal);
  }

  async searchWithOptions(query: Array<string>, searchOptions?: SearchOptions, signal?: AbortSignal): Promise<any> {
    // Use built-in javascript URLSearchOptions as a drop-in replacement to create axios.post required data param
    let search = { ...this.payload };
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
      let result =
        await axios.post(HltbSearch.SEARCH_URL, search, {
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
    } catch (error) {
      if (error) {
        throw new Error(error);
      } else if (error.response.status !== 200) {
        throw new Error(`Got non-200 status code from howlongtobeat.com [${error.response.status}]
          ${JSON.stringify(error.response)}
        `);
      }
    }
  }
}
