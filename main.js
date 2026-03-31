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

const launcherBadgeLogoUrl = widgetConfig.popupLogoUrl;

const launcherOpenSvg = `
  <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
    <defs>
      <clipPath id="ifly-launcher-clip">
        <circle cx="32" cy="32" r="30" />
      </clipPath>
    </defs>
    <circle cx="32" cy="32" r="30" fill="#ffffff" />
    <image
      href="${launcherBadgeLogoUrl}"
      x="8"
      y="8"
      width="48"
      height="48"
      preserveAspectRatio="xMidYMid slice"
      clip-path="url(#ifly-launcher-clip)"
    />
  </svg>
`;

const launcherCloseSvg = `
  <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
    <circle cx="32" cy="32" r="30" fill="#3252cf" />
    <path
      fill="#ffffff"
      d="M24.53 22.4 22.4 24.53 29.87 32l-7.47 7.47 2.13 2.13L32 34.13l7.47 7.47 2.13-2.13L34.13 32l7.47-7.47-2.13-2.13L32 29.87 24.53 22.4Z"
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
