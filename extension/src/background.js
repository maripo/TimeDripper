let sites = {
  block: [
    "www.facebook.com",
    "www.youtube.com",
    "www.reddit.com",
    "x.com",
    "www.tiktok.com",
    "www.netflix.com",
    "www.buzzfeed.com",
    "www.pinterest.com",
    "www.linkedin.com"
  ],
  allow: [
  ]
};
let config = {
  maxQuotaSec: 60 * 15, // 15min
  recoveryIntervalSec: 60 * 1, // 1min
  recoveryAmountSec: 5 // 5 sec
};
let appState = {
  blocking: false,
  blockedTabIds:[],
  isBlocking: false,
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let result = '';
  if (hours > 0) {
    result += `${hours}h`;
  }
  if (hours > 0 || minutes > 0) {
    result += `${minutes}m`;
  }
  if (remainingSeconds > 0 || result === '') {
    result += `${remainingSeconds}s`;
  }
  return result;
}

function formatBadgeText(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  } else {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  }
}

function updateBadge(quota) {
  const badgeText = config.showQuotaOnBadge ? formatBadgeText(quota.current):"";
  browser.browserAction.setBadgeText({
    text: badgeText
  });
  browser.browserAction.setBadgeBackgroundColor({
    color: "#FFFFFF88"
  });
  const tooltip = formatTime(quota.current) + "/" + formatTime(quota.max);
  browser.browserAction.setTitle({
    title: tooltip
  });
}
function removeProtocol(url) {
  return url.replace(/^(?:https?:\/\/)?/i, "");
}
function wildcardToRegex(pattern) {
  // Convert wildcard domain pattern to regex
  const regexPattern = pattern
    .replace(/\./g, '\\.') // Escape dot for regex
    .replace(/\*/g, '.*') // Convert * to .* in regex for wildcard matching
    .replace(/\/\//g, '\/\/') // Ensure slashes are interpreted correctly
    + (pattern.endsWith('/') ? '' : '(\/|$)'); // Match end of domain/path

  return new RegExp('^https?:\/\/' + regexPattern, 'i');
}

function isUrlBlocked(url, blockUrlList, allowUrlList) {
  if (!url) return false;

  for (let allowPattern of allowUrlList) {
    const allowRegex = wildcardToRegex(allowPattern);
    if (allowRegex.test(url)) {
      return false;
    }
  }

  for (let blockPattern of blockUrlList) {
    const blockRegex = wildcardToRegex(blockPattern);
    if (blockRegex.test(url)) {
      return true;
    }
  }

  return false;
}
let quota = {
  current: 10 * 60,
  max: 10 * 60,
  lastUpdated: new Date().getTime(),
  nextUpdate: new Date().getTime()
}
function initExtension() {
  browser.storage.local.get(["quota", "sites", "config"]).then(data => {
    if (data.quota && data.quota.current >= 0 && data.quota.lastUpdated > 0) {
      console.debug("Found data.")
      quota = data.quota;

    }
    if (data.sites) {
      console.debug("Sites loaded.")
      console.debug(data.sites)
      sites = data.sites;
    }
    if (data.config) {
      console.debug(data.config)
      config = data.config;
    }
    console.debug(JSON.stringify(quota))
    updateBadge(quota)

    updateQuota();
    setInterval(updateQuota, 60 * 1000);
  });


  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.action == "contentOnload") {
      // From content script
      updateTabs(appState, "contentOnload");
    } else if (message.action == "contentOnunload") {
      // From content script
      updateTabs(appState, "contentOnunload");
    } else if (message.action == "requestList") {
      sendResponse({ allow: sites.allow, block: sites.block });
    } else if (message.action == "saveList") {
      let sitesTmp = {
        block: message.block.map(url => removeProtocol(url)),
        allow: message.allow.map(url => removeProtocol(url))
      };
      browser.storage.local.set({
        sites: sitesTmp
      }).then(() => {
        sites = sitesTmp;
        sendResponse({ success: true })
      });
      return true; // For async
    } else if (message.action == "getConfig") {
      // By config popup
      sendResponse(config);
    } else if (message.action == "setConfig") {
      // By config popup
      config = message.config;
      browser.storage.local.set({
        config: message.config
      }).then(() => {
        sendResponse({ success: true })
        updateQuota();
      });
      return true; // Async
    } else if (message.action == "getQuota") {
      popupVisibleCount++;
      sendResponse(quota)
    } else if (message.action == "visibilitychange") {
      sendResponse({ message: "OK" })
    } else if (message.action == "onClosePopup") {
      popupVisibleCount--;
  
    }
  });
}

let _nextUpdatePlanned = null;
function regNextUpdate(timestamp) {
  if (timestamp == _nextUpdatePlanned) {
    // Duplicate.
    return;
  }
  _nextUpdatePlanned = timestamp;
  let nextTimeout = timestamp - new Date().getTime();
  setTimeout(updateQuota, nextTimeout);

}

