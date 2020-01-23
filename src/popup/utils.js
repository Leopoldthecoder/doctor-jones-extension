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

export const convertReversedQuotes = s => {
  let counter = {
    single: 0,
    double: 0
  };
  const len = s.length;
  let ans = "";
  for (let i = 0; i < len; i++) {
    const char = s[i];
    if (char === "‘" || char === "’") {
      ans += counter.single % 2 === 0 ? "‘" : "’";
      counter.single++;
    } else if (char === "“" || char === "”") {
      ans += counter.double % 2 === 0 ? "“" : "”";
      counter.double++;
    } else {
      ans += s[i];
    }
  }
  return ans;
};
