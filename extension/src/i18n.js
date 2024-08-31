const translations = {
    en: {
        navTop: "Home",
        navSites: "Sites",
        navConfig: "Config",
        labelNextRecoveryIn: "Next Recovery in",
        buttonSave: "Save",
        buttonCancel: "Cancel",
        unitSeconds: "Seconds",
        unitMinutes: "Minutes",
        unitHours: "Hours",
        titleBlockList: "Block List",
        titleAllowList: "Allow List",
        labelMaxQuota: "Max quota",
        labelRecoveryInterval: "Recovery Interval",
        labelRecoveryAmount: "Recovery Amount",
        descriptionBlockList: "Add URLs to this list to count the time spent on matching pages towards your usage limit. ",
        descriptionAllowList: "Add URLs to this list to exclude the time spent on matching pages from your usage count. Allow list rules take precedence over Blocked list rules.",
        noteUrl: "Please omit 'https://' from URLs. Use '*' as a wildcard to match any sequence of characters. Rules apply to the beginning of the URL.",
        savedList: "The list of sites has been saved.",
        savedConfig: "The settings have been saved.",
        labelOriginalLink: "Go back to the original site ",
        blockedTitle: "Blocked by TimeDripper",
        blockedDescription: "Your time quota has been exceeded, and access to this site is currently restricted. Please wait until your time recharges.",
        labelShowQuotaOnBadge: "Display remaining time on badge"
        
    },
    ja: {
        navTop: "トップ",
        navSites: "サイト",
        navConfig: "設定",
        labelNextRecoveryIn: "次の回復まで",
        buttonSave: "保存",
        buttonCancel: "キャンセル",
        unitSeconds: "秒",
        unitMinutes: "分",
        unitHours: "時間",
        titleBlockList: "ブロックするサイト",
        titleAllowList: "許可するサイト",
        labelMaxQuota: "閲覧時間の最大値",
        labelRecoveryInterval: "回復の間隔",
        labelRecoveryAmount: "回復量",
        descriptionBlockList: "閲覧を制限したいURLを指定します。マッチしたURLにアクセスすると閲覧時間が消費されます。",
        descriptionAllowList: "閲覧を許可したいURLを指定します。「ブロックするサイト」よりも優先的に適用されます。",
        noteUrl: "'https://' の部分は不要です。'*' は、任意の文字列と一致するワイルドカードとして使えます。ルールはURLの先頭から適用されます。",
        savedList: "サイトのリストを保存しました。",
        savedConfig: "設定を保存しました。",
        labelOriginalLink: "元のサイトに戻る ",
        blockedTitle: "TimeDripperがブロックしました",
        blockedDescription: "制限時間を超過したため、このサイトへのアクセスが制限されています。制限時間が回復するまでお待ちください。",
        labelShowQuotaOnBadge: "バッジに残り時間を表示する"
    }
}
let lang;

if (navigator.languages) {
    lang = navigator.languages.includes('ja') || navigator.languages.includes('ja-JP') ? 'ja' : 'en';
} else {
    lang = navigator.language.startsWith('ja') ? 'ja' : 'en';
}

console.log("Selected language:", lang);

function updateTexts(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const text = translations[lang][key];
        el.textContent = text;
    }
    );
}
function updateImageSrcs(lang) {
    document.querySelectorAll("img[data-i18n-src]").forEach(img => {
        const key = img.getAttribute("data-i18n-src");
        img.src = translations[lang][key];
    });
}

updateTexts(lang);
updateImageSrcs(lang);