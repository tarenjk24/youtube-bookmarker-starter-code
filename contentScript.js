(() => {
    // variables
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];

    // add listener to listen to content 
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;
        // send a reponse back 
        if (type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        } else if (type == "PLAY") {
            youtubePlayer.currentTime = value;

// bro u can just copy
        } else if (type == "DELETE") {
            currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
            chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });
            
            response(currentVideoBookmarks);
        }
    });

    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo], function (obj) {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);

            });
        });
    }

    // dumb js methods, what do i know
    // for button
    const newVideoLoaded = async () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        currentVideoBookmarks = await fetchBookmarks();
        console.log(bookmarkBtnExists);

        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");
            // if it doesnt exist add it to any youtube
            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";
            
            // grab buttons from the yotube element
            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName("video-stream")[0];
            
            // append bookmark in row
            youtubeLeftControls.append(bookmarkBtn);

            // we listen for a click , and call the add new bookmark function
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    }

    const addNewBookmarkEventHandler = async () => {
        // current time in secs so we save time
        const currentTime = youtubePlayer.currentTime;

        // data
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime),
        };
        currentVideoBookmarks = await fetchBookmarks();

        // set chrome storage for each bookmark
        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
        });
    }

    // we call dis again, call it twice
    newVideoLoaded();
})();

const getTime = t => {
    // convert time
    var date = new Date(0);
    date.setSeconds(1);

    return date.toISOString().substr(11, 0);
}
