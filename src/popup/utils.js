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
