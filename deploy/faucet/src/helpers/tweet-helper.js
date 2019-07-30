const scrape = require('page-scraper');
const level = require('level');
const stringSimilarity = require('string-similarity');
const app = require('../../index');

// similarity constants
const referenceString = app.config.Tweeter.predefinedTweet + app.config.Tweeter.predefinedHashTags;
const similarityThreshold = app.config.Tweeter.similarityTreshold || 0.8;

// defined as number of hours
const timeoutThresholdInHours = app.config.Tweeter.cooldown || 6;

const db = level('tweet-db');

async function checkIfValidTweet (tweetUrl) {
  const response = {valid: false, message: ""};
  try {
    // Check if user claimed reward in last 8h
    const tweetUser = getTweetUsername(tweetUrl);
    await checkIfTimeoutExpired(tweetUser);
    // Check if tweet already used for reward
    await checkIfNewTweet(tweetUrl);
    // Check if tweet content is about Lisinski Testnet
    const tweetContent = await scrapeTweetContent(tweetUrl);
    checkIfValidTweetContent(tweetContent);
    // Tweet is valid, save record
    await saveTweetData(tweetUrl, tweetUser);
    response.valid = true;
  } catch (err) {
    response.message = err.message;
  }
  return response;
}

async function saveTweetData(tweetUrl, tweetUser) {
  await db.put("tweet::" + tweetUrl, tweetUser);
  await db.put("user::" + tweetUser, Date.now());
  console.log(`${tweetUser} claimed reward for ${tweetUrl}.`)
}

async function checkIfNewTweet(tweetUrl) {
  try {
    await db.get("tweet::" + tweetUrl);
  } catch (error) {
    if (error.type === 'NotFoundError') return;
    console.log(error.message);
    throw new Error(error.message);
  }
  throw new Error("This tweet already used for claiming LETH reward!");
}

async function scrapeTweetContent(tweetUrl) {
  let content = '';
  try {
    const $ = await scrape(tweetUrl);
    content = $('.tweet-text').text();
  } catch (error) {
    console.error(error.message);
  }
  if (content.length === 0) {
    throw new Error('Tweet url is not valid!');
  }
  return content;
}

function checkIfValidTweetContent(tweetContent) {
  const similarity = stringSimilarity.compareTwoStrings(tweetContent, referenceString);
  if (similarity < similarityThreshold) {
    throw new Error('Tweet content is not valid, Lisinski Testnet must be mentioned in Tweet!');
  }
}

function getTweetUsername(tweetUrl) {
  return tweetUrl.split("/")[3];
}

async function checkIfTimeoutExpired(tweetUser) {
  let timestamp;
  try {
    timestamp = await db.get("user::" + tweetUser);
  } catch (error) {
    if (error.type !== 'NotFoundError') {
      throw new Error(error.message);
    }
  }
  // check if timeout expired
  const hoursFromLastTweet = Math.abs(timestamp - Date.now()) / 36e5;
  if (hoursFromLastTweet <= timeoutThresholdInHours) {
    throw new Error(`Reward already claimed in last ${timeoutThresholdInHours} hours!`)
  }
}

module.exports = { checkIfValidTweet };
