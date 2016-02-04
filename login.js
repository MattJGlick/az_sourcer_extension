/**
 * Created by glickm on 11/14/15.
 */
var settings = null;

function login() {
  event.preventDefault();

  var merchant_id = encodeURIComponent(document.getElementById('merchant_id').value);
  var marketplace_id = encodeURIComponent(document.getElementById('marketplace_id').value);
  var access_key_id = encodeURIComponent(document.getElementById('access_key_id').value);
  //var secret_access_key = encodeURIComponent(document.getElementById('secret_access_key').value);
  var secret_access_key = document.getElementById('secret_access_key').value;

  if(merchant_id && marketplace_id && access_key_id && secret_access_key) {
    var http = new XMLHttpRequest();
    var url = "http://azsourcerbackend.herokuapp.com/create";

    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    http.send(JSON.stringify({
        "merchantId": merchant_id,
        "marketplaceId": marketplace_id,
        "accessKeyId": access_key_id,
        "secretAccessKey": secret_access_key
      }
    ));

    http.onreadystatechange = function () {//Call a function when the state changes.
      if (http.readyState == 4 && http.status == 200) {
        alert(http.responseText);

        chrome.storage.sync.set({'az_sourcer_api_key': JSON.parse(http.responseText).APIKey}, function () {
          // TODO change this
          alert("set correctly i assume")
        });
      }

      // TODO catch the bad ones
    };
  } else {
    // TODO throw an error
  }
}

window.addEventListener('load', function(event) {
  settings = document.getElementById('settings');

  // Handle the bookmark form submit event with our addBookmark function
  document.getElementById('settings_form').addEventListener('submit', login);
});