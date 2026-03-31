const widgetConfig = {
  name: "iFLY",
  url: "bot-service.enegel.ai",
  orgId: "ifly",
  botId: "obbcg68itx",
  logoUrl:
    "https://storage.googleapis.com/c7o-yagi5wlved-cdn/ifly/logos/mmy0kbo41w_iFLY%20Logopng",
};

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

  const element = document.createElement("enegelai-bot");
  element.setAttribute("name", widgetConfig.name);
  element.setAttribute("url", widgetConfig.url);
  element.setAttribute("org-id", widgetConfig.orgId);
  element.setAttribute("bot-id", widgetConfig.botId);
  element.setAttribute("logo-url", widgetConfig.logoUrl);
  document.body.appendChild(element);
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountBotWidget, { once: true });
} else {
  mountBotWidget();
}
