function getListing () {
  getASIN(function (ASIN) {
    if(ASIN) {
      // found a good ASIN
      chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
        chrome.tabs.update(tab.id, {url: "http://www.amazon.com/gp/offer-listing/"+ASIN});
      });
    } else {
      // couldnt find a good ASIN, show error message
      message.innerHTML = "Not valid URL";
    }
  })
}

function getASIN (callback) {
  getCurrentTabUrl(function(url) {
    // check for the ASIN
    var regex = RegExp("http://www.amazon.com/([\\w-]+/)?(dp|gp/product)/(\\w+/)?(\\w{10})");
    var regexArray = url.match(regex);

    var ASIN = regexArray ? regexArray[4] : false;

    callback(ASIN);
  });
}

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;

    callback(url);
  });
}

function calculate() {
  event.preventDefault();

  chrome.storage.sync.get('az_sourcer_api_key', function (storage) {
    if(Object.keys(storage).length !== 0) {
      var sell_price = encodeURIComponent(document.getElementById('sell_price').value);

      if(sell_price && !isNaN(sell_price)) {
        getASIN(function (asin) {
          if(asin) {
            var http = new XMLHttpRequest();
            var url = "http://azsourcerbackend.herokuapp.com/calculate";

            http.open("POST", url, true);
            http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            http.send(JSON.stringify({
                "APIKey": storage.az_sourcer_api_key,
                "ASIN": asin,
                "sellPrice": sell_price
              }
            ));

            http.onreadystatechange = function() {//Call a function when the state changes.
              if(http.readyState == 4 && http.status == 200) {
                fees.innerHTML = "Fee Total: " + JSON.parse(http.responseText).fees;
              }

              // TODO catch the bad ones
            };
          } else {
            // TODO throw an error if the asin is bad
          }
        });
      } else if (!sell_price) {
        // TODO throw an error saying that they havent entered a sell price
      } else if (isNaN(sell_price)) {
        // TODO throw error if not number
      } else {
        // TODO IDFK
      }
    } else {
      openSettings();
      // TODO add some code to force the user to get an API Key
    }
  });
}

var fees = null;
var message = null;

window.addEventListener('load', function(event) {
  fees = document.getElementById('fees');
  message = document.getElementById('message');

  // Handle the bookmark form submit event with our addBookmark function
  document.getElementById('calculate_form').addEventListener('submit', calculate);
  document.getElementById('listing').addEventListener('click', getListing);
});

function openSettings () {
  chrome.tabs.create({'url': chrome.extension.getURL('login.html')}, function (tab) {
    alert("tab opened")
  });
}