import parseDomain from "parse-domain";

let activeTab;

export const getActiveTab = () => {
  if (!activeTab) {
    activeTab = new Promise(resolve => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        resolve(tabs[0]);
      });
    });
  }
  return activeTab;
};

export const isInBlacklist = blacklist => {
  return blacklist.some(item => {
    const itemDomain = parseDomain(item) || {};
    const currentDomain = parseDomain(location.href) || {};
    return (
      itemDomain.tld === currentDomain.tld &&
      itemDomain.domain === currentDomain.domain &&
      (!itemDomain.subdomain ||
        itemDomain.subdomain === currentDomain.subdomain)
    );
  });
};
