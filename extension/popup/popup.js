
// popup.js

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
document.addEventListener('DOMContentLoaded', function () {
  browser.runtime.sendMessage({ action: "getQuota" }).then(quota => {
    updateQuotaDisplay(quota);
  });
});
window.addEventListener('unload', function () {
  browser.runtime.sendMessage({ action: "onClosePopup" });
});
let nextUpdate = new Date().getTime();
function updateQuotaDisplay(quota) {
  const percentage = (quota.current / quota.max) * 100;
  nextUpdate = quota.nextUpdate;
  document.getElementById('js_staminaGauge').style.width = `${percentage}%`;
  document.getElementById('js_currentQuota').textContent = formatTime(quota.current);
  document.getElementById('js_maxQuota').textContent = formatTime(quota.max);
  countdown();
  document.getElementById("js_labelNextRecovery").style.visibility = 
    quota.current < quota.max? "visible":"hidden"
}
function countdown () {
  const currentTime = Date.now();
  const timeToNextRecovery = Math.max(0, Math.floor((nextUpdate - currentTime) / 1000));
  console.debug("timeToNextRecovery(popup.html)=" + timeToNextRecovery)
  document.getElementById('js_timeToNextRecovery').textContent = timeToNextRecovery;
}
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.debug(message)
  if (message.action == "notifyUpdateQuota") {
    updateQuotaDisplay(message.quota);
  }
});
document.getElementById("js_help").addEventListener("click", showWelcomePageBg)
setInterval(countdown, 1000);