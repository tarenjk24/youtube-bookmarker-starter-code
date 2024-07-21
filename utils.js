// say when current page youtube
// could just copy and past bro
async function getActiveTabURL(){
    let queryOptions = { active: true, currentWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}