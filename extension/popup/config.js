// config.js
document.addEventListener('DOMContentLoaded', function() {
    browser.runtime.sendMessage({ action: "getConfig" }).then(config => {
        setConfigValue('js_maxQuota', config.maxQuotaSec, ['3600', '60', '1']);
        setConfigValue('js_recoveryInterval', config.recoveryIntervalSec, ['3600', '60', '1']);
        setConfigValue('js_recoveryAmount', config.recoveryAmountSec, ['60', '1']);
        document.getElementById('js_showQuotaOnBadge').checked = config.showQuotaOnBadge || false;
    });

    function setConfigValue(field, seconds, units) {
        const input = document.getElementById(field);
        const select = document.getElementById(field + 'Unit');
        for (let unit of units) {
            if (seconds % unit === 0) {
                input.value = seconds / unit;
                // select.value = unit === '3600' ? 'hours' : (unit === '60' ? 'minutes' : 'seconds');
                select.value = unit;
                break;
            }
        }
    }

    document.getElementById('js_saveBtn').addEventListener('click', function() {
        const maxQuota = document.getElementById('js_maxQuota').value * document.getElementById('js_maxQuotaUnit').value;
        const recoveryInterval = document.getElementById('js_recoveryInterval').value * document.getElementById('js_recoveryIntervalUnit').value;
        const recoveryAmount = document.getElementById('js_recoveryAmount').value * document.getElementById('js_recoveryAmountUnit').value;
        const showQuotaOnBadge = document.getElementById('js_showQuotaOnBadge').checked;
        const config = { 
            maxQuotaSec: maxQuota, 
            recoveryIntervalSec: recoveryInterval, 
            recoveryAmountSec: recoveryAmount,
            showQuotaOnBadge: showQuotaOnBadge
        };
        browser.runtime.sendMessage({
            action: "setConfig",
            config: config
        }).then(response => {
            console.debug(response)
            if (response.success) {
              // alert("success")
              document.getElementById("js_savedMessage").style.display = "block";
            }
        });
    });

    document.getElementById('js_cancelBtn').addEventListener('click', function() {
        window.close();
    });
});

document.getElementById("js_help").addEventListener("click", showWelcomePageBg)