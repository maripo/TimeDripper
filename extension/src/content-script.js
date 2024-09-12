browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.blocked && message.remaining <= 0 && message.blockedPage) {
      location.href = message.blockedPage + "?url=" + encodeURIComponent(location.href)
    } else {
    }
    return true;
});

document.addEventListener("visibilitychange", function() {
    const payload = {
      action: "visibilitychange",
      url: location.href,
      visibility: !document.hidden
    }
    browser.runtime.sendMessage(payload).then(response => {
        // console.debug(response);
    });
});
