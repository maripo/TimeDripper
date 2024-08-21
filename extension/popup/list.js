document.getElementById('js_save').addEventListener('click', () => {

  const blockList = document.getElementById('js_blockList').value.split("\n");
  const allowList = document.getElementById('js_allowList').value.split("\n");
  console.debug(blockList)
  console.debug(allowList)
  browser.runtime.sendMessage(
    {action: "saveList", 
      block: blockList,
      allow: allowList
    }).then(response => {
      console.debug("Response")
      console.debug(response)
      if (response.success) {
        // alert("success")
        document.getElementById("js_savedMessage").style.display = "block";
      }
  });

});

browser.runtime.sendMessage({action: "requestList"}).then(response => {
  console.debug(response);
  document.getElementById("js_blockList").innerHTML = response["block"].join("\n");
  document.getElementById("js_allowList").innerHTML = response["allow"].join("\n");
});
    document.getElementById('js_cancelBtn').addEventListener('click', function() {
        window.close();
    });