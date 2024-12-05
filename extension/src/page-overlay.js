class PageOverlay {
    constructor() {
      this.overlay = null;
      this.clickHandler = null;
      this.iframe = null;
    }
  
    _initializeOverlay() {
      if (this.overlay) return;
  
      this.overlay = document.createElement('div');
      this.overlay.id = 'pageOverlay';
      this.overlay.style.position = 'fixed';
      this.overlay.style.top = '0';
      this.overlay.style.left = '0';
      this.overlay.style.width = '100vw';
      this.overlay.style.height = '100vh';
      this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      this.overlay.style.zIndex = '1000';
      this.overlay.style.display = 'none';
      this.overlay.style.alignItems = 'center';
      this.overlay.style.justifyContent = 'center';
  
      this.iframe = document.createElement('iframe');
      this.iframe.style.border = 'none';
      this.iframe.style.width = '80vw';
      this.iframe.style.height = '80vh';
      this.iframe.style.backgroundColor = '#fff';
  
      this.overlay.appendChild(this.iframe);
  
      this.overlay.addEventListener('click', (event) => {
        if (this.clickHandler) {
          this.clickHandler(event);
        }
      });
  
      if (document.body) {
        document.body.appendChild(this.overlay);
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          document.body.appendChild(this.overlay);
        });
      }
    }
    sendMessage (message) {
      if (!this.iframe) {
        return;
      }
      if (this.iframe && this.iframe.contentWindow) {
        this.iframe.contentWindow.postMessage(message, '*');
      }

    }
  
    show() {
      this._initializeOverlay();
      this.overlay.style.display = 'flex';
    }
  
    hide() {
      if (this.overlay) {
        this.overlay.style.display = 'none';
      }
    }
  
    setIframeUrl(url) {
      this._initializeOverlay();
      this.iframe.src = url;
    }
  
    setClickHandler(handler) {
      this.clickHandler = handler;
    }
  }
  