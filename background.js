/**
 * Created by glickm on 11/9/15.
 */
function checkForValidUrl(tabId, changeInfo, tab)  {
  var url = tab.url;

  if (url.indexOf('amazon.com') > -1) {
    chrome.pageAction.show(tabId);
  }
}

chrome.tabs.onUpdated.addListener(checkForValidUrl);
