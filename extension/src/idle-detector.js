class IdleDetector {
  constructor(idleTimeout = 3 * 60 * 1000) { // Default 3min
    this.idleTimeout = idleTimeout;
    this.idleTimer = null;
    this.isOverlayVisible = false;
    this.isIdleDetectionActive = false;

    this.resetIdleTimer = this.resetIdleTimer.bind(this);
    this.showIdleOverlay = this.showIdleOverlay.bind(this);
    this.cancelIdleOverlay = this.cancelIdleOverlay.bind(this);
    this.idlePageUrl = null;

    this.overlay = new PageOverlay();
    this.overlay.setClickHandler(
      ()=>{
        this.cancelIdleOverlay();
      }
    );
  }
  setIdlePageUrl(url) {
    console.log("setIdlePageUrl %s", url)
    this.idlePageUrl = url;

  }
  onIdleDetected() {
    console.log("IdleDetector.onIdleDetected (original)");
  }

  onIdleCancelled() {
    console.log("IdleDetector.onIdleCancelled (original)");
  }

  resetIdleTimer() {
    if (this.isOverlayVisible) return;
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(this.showIdleOverlay, this.idleTimeout);
  }

  showIdleOverlay() {
    this.onIdleDetected();
    this.overlay.setIframeUrl(this.idlePageUrl);
    this.overlay.show();

    this.isOverlayVisible = true;
  }

  _removeOverlay () {
    this.overlay.hide();
    this.isOverlayVisible = false;
  }
  cancelIdleOverlay() {
    if (!this.isOverlayVisible) return;
    this._removeOverlay();
    this.onIdleCancelled();
    this.resetIdleTimer();
  }

  start() {
    if (this.isIdleDetectionActive) return;
    this.isIdleDetectionActive = true;

    document.addEventListener('mousemove', this.resetIdleTimer);
    document.addEventListener('keydown', this.resetIdleTimer);
    document.addEventListener('scroll', this.resetIdleTimer);
    document.addEventListener('click', this.resetIdleTimer);

    this.resetIdleTimer();
  }

  stop() {
    this._removeOverlay();
    if (!this.isIdleDetectionActive) return;
    this.isIdleDetectionActive = false;

    document.removeEventListener('mousemove', this.resetIdleTimer);
    document.removeEventListener('keydown', this.resetIdleTimer);
    document.removeEventListener('scroll', this.resetIdleTimer);
    document.removeEventListener('click', this.resetIdleTimer);

    clearTimeout(this.idleTimer);
  }
}
