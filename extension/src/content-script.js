
class Blocking {
  constructor (url) {
    this.overlay = new PageOverlay();
    this.overlay.setIframeUrl(url + "?overlay=true");
    this.isShowing = false;
    this.overlay.setClickHandler(()=>{
      sendIdleStateChange(false);
      this.overlay.hide();
      this.isShowing = false;

    });
  }
  startBlocking () {
    if (this.isShowing) return;
    this.isShowing = true;
    this.overlay.show();
  }
  stopBlocking () {
    if (!this.isShowing) return;
    this.overlay.hide();
    this.isShowing = false;
  }
  sendMessage (message) {
    this.overlay.sendMessage(message);
  }
}

(()=>{

  const IDLE_DETECTION__TIME = 3.0 * 60 * 1000; // Default 3min
  // const IDLE_DETECTION__TIME = 10 * 1000;

  const idleDetector = new IdleDetector(IDLE_DETECTION__TIME);

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

  const BLOCK_BY_OVERLAY = true;
  let blocking = null;
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action == "block") {
        // Start blocking
        if (message.remaining <= 0 && message.blockedPage) {
          if (BLOCK_BY_OVERLAY) {
            console.log("OVERLAY=" + blocking)
            if (!blocking) {
              blocking = new Blocking(message.blockedPage);
            }
            sendIdleStateChange(true);
            blocking.startBlocking();
          } else {
            location.href = message.blockedPage + "?url=" + encodeURIComponent(location.href)
          }
        }
      } else if (message.action == "activate") {
        if (message.enableIdleDetection) {
          // console.log("ACTIVATED. Starting idleDetector. idleTimeout=" + idleDetector.idleTimeout)
          idleDetector.setIdlePageUrl(message.idlePageUrl);
          idleDetector.start();
        }
        sendResponse({action:"acceptActivation"})
      } else if (message.action == "notifyUpdateQuota") {
        if (blocking) {
           blocking.sendMessage(message)
        }

      }
      return true;
  });

  document.addEventListener("visibilitychange", function() {
      if (idleDetector) {
        idleDetector.stop();
      }
      if (blocking) {
        // blocking.stopBlocking();
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

  window.addEventListener('message', (event) => {
    if (event.data === 'iframe-clicked') {
      if (blocking) {
        blocking.stopBlocking();
        sendIdleStateChange(false);
      }
    }
  }, false);

})();