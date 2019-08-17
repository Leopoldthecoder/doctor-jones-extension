import dj from "doctor-jones";
import { messageType } from "../const";
import { debounce } from "debounce";
import { isInBlacklist } from "../popup/utils";

let storedOptions = {};

let textNodes = [];
let touched = false;
let manualRevoked = false;
let blacklist = [];

const walk = nodes => {
  nodes.forEach(node => {
    if (
      ["SCRIPT", "STYLE", "META", "LINK", "HEAD", "SVG", "PATH"].includes(
        (node.tagName || "").toUpperCase()
      )
    ) {
      return;
    }
    if (node.getAttribute && node.getAttribute("contenteditable")) {
      const activeElement = document.activeElement;
      if (activeElement && node.contains(activeElement)) {
        return;
      }
    }
    if (node.hasChildNodes()) {
      walk(node.childNodes);
    } else if (node.nodeType === 1 || node.nodeType === 3) {
      textNodes.push(node);
    }
  });
};

const format = options => {
  touched = true;
  textNodes = [];
  walk([document.documentElement]);
  textNodes.forEach(node => {
    if (node.hasChildNodes()) return;
    switch (node.nodeType) {
      case 1:
        node._innerText = node._innerText || node.innerText;
        node.innerText = dj(node.innerText, options);
        break;
      case 3:
        node._nodeValue = node._nodeValue || node.nodeValue;
        node.nodeValue = dj(node.nodeValue, options);
        break;
      default:
        break;
    }
  });
};

let observer;

const autoFormat = () => {
  if (isInBlacklist(blacklist)) return;
  const debouncedFormat = debounce(format, 100, true);

  const mutationHandler = mutationList => {
    if (manualRevoked) return;
    mutationList.forEach(() => {
      debouncedFormat(storedOptions);
    });
  };

  const observerOptions = {
    childList: true,
    subtree: true
  };

  observer = new MutationObserver(mutationHandler);
  observer.observe(document.body, observerOptions);
  debouncedFormat(storedOptions);
};

chrome.storage.sync.get(["FORMAT_OPTIONS"], result => {
  if (result && result["FORMAT_OPTIONS"]) {
    storedOptions = result["FORMAT_OPTIONS"];
    if (storedOptions.blacklist) {
      blacklist = storedOptions.blacklist
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean);
    }
    if (storedOptions.autoFormat) {
      autoFormat();
    }
  }
});

const revoke = () => {
  if (!touched) return;
  touched = false;
  textNodes.forEach(node => {
    if (node.hasChildNodes()) return;
    switch (node.nodeType) {
      case 1:
        node.innerText = node._innerText || node.innerText;
        break;
      case 3:
        node.nodeValue = node._nodeValue || node.nodeValue;
        break;
      default:
        break;
    }
  });
};

chrome.runtime.onMessage.addListener((request, sender) => {
  if (chrome.runtime.id !== sender.id) {
    return;
  }

  switch (request.type) {
    case messageType.format:
      format(request.options);
      break;

    case messageType.revoke:
      revoke();
      manualRevoked = true;
      break;

    case messageType.startAutoFormat:
      autoFormat();
      break;

    case messageType.stopAutoFormat:
      if (observer) {
        observer.disconnect();
      }
      revoke();
      break;

    default:
      break;
  }
});
