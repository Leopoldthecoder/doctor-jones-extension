import dj from "doctor-jones";

let textNodes = [];

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
  textNodes = [];
  walk([document.documentElement]);
  textNodes.forEach(node => {
    if (node.hasChildNodes()) return;
    switch (node.nodeType) {
      case 1:
        node.innerText = dj(node.innerText, request);
        break;
      case 3:
        node.nodeValue = dj(node.nodeValue, request);
        break;
      default:
        break;
    }
  });
});
