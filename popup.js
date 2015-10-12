// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

document.getElementById('listing').addEventListener('click', function() {
  getCurrentTabUrl(function(url) {
    var regex = RegExp("http://www.amazon.com/([\\w-]+/)?(dp|gp/product)/(\\w+/)?(\\w{10})");
    m = url.match(regex);

    if(m) {
      chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
        chrome.tabs.update(tab.id, {url: "http://www.amazon.com/gp/offer-listing/"+m[4]});
      });
    }
  });
});

document.getElementById('calculator').addEventListener('click', function() {
  getCurrentTabUrl(function(url) {
    var regex = RegExp("http://www.amazon.com/([\\w-]+/)?(dp|gp/product)/(\\w+/)?(\\w{10})");
    m = url.match(regex);

    if(m) {
      chrome.tabs.create({url: "https://sellercentral.amazon.com/hz/fba/profitabilitycalculator/index?lang=en_US"}, function (tab) {
        chrome.tabs.executeScript(tab.id, {
          file: 'calculatorpage.js'
        });
      });

    }
  });
});

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}
