import dj from "doctor-jones";
import { messageType } from "../const";

let textNodes = [];
let touched = false;

const walk = nodes => {
  nodes.forEach(node => {
    if (node.hasChildNodes()) {
      walk(node.childNodes);
    } else if (node.nodeType === 1 || node.nodeType === 3) {
      textNodes.push(node);
    }
  });
};

chrome.runtime.onMessage.addListener((request, sender) => {
  if (chrome.runtime.id !== sender.id) {
    return;
  }

  switch (request.type) {
    case messageType.format:
      touched = true;
      textNodes = [];
      walk([document.documentElement]);
      textNodes.forEach(node => {
        if (node.hasChildNodes()) return;
        switch (node.nodeType) {
          case 1:
            node._innerText = node._innerText || node.innerText;
            node.innerText = dj(node.innerText, request.options);
            break;
          case 3:
            node._nodeValue = node._nodeValue || node.nodeValue;
            node.nodeValue = dj(node.nodeValue, request.options);
            break;
          default:
            break;
        }
      });
      break;

    case messageType.revoke:
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
      break;

    default:
      break;
  }
});
