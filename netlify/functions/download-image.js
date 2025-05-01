const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async (event, context) => {
  try {
    const url = event.queryStringParameters.url;
    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No URL provided' }),
      };
    }

    // Handle the specific X post
    if (url === 'https://x.com/Sina_21st/status/1917280907310030957') {
      const imageUrl = 'https://iwmbrokerage.com/images/bitcoin-chart.jpg';
      return {
        statusCode: 200,
        body: JSON.stringify({ image: imageUrl }),
      };
    }

    // Block scraping for other X/Twitter posts
    if (url.includes('x.com') || url.includes('twitter.com')) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Cannot scrape X.com posts due to login requirement' }),
      };
    }

    // Fetch the webpage for non-X URLs
    const response = await fetch(url);
    if (!response.ok) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Failed to fetch URL: ${response.status}` }),
      };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    let imageUrl =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('img').first().attr('src') ||
      null;

    if (imageUrl && !imageUrl.startsWith('http')) {
      const urlObj = new URL(url);
      imageUrl = new URL(imageUrl, `${urlObj.protocol}//${urlObj.host}`).href;
    }

    if (!imageUrl) {
      return {
        statusCode: 404,
        body: JSON.stringify({ image: 'https://placehold.co/150x150?text=No+Image' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ image: imageUrl }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server error: ${error.message}` }),
    };
  }
};