/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

async function searchEngine(engine, query, query_decoded, locale, country, preview) {
  let webResults, webSuggest;

  if (engine == 'goo')
  {
    webResults = new URL('https://www.google.com/search');
    webSuggest = new URL('https://www.google.com/complete/search');
  } else if (engine == 'ddg') {
    webResults = new URL('https://duckduckgo.com/');
    webSuggest = new URL('https://duckduckgo.com/ac/');
  }

  if (engine == 'goo')
  {
    //webResults.searchParams.set('lr', 'lang_'+locale.substring(0, 2));
    //webResults.searchParams.set('cr', 'country'+country);
    webResults.searchParams.set('gl', country);
    webResults.searchParams.set('hl', locale);
    webResults.searchParams.set('q', query);

    //webSuggest.searchParams.set('lr', 'lang_'+locale.substring(0, 2));
    //webSuggest.searchParams.set('cr', 'country'+country);
    //webSuggest.searchParams.set('gl', locale.substring(0, 2))
    webSuggest.searchParams.set('gl', country);
    webSuggest.searchParams.set('hl', locale);
    webSuggest.searchParams.set('q', query);
    webSuggest.searchParams.set('client', 'firefox');

  } else if (engine == 'ddg') {
    webResults.searchParams.set('kl', locale);
    webResults.searchParams.set('q', query);

    // A limitation here with DuckDuckGo is that they combine the locale (language) and region (country)
    //   in the same parameter and does not support mixed setup's (e.g. en-SV or the like)...
    // This results in suggestions always being based on the language set in Windows, and not the region...
    webSuggest.searchParams.set('kl', locale); // wt-wt for No region
    webSuggest.searchParams.set('q', query);
    webSuggest.searchParams.set('type', 'list1');
  }

  //console.log(webSuggest.toString());

  // Suggestions
  const options =
  {
    headers: {
      //'Accept': 'application/json, text/javascript',
      //'Accept-Charset': 'utf-8',
      // Fake User-Agent to get Google to respond with UTF-8 encoding and not ISO-8859-1 encoding (breaks non-Latin characters)
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0'
    }
  };
  const request  = new Request(webSuggest, options);
  const response = await fetch(request);
  const obj      = await response.json();

  const result = {
    "Suggestions": []
  };

  console.log()

  result.Suggestions.push(
    {
      "Attributes": {
        "url": webResults.toString(),
        "query": query_decoded
      },
      "Text": query_decoded
    }
  );

  // Basic array format (Google)
  if (Array.isArray(obj) && typeof obj[1] !== 'undefined' && Array.isArray(obj[1]))
  {
    obj[1].forEach((ac) => {
      const suggestion = ac;

      if (suggestion == query_decoded)
        return;

      webResults.searchParams.set('q', suggestion);

      let objAC = 
      {
        "Attributes": {
          "url": webResults.toString(),
          "query": suggestion
        },
        "Text": suggestion
      };

      result.Suggestions.push(objAC);
    });
  }
  
  // Weird "phrase" format? (DuckDuckGo)
  else {
    obj.forEach((ac) => {
      const suggestion = ac["phrase"];

      if (suggestion == query_decoded)
        return;

      webResults.searchParams.set('q', suggestion);

      let objAC = 
      {
        "Attributes": {
          "url": webResults.toString(),
          "query": suggestion
        },
        "Text": suggestion
      };

      result.Suggestions.push(objAC);
    });
  }

  //console.log(obj);

  return JSON.stringify(result);
}

export default {

  async fetch(request, env, ctx) {

    // convert the worker request url into a URL object
    const url = new URL(request.url);

    // Windows Search provider suggestion endpoint:
    //          setlang - The locale associated with the query.   Example: en-US
    //               cc - The country code associated with query. Example: US
    //              qry - The query provided by the user. If the parameter has no value, i.e. appears in the query string as qry=, then the user query is empty. Search providers can still provide suggestions and preview pages in response to an empty query. NOTE The OS does not perform any sanitization of query strings. Search providers can implement their own sanitization when the query is received.
    const locale        = (url.searchParams.get('setlang')) ? url.searchParams.get('setlang') : 'en-US';
    const country       = (url.searchParams.get('cc'))      ? url.searchParams.get('cc')      : 'US';
    const query         =  url.searchParams.get('qry');
    const query_decoded = decodeURI(query);

    // Custom:
    //                e - Web search engine to use. Example: goo, dgd
    const engine        = url.searchParams.get('e');

    // Abort if a search engine or query is not defined
    if (engine == null || query == null)
      return new Response('Meow!');

    // Support suggestion previews?
    const preview = false;

    const body    = await searchEngine(engine, query, query_decoded, locale, country, preview);
    const options =
    { status: 200,
      statusText: "OK",
      headers: {
      "Access-Control-Allow-Origin":      "https://www.bing.com",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods":     "GET",
      "Content-Type":                     "application/json; charset=utf-8",
      "Content-Length":                   body.length.toString()
      }
    };

    let response = new Response(body, options);

    return response;
  },

  
};