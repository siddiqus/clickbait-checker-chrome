# clickbait-checker-chrome Chrome Extension

- This assumes there is an API that can check whether a link, text, etc. is clickbait. 

## Necessary modifications

edit the following in `scripts/cbc.js`
- `API_URL` : The variable at the top of the script, set to the REST API URL used to check for clickbait
- `_clickbaitApiCall` : This function makes the API call depending on `API_URL`, and is currently set to make a POST call. The API call method can be changed, e.g. to GET, if necessary
- `_getIsClickbaitFromResult` : This function has logic to determine a boolean output, i.e. if the link/text is clickbait or not.
