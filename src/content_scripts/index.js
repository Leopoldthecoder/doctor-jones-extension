import dj from "doctor-jones";
import { messageType } from "../const";
import { debounce } from "debounce";

let storedOptions = {};

let textNodes = [];
let touched = false;
let manualRevoked = false;

let execStart;
let execCount = 0;
let execFlag = true;

const walk = nodes => {
  nodes.forEach(node => {
    if (node.hasChildNodes()) {
      walk(node.childNodes);
    } else if (node.nodeType === 1 || node.nodeType === 3) {
      textNodes.push(node);
    }
  });
};

const pauseExec = () => {
  execFlag = false;
  setTimeout(() => {
    execFlag = true;
    execStart = null;
    execCount = 0;
  }, 3000);
};

const format = (options, mustExec = false) => {
  if (!mustExec) {
    if (!execFlag) return;
    if (execStart && Date.now() - execStart <= 3000) {
      execCount++;
      if (execCount >= 20) {
        // 若三秒内执行了 20 次以上 format，则暂停三秒
        pauseExec();
      }
    } else {
      execStart = Date.now();
    }
  }

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

const autoFormat = () => {
  const debouncedFormat = debounce(format, 100);

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

  const observer = new MutationObserver(mutationHandler);
  observer.observe(document.body, observerOptions);
};

chrome.storage.sync.get(["FORMAT_OPTIONS"], result => {
  if (result && result["FORMAT_OPTIONS"]) {
    storedOptions = result["FORMAT_OPTIONS"];
    if (storedOptions.autoFormat) {
      autoFormat();
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender) => {
  if (chrome.runtime.id !== sender.id) {
    return;
  }

  switch (request.type) {
    case messageType.format:
      format(request.options, true);
      break;

    case messageType.revoke:
      if (!touched) return;
      touched = false;
      manualRevoked = true;
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
      break;

    default:
      break;
  }
});
