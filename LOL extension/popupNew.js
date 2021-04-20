//getting the data from the site
activate.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: injectButton(),
  });
});

function injectButton() {

  let body = document.body;

  body.innerHTML = "<button id='activate'>Activate</button>" + body.innerHTML;


}
