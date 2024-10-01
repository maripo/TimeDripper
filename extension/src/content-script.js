
const IDLE_DETECTION__TIME = 3.0 * 60 * 1000;
const idleDetector = new IdleDetection(IDLE_DETECTION__TIME); // Default 3min

function sendIdleStateChange (idle) {
  const payload = {
    action: "idleStateChange",
    url: location.href,
    idle: idle
  }
  browser.runtime.sendMessage(payload).then(response => {
      // console.debug(response);
  });
}

idleDetector.onIdleDetected = function() {
  sendIdleStateChange(true);
};

idleDetector.onIdleCancelled = function() {
  sendIdleStateChange(false);
};

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action == "block") {
      if (message.remaining <= 0 && message.blockedPage) {
        location.href = message.blockedPage + "?url=" + encodeURIComponent(location.href)
      }
    } else if (message.action == "activate") {
      // console.log(message)
      // console.log("enableIdleDetection=" + message.enableIdleDetection);
      if (message.enableIdleDetection) {
        // console.log("ACTIVATED. Starting idleDetector. idleTimeout=" + idleDetector.idleTimeout)
        idleDetector.setIdlePageUrl(message.idlePageUrl);
        idleDetector.start();
      }
      sendResponse({action:"acceptActivation"})
    }
    return true;
});

document.addEventListener("visibilitychange", function() {
    if (idleDetector) {
      idleDetector.stop();
    }
    const payload = {
      action: "visibilitychange",
      url: location.href,
      visibility: !document.hidden
    }
    browser.runtime.sendMessage(payload).then(response => {
        // console.debug(response);
    });
});
document.addEventListener("onload", function() {
  // console.log("TimeDripper.onload")
  browser.runtime.sendMessage({action:"contentOnload"}).then(response => {
    // console.debug(response);
  });
});
document.addEventListener("load", function() {
  // console.log("TimeDripper.onload")
  browser.runtime.sendMessage({action:"contentOnload"}).then(response => {
    // console.debug(response);
  });
});


// console.log("TimeDripper.start")
browser.runtime.sendMessage({action:"contentOnload"}).then(response => {
  // console.debug(response);
});