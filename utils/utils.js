import axios from "axios";

import "dotenv/config";
// const axios = require("axios");
// const cheerio = require("cheerio");
// const unirest = require("unirest");
// const puppeteer = require("puppeteer");

// const SerpApi = require("google-search-results-nodejs");
const apikeys = [
  process.env.apikey,
  process.env.apikeyOld,
  process.env.apikeyOld2,
];
export const getYoutube = async (value, nextPageToken, channelList) => {
  const Emails = [];

  for (const apikey of apikeys) {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          headers: {
            Accept: "application/json",
          },
          params: {
            key: apikey,
            q: value,
            type: "video",
            part: "snippet",
            maxResults: 50,
            pageToken: nextPageToken ? nextPageToken : null,
          },
        }
      );
      let data = await response.data.items;

      // filter each time will not have duplicates channels id
      let ids = data.map((r) => r.snippet.channelId);
      ids = Array.from(new Set(ids));
      let new_data = [];
      while (ids.length > 0) {
        data.map((r) => {
          if (ids.includes(r.snippet.channelId)) {
            new_data.push(r);
            ids = ids.filter((id) => id != r.snippet.channelId);
          }
        });
      }
      data = new_data;

      // data = data.filter((r) => ids.includes(r.snippet.channelId));
      // console.log(channelList);
      // filter next time will not have duplicates channels id
      if (channelList && channelList.length > 0) {
        data = data.filter((r) => !channelList.includes(r.snippet.channelId));
      }

      for (const item of data) {
        const emails = await VideoInfo(item.id.videoId, apikey);
        Emails.push(emails);
      }

      console.log("done");
      return { videosInfo: response.data, data: Emails };

      //   return result;
    } catch (error) {
      console.log(apikey);
      // console.log(error.response);
      console.log("next api-key");
    }
  }
};

const VideoInfo = async (value, apikey) => {
  let foundEmails = "";
  let match;
  var emailRegex =
    /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

  const response = await axios.get(
    `https://www.googleapis.com/youtube/v3/videos`,
    {
      headers: {
        Accept: "application/json",
      },
      params: {
        key: apikey,
        id: value,
        type: "video",
        part: "snippet",
      },
    }
  );
  let searchInThisString = await response.data.items[0].snippet.localized
    .description;
  match = emailRegex.exec(searchInThisString);
  try {
    foundEmails = match[0];
  } catch (err) {}

  // while ((match = emailRegex.exec(searchInThisString))) {
  //   // console.log(match[0]);
  //   foundEmails.push(match[0]);

  //   searchInThisString = searchInThisString.replace(match[0], "");
  // }
  // Emails.push({ videoId: value, email: foundEmails });

  return { videoId: value, email: foundEmails };
};

export const videoLoop = async (value) => {
  const Emails = [];
  let nextPageToken = null;
  // let videosInfo = {}
  const channelList = [];
  // let count = 1;
  let error = false;
  for (const apikey of apikeys) {
    try {
      while (!error) {
        // count = count + 1;
        // console.log(count);

        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search`,
          {
            headers: {
              Accept: "application/json",
            },
            params: {
              key: apikey,
              q: value,
              type: "video",
              part: "snippet",
              maxResults: 50,
              pageToken: nextPageToken,
            },
          }
        );
        let result = await response.data;

        let data = result.items;
        // filter each time will not have duplicates channels id
        let ids = data.map((r) => r.snippet.channelId);
        ids = Array.from(new Set(ids));
        let new_data = [];
        while (ids.length > 0) {
          data.map((r) => {
            if (ids.includes(r.snippet.channelId)) {
              new_data.push(r);
              ids = ids.filter((id) => id != r.snippet.channelId);
            }
          });
        }
        data = new_data;

        // filter next time will not have duplicates channels id
        if (channelList && channelList.length > 0) {
          data = data.filter((r) => !channelList.includes(r.snippet.channelId));
        }
        channelList.push(ids);
        try {
          nextPageToken = result.nextPageToken;
        } catch (error) {
          nextPageToken = null;
        }
        for (const item of data) {
          const emails = await VideoInfo(item.id.videoId, apikey);
          Emails.push(emails);
        }
        // console.log(Emails);
      }

      //   return result;
    } catch (error) {
      if (apikey === apikeys[apikeys.length - 1]) {
        error = true;
      }
      // console.log(error.response.data);
      console.log(apikey);

      console.log("next api-key");
      continue;
    }
  }
  return { data: Emails };
};
//
// getYoutube("bitcoin");

const selectRandom = () => {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
  ];
  var randomNumber = Math.floor(Math.random() * userAgents.length);
  return userAgents[randomNumber];
};

const fetchData = async () => {
  // const response = await axios.get(
  //   `https://www.google.com/search?q=site:youtube.com "study" "@gmail.com"`,
  //   {
  //     headers: {
  //       "User-Agent":
  //         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36",
  //     },
  //   }
  // );

  // const data = await response.data;
  // const $ = cheerio.load(data);

  const url = `https://www.google.com/search?q=site:facebook.com "crypto" "@gmail.com`;
  const response = await unirest.get(url).headers({
    "User-Agent": selectRandom(),
  });

  const $ = cheerio.load(response.body);

  // console.log($);
  let list = [];
  $(".VwiC3b ").each((i, el) => {
    // console.log(el);
    list[i] = {
      // title: $(el).find(".v0nnCb span").text(),
      // snippet: $(el).find(".lyLwlc").text(),
      // displayed_link: $(el).find(".qzEoUe").text(),
      // link: $(el).find("a.sVXRqc").attr("href"),
      description: $(el).find("span").text(),
    };
  });

  console.log(list);
};

// fetchData();
