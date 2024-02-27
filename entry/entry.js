const targetNode = document.body;

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

// @ts-ignore
debugger;
const callback = function (mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      // @ts-ignore
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === "CANVAS") {
          // @ts-ignore
          import("/build/bundle.js");
          observer.disconnect();
        }
      });
    }
  }
};

// Create an instance of the MutationObserver
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
