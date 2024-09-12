
function showWelcomePage () {
    const welcomeFile = (lang=="ja")?"index_ja.html":"index.html";
    let welcomePageUrl = browser.runtime.getURL("docs/" + welcomeFile);
    browser.tabs.create({ url: welcomePageUrl });
  
}

function compareVersions(version1, version2) {
  const v1 = version1.split('.').map(Number);
  const v2 = version2.split('.').map(Number);
  
  const length = Math.max(v1.length, v2.length);
  for (let i = 0; i < length; i++) {
      const num1 = i < v1.length ? v1[i] : 0;
      const num2 = i < v2.length ? v2[i] : 0;
      
      if (num1 > num2) {
          return 1; // version1 is newer
      } else if (num1 < num2) {
          return -1; // version1 is older
      }
  }
  return 0; // Same versions
}
function getUserLanguage () {
  let lang = "en";
  if (navigator.languages) {
      lang = navigator.languages.includes('ja') || navigator.languages.includes('ja-JP') ? 'ja' : 'en';
  } else {
      lang = navigator.language.startsWith('ja') ? 'ja' : 'en';
  }
  return lang;
}
function showWelcomePageBg () {
    browser.runtime.sendMessage({ action: "openHelp" });

}