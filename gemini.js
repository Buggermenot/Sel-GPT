chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    let tooltip;
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        console.log("Started");
        document.addEventListener("mouseup", async function () {
          // let tooltip;
          tooltip = document.createElement("div");
          tooltip.className = "SEL_tooltip";
          tooltip.style.position = "fixed";
          tooltip.style.color = "black";
          tooltip.style.backgroundColor = "white";

          let selection = window.getSelection();
          console.log("Selection:", selection.toString());

          if (selection.toString().length < 10) {
            document.querySelectorAll(".tooltip").forEach(function (tooltip) {
              tooltip.remove();
            });
            console.log("Too Short");
            return;
          }

          console.log("Sending Selection...");

          tooltip.textContent = "Sending Selection...";
          document.body.appendChild(tooltip);

          let requestBody = {
            contents: [
              {
                parts: [
                  {
                    text:
                      "Briefly and only answer the Question without any explanation: \n\n" +
                      selection.toString(),
                  },
                ],
              },
            ],
          };
          const GEMINI_API_KEY = "API_KEY_HERE"; // Get Key: https://aistudio.google.com/app/apikey
          const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?`;
          
          
          const response = await fetch(`${BASE_URL}key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }).then((response) => response.json());

          tooltip.textContent = "Awaiting Response...";
          document.body.appendChild(tooltip);

          // const data = "Hello";      // For testing only. Comment lines 32-59 before enabling this.
          if (GEMINI_API_KEY == "API_KEY_HERE") {
            const data = "Enter your API Key at line 45 in gemini.js";
          } else {
            const data = response["candidates"][0]["content"]["parts"][0]["text"];
          }
          console.log("Got Response...");
          tooltip.textContent = "Got Response...";
          document.body.appendChild(tooltip);

          console.log(data);

          tooltip.textContent = data;
          document.body.appendChild(tooltip);
        });

        document.addEventListener("mousemove", function (e) {
          if (tooltip) {
            tooltip.style.top = e.clientY + 20 + "px";
            tooltip.style.left = e.clientX + "px";
          }
        });
        document.addEventListener("mousedown", function () {
          document.querySelectorAll(".SEL_tooltip").forEach(function (tooltip) {
            tooltip.remove();
          });
        });
      },
    });
  }
});