function updateQuota() {
  const now = new Date();
  const nowMsec = now.getTime();

  let recoverySec = 0;
  const prevQuota = quota.current;

  while (quota.lastUpdated + config.recoveryIntervalSec * 1000 <= nowMsec) {
    recoverySec += config.recoveryAmountSec;
    quota.lastUpdated += config.recoveryIntervalSec * 1000;
  }
  quota.nextUpdate = quota.lastUpdated + config.recoveryIntervalSec * 1000;

  regNextUpdate(quota.nextUpdate);
  const newQuota = Math.min(quota.current + recoverySec, config.maxQuotaSec);
  if (newQuota == prevQuota) {
    return;
  }
  console.debug("updateQuota %f=>%f", prevQuota, newQuota)
  quota.current = newQuota;
  quota.max = config.maxQuotaSec;
  saveQuota();
}
function saveQuota() {
  browser.storage.local.set({
    quota: quota
  }).then(() => {
    updateBadge(quota);
    if (popupVisibleCount > 0) {
      try {

        browser.runtime.sendMessage({
          action: "notifyUpdateQuota",
          quota: quota
        });
      } catch (e) {
        // TODO
      }
    }
  });

}


initExtension();

let popupVisibleCount = 0;

let lastActiveTime = Date.now();
let currentTabId = null;
browser.tabs.onActivated.addListener(event => {
  updateTabs(appState, "tabs.onActivated");
});
browser.tabs.onAttached.addListener(event => {
  updateTabs(appState, "tabs.onAttached");
});
/*
browser.tabs.onCreated.addListener(event => {
  console.debug(event)
  updateTabs(appState, "tabs.onCreated");
});
*/
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    updateTabs(appState, "tabs.onUpdated");
  }
});

browser.windows.onFocusChanged.addListener(event => {
  updateTabs(appState, "windows.onFocusChanged");
});
/*
browser.windows.onCreated.addListener(event => {
  console.debug(event)
  updateTabs(appState, "windows.onCreated");
});
*/
/*
browser.windows.onUpdated.addListener(window => {
  updateTabs(appState, "windows.onUpdated");
});
browser.tabs.onUpdated.addListener(window => {
  updateTabs(appState, "tabs.onUpdated");
});
*/

const blockedPageUrl = browser.runtime.getURL("blocked.html");
// let isBlocking = false;
let activeTabId = -1;
function getIconSuffix(percentage) {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const roundedPercentage = Math.round(clampedPercentage / 10) * 10;
  return roundedPercentage;
}

async function updateTabs(appState, reason) {
  console.debug("updateTabs reason=%s", reason)
  const wins = await browser.windows.getAll();
  //browser.windows.getAll().then(wins=>{
  const visibleWins = wins.filter(win => win.state == "normal").map(win => win.id);
  const tabs = await browser.tabs.query({ active: true });
  // browser.tabs.query({ active: true }).then(tabs => {

  const items = tabs.map((tab) => {
    return {
      url: tab.url,
      title: tab.title,
      windowId: tab.windowId,
      id: tab.id,
      blocked: visibleWins.includes(tab.windowId) && isUrlBlocked(tab.url, sites.block, sites.allow)
    }
  });
  const blockedTabs = items.filter(tab => tab.blocked);
  appState.blockedTabIds = blockedTabs.map(tab => tab.id)
  appState.isBlocking = blockedTabs.length > 0;
  const percentage = (quota.current / quota.max) * 100;
  const iconSuffix = getIconSuffix(percentage);
  const themeInfo = await browser.theme.getCurrent(visibleWins[0]);
  let brightness = 1.0;
  if (themeInfo && themeInfo.colors) {
    const bgColor = themeInfo.colors.toolbar || themeInfo.colors.frame;
    brightness = calculateBrightness(parseColor(bgColor));
  }
  for (const item of items) {
    let iconPrefix = (item.blocked) ? "icon/dark/active_" : "icon/dark/inactive_"
    if (brightness > 0.5) {
      iconPrefix = (item.blocked) ? "icon/light/active_" : "icon/light/inactive_"
    }
    const iconPath = iconPrefix + iconSuffix + ".png";
    await browser.browserAction.setIcon({
      path: iconPath,
      tabId: item.id
    });

  }
}
function parseColor(input) {
  const div = document.createElement('div');
  div.style.color = input;
  document.body.appendChild(div);

  const color = window.getComputedStyle(div).color;
  document.body.removeChild(div);

  const match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)$/);

  if (match) {
    return {
      red: parseInt(match[1]),
      green: parseInt(match[2]),
      blue: parseInt(match[3]),
      alpha: match[4] ? parseFloat(match[4]) : 1
    };
  } else {
    return null; // Or throw an error
  }
}

function calculateBrightness({ red, green, blue }) {
  return (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
}

function decrement() {
  if (appState.isBlocking) {
    quota.current = Math.max(0, quota.current - 1);
    updateBadge(quota)
    if (quota.current <= 0) {
      appState.blockedTabIds.forEach((activeTabId) => {

        browser.tabs.sendMessage(activeTabId, { blocked: true, remaining: quota.current, blockedPage: blockedPageUrl }).then(response => {
          console.debug("Received response:", response);
        }).catch(err => {
          console.error("Error sending message:", err);
        });
      }

      )
    }
    saveQuota();
  }
}
setInterval(decrement, 1000);



