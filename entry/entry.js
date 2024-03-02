const targetNode = document.body;

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

// @ts-ignore
const callback = function (mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      // @ts-ignore
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === "CANVAS") {
          // @ts-ignore
          import("/dist/build/bundle.js");
          observer.disconnect();
          const getNodeMenuOptions = LGraphCanvas.prototype.getNodeMenuOptions;
          LGraphCanvas.prototype.getNodeMenuOptions = function (node) {
            const response = getNodeMenuOptions.apply(this, arguments);

            response.push({
              "content": "My menu Entry",
              "callback": (item, options, e, menu, node)=>{console.log("my entry clicked!!")}            })

            return response;
          }
        }
      });
    }
  }
};



// Create an instance of the MutationObserver
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
