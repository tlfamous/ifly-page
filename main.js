const widgetConfig = {
  name: "iFLY",
  url: "bot-service.enegel.ai",
  orgId: "ifly",
  botId: "obbcg68itx",
  logoUrl:
    "https://storage.googleapis.com/c7o-yagi5wlved-cdn/ifly/logos/mmy0kbo41w_iFLY%20Logopng",
};

const launcherOpenSvg = `
  <svg viewBox="0 0 176 40" width="176" height="40" aria-hidden="true">
    <rect width="176" height="40" rx="20" fill="none" />
    <path
      fill="currentColor"
      d="M24.5 11c-3.03 0-5.5 2.47-5.5 5.5v3c0 3.03 2.47 5.5 5.5 5.5S30 22.53 30 19.5v-3c0-3.03-2.47-5.5-5.5-5.5Zm0 2c1.93 0 3.5 1.57 3.5 3.5v3c0 1.93-1.57 3.5-3.5 3.5S21 21.43 21 19.5v-3c0-1.93 1.57-3.5 3.5-3.5Z"
    />
    <path
      fill="currentColor"
      d="M32.75 18.5a1 1 0 0 0-1 1 7.25 7.25 0 0 1-14.5 0 1 1 0 0 0-2 0 9.26 9.26 0 0 0 8.25 9.2V32a1 1 0 1 0 2 0v-3.3a9.26 9.26 0 0 0 8.25-9.2 1 1 0 0 0-1-1Z"
    />
    <text
      x="54"
      y="25"
      fill="currentColor"
      font-family="Inter, system-ui, sans-serif"
      font-size="14"
      font-weight="600"
      letter-spacing="0"
    >
      Chat with iFLY
    </text>
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
  element.setAttribute("popup-logo-url", widgetConfig.logoUrl);
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
