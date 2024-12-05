console.log("tab-manager.js")
class TabManager {
    constructor () {
        this.sites = {
            block:[],
            allow:[],
        };
        this.blockedTabIds = [];
        this.blockedTabs = [];
        this.idleTabs = [];
    }
    setSites (sites) {
        this.sites = sites;
    }
    wildcardToRegex(pattern) {
      // Convert wildcard domain pattern to regex
      const regexPattern = pattern
        .replace(/\./g, '\\.') // Escape dot for regex
        .replace(/\*/g, '.*') // Convert * to .* in regex for wildcard matching
        .replace(/\/\//g, '\/\/') // Ensure slashes are interpreted correctly
        + (pattern.endsWith('/') ? '' : '(\/|$)'); // Match end of domain/path
    
      return new RegExp('^https?:\/\/' + regexPattern, 'i');
    }
    
    isUrlBlocked(url) {
      if (!url) return false;
      const blockUrlList = this.sites.block;
      const allowUrlList = this.sites.allow;
    
      for (let allowPattern of allowUrlList) {
        const allowRegex = this.wildcardToRegex(allowPattern);
        if (allowRegex.test(url)) {
          return false;
        }
      }
    
      for (let blockPattern of blockUrlList) {
        const blockRegex = this.wildcardToRegex(blockPattern);
        if (blockRegex.test(url)) {
          return true;
        }
      }
    
      return false;
    }
    updateTabInfo (tabs, visibleWins) {
      const items = tabs.map((tab) => {
        return {
          url: tab.url,
          title: tab.title,
          windowId: tab.windowId,
          id: tab.id,
          blocked: visibleWins.includes(tab.windowId) && 
          tabManager.isUrlBlocked(tab.url)
        }
      });
      this.tabs = items;

      const openTabIds = items.map(item=>item.id);
      this.idleTabs = this.idleTabs.filter(v=>openTabIds.includes(v));
      // console.log("idleTabs=" + this.idleTabs.join(","))

      this.blockedTabs = items.filter(tab => tab.blocked);

      this.blockedTabIds =  this.blockedTabs.map(tab => tab.id)
        .filter(tabId=>!this.idleTabs.includes(tabId));
        // console.log("BlockedTabIds=%s",this.blockedTabIds.join(","))

    }
    tabsToBlock () {
        // getter
    }
    updateIdleState (tabId, idle) {
      console.log("idleTabs updating. tabId=%d idle=%d", tabId, idle)
      if (idle) {
        if (!this.idleTabs.includes(tabId)) {
          this.idleTabs.push(tabId);
        }
      } else {
        this.idleTabs = this.idleTabs.filter(v => v!=tabId);
      }
      // console.log("idleTabs=" + this.idleTabs.join(","))

    }
}
/*

tabManager.updateTabInfo(activeTabs);
tabManager.tabsToBlock()

tabManager.updateTabVisibility(tabInfo, true/false);

*/