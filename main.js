const widgetConfig = {
  name: "",
  url: "bot-service.enegel.ai",
  orgId: "ifly",
  botId: "obbcg68itx",
  logoUrl:
    "https://cdn-production-products.iflyworld.com/new_ifly_logo_0733585332.png",
  popupLogoUrl:
    "https://storage.googleapis.com/c7o-yagi5wlved-cdn/ifly/logos/mmy0kbo41w_iFLY%20Logopng",
};

const launcherOpenSvg = `
  <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
    <circle cx="32" cy="32" r="32" fill="none" />
    <g transform="translate(6 10) scale(0.6)">
      <path
        fill="#ef3b3f"
        d="M39 30c0-8.5 6.7-15.5 15-15.5c6 0 11.2 3.2 13.8 8.1c4.9-2 12.5-7.3 21-16.6c0.8-0.9 2.2 0.2 1.5 1.2C85.7 18 82.5 26 80.8 33.4c-4.7 21.2-19.9 32.1-43.3 32.1c-10 0-20.6-2.3-31.7-7.1c-1.4-0.6-0.8-2.6 0.7-2.3c6.4 1.4 12.2 2 17.3 2c17.2 0 28.6-6.8 34.2-20.5c-1.4 3.4-4.9 5.8-8.9 5.8C43.7 43.4 39 37.4 39 30Z"
      />
      <circle cx="55" cy="17" r="9.5" fill="#ef3b3f" />
    </g>
  </svg>
`;

const launcherCloseSvg = `
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6 6.4 5Z"
    />
  </svg>
`;

const customMicIconSvg = `
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 3a4 4 0 0 1 4 4v3.2a4 4 0 1 1-8 0V7a4 4 0 0 1 4-4Zm0 13.25a7.26 7.26 0 0 0 7.25-7.25h-2A5.25 5.25 0 0 1 12 14.25A5.25 5.25 0 0 1 6.75 9h-2A7.26 7.26 0 0 0 12 16.25Zm-1 1.7h2V21h-2z"
    />
  </svg>
`;

const customSendIconSvg = `
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
    <path
      fill="currentColor"
      d="m4 12 1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8z"
    />
  </svg>
`;

const storageKeyHints = [
  "enegel",
  "ifly",
  "bot",
  "chat",
  "conversation",
  widgetConfig.botId,
];

function mountBotWidget() {
  if (document.querySelector("enegelai-bot")) {
    return;
  }

  // Shadow DOM-compatible approach:
  // use the widget's supported config attributes here, and use CSS variables
  // plus exported ::part(...) hooks in styles.css for the rest of the theme.
  const element = document.createElement("enegelai-bot");
  element.setAttribute("name", widgetConfig.name);
  element.setAttribute("url", widgetConfig.url);
  element.setAttribute("org-id", widgetConfig.orgId);
  element.setAttribute("bot-id", widgetConfig.botId);
  element.setAttribute("logo-url", widgetConfig.logoUrl);
  element.setAttribute("popup-logo-url", widgetConfig.popupLogoUrl);
  element.setAttribute("anchor-open-svg", launcherOpenSvg.trim());
  element.setAttribute("anchor-close-svg", launcherCloseSvg.trim());
  document.body.appendChild(element);
}

function installCustomVoiceIconPatch() {
  const patchInputElement = (tagName) => {
    const elementClass = customElements.get(tagName);
    if (!elementClass || elementClass.__iflyVoiceIconPatched) {
      return;
    }

    const originalGetCtrlIconSvg = elementClass.prototype.getCtrlIconSvg;
    if (typeof originalGetCtrlIconSvg !== "function") {
      return;
    }

    elementClass.prototype.getCtrlIconSvg = function getCtrlIconSvgPatched() {
      const originalSvg = originalGetCtrlIconSvg.call(this) || "";
      const isSendState =
        originalSvg.includes("m4 12") || originalSvg.includes("5.58 5.59");

      return isSendState ? customSendIconSvg : customMicIconSvg;
    };

    elementClass.__iflyVoiceIconPatched = true;
  };

  customElements
    .whenDefined("cb-user-input-mm")
    .then(() => patchInputElement("cb-user-input-mm"))
    .catch(() => {});
}

function clearMatchingStorage(storage) {
  const keysToDelete = [];

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key) {
      continue;
    }

    const lowerKey = key.toLowerCase();
    if (storageKeyHints.some((hint) => lowerKey.includes(hint))) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach((key) => storage.removeItem(key));
}

function clearConversation() {
  clearMatchingStorage(window.localStorage);
  clearMatchingStorage(window.sessionStorage);
  window.location.reload();
}

document
  .getElementById("clearConversationButton")
  .addEventListener("click", clearConversation);

installCustomVoiceIconPatch();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountBotWidget, { once: true });
} else {
  mountBotWidget();
}
