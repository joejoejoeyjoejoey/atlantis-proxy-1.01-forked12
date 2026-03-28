let allCloseTabBtns = document.querySelectorAll('.close-tab');

        let tabHistory = {}

        let searchEngine = "https://duckduckgo.com/?q="

        document.querySelector('.add-tab').addEventListener("click", () => {
            createTab()
        });

        document.querySelector('.sj-input').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                let text = e.target.value

                search(text)
            }
        })

        document.querySelector('.navigate-backwards').addEventListener('click', () => {
            navBack()
        })

        document.querySelector('.navigate-fowards').addEventListener('click', () => {
            navForwards()
        })

        document.querySelector(".reload-page").addEventListener('click', () => {
            reloadPage()
        })



        function parseUrlAndUseParams() {
            let urlParams = new URLSearchParams(window.location.search);

            let redirectPage = urlParams.get("search")

            if (redirectPage) {
                search(redirectPage)
            }
        }


        function search(input, fromNav = false) {
            //If the search is from navigating fowards/backwards, then 
            // i wont set the currentLoc to the end
           

            let frame = active().iframe
            let tab = active().tab
            let id = active().id

            //create tabHistory.id and tabHistory.id.history so no errors
            if (!tabHistory[id]) tabHistory[id] = {}
            if (!tabHistory[id].history) tabHistory[id].history = []


            

            //if its not from one of the nav button (fowards/backwards) then dont 
            // update currentLoc to the end so you can nav back and forth
            //also if not from the nav, add the page to the tabs history
            if (!fromNav) {
                tabHistory[id].currentLoc = (tabHistory[id].history.length) - 1
                tabHistory[id].history.push(input)
            }
            
            //add https:// if necesary
            if ((input.includes('.')) && (!input.includes(' ')) && input.substring(0, 7) != "http://" && input.substring(0, 8) != "https://" && input.match(/^[^\s.]+\.[^\s.]+/)) {
                input = "https://" + input
            } else {
             input = searchEngine + input;   
            }

            input = scramjet.encodeUrl(input)

            //add loading animation

            //barLoading 3s linear 0s infinite forwards
            console.log("Search: Started Bar Animation")
            document.documentElement.style.setProperty("--loadingAnimation", "barLoading 3s linear 0s infinite forwards")


            //set iframes source to the proxied input
            frame.src = input;
        }

        function navBack() {
            let frame = active().frame;
            frame.contentWindow.history.back();
        }

        function navForwards() {
            let frame = active().frame;
            frame.contentWindow.history.forward()
        }

        function reloadPage() {
            let frame = active().frame;
            frame.contentWindow.location.reload();
        }


        

/*

<div class="tab toicqhjam" tabid="toicqhjam">
            <span class="close-tab">✕</span>
            </div>

*/







        function createTab() {
            //create tab

            let tab = document.createElement('div')
            let tabId = uniqeId();
            tab.innerHTML = `
                <img src="/img/BG_atlantis.png" class="tab-favicon" onerror="this.src = '/prxy/icons/web-icon.png' ">
                <span class="tab-text-title">Atlantis - Search the web freely.</span>
                <span class="close-tab">✕</span>
            `

            tab.classList.add('tab')
            tab.classList.add(tabId)
            tab.setAttribute("data-tabid", tabId)
            //insert tab

            let tabsHolder = document.querySelector('.tabs-bar-holder')
            let addTabDiv = document.querySelector('.center-er-add-tab-span')

            tabsHolder.insertBefore(tab, addTabDiv)

            //create + insert frame
            
            let frame = scramjet.createFrame()

            frame.addEventListener("urlchange", (e) => {
                console.log("url change: started bar animation", e)

                updateTabTitleAndFavicon()

                updateUrlInBar()

                document.documentElement.style.setProperty("--loadingAnimation", "barLoading 3s linear 0s infinite forwards")

                handleSjFrameLoad() //if it work it works, dont judge...
            })


            
            frame = frame.frame

            frame.classList.add('sj-frame')
            frame.classList.add(tabId)
            frame.setAttribute("data-tabid", tabId)
            frame.src = "/prxy/start-page/start-page.html"
            frame.allow = "autoplay; microphone"

        frame.addEventListener("load", (e) => {
                handleSjFrameLoad(e)
        })
            /*
            frame.contentDocument.addEventListener("readystatechange", (e) => {
                console.log("readyStateChange in event listener")
                handleSjFrameReadyStateChange(e)
            }) */
            //-add random bg to frame-\\

            //-NVM-\\
            /*
            frame.srcdoc = `
            <style>
            body {
            background-color: rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)});
            }    
            </style>
            `
            */
            document.querySelector('.frame-div').appendChild(frame)
            



            //event listeners
            tab.querySelector('.close-tab').addEventListener("click", () => {
                closeTab(tabId)
            })

            tab.addEventListener("click", (event) => {
                
                if (event.target.closest(`.tab.${tabId} .close-tab`)) return
                focusTab(tabId)
                
            })



            //focus the tab
            focusTab(tabId)
        }




        function closeTab(tabId) {
            let tab = document.querySelector(`.tab.${tabId}`)
            let sjFrame = document.querySelector(`iframe.${tabId}`)


            if (tab.classList.contains('activeEl')) {

                if (document.querySelectorAll('.tab').length == 1) return

                if (tab.nextElementSibling.classList.contains('tab')) {
                    let newTabId = tab.nextElementSibling.getAttribute('data-tabid')
                    focusTab(newTabId)
                } else if (tab.previousElementSibling.classList.contains('tab')) {
                    let newTabId2 = tab.previousElementSibling.getAttribute('data-tabid')
                    focusTab(newTabId2)
                }
            }

            sjFrame.remove()
            tab.remove(); 
        }




        function focusTab(id) {
            let tab = document.querySelector(`.tab.${id}`)
            let frame = document.querySelector(`iframe.${id}`)

            hideFramesAndRemoveActiveFromAllTabs()

            frame.classList.add('activeEl')
            tab.classList.add('activeEl')

            console.warn("Focused tab, ID: ", id)

            updateUrlInBar()
            handleSjFrameLoad()
        }


        function hideFramesAndRemoveActiveFromAllTabs() {
            let frames = document.querySelectorAll('.sj-frame')
            let tabs = document.querySelectorAll('.tab')

            frames.forEach(el => {
                el.classList.remove('activeEl')
            })
            
            tabs.forEach(el => {
                el.classList.remove('activeEl')
            })

        }





        function getActiveFrame() {
            let el = document.querySelector('iframe.activeEl')

            return el
        }

        function getActiveTab() {
            let el = document.querySelector('.tab.activeEl')

            return el
        }

        function activeFromId(id) {
            let tab = document.querySelector(`.tab.${id}`);
            let frame = document.querySelector(`iframe.${id}`)

            let response = {
                "tab": tab,
                "frame": frame,
                "iframe": frame
            }

            return response
        }

        function active() {
            let frame = document.querySelector('iframe.activeEl')
            let tab = document.querySelector('.tab.activeEl')
            

            let tabId = tab.getAttribute('data-tabid')

            let response = {
                "iframe": frame,
                "frame": frame,
                "tab": tab,
                "id": tabId,
                "tabid": tabId,
                "tabId": tabId
            }

            return response
        }

                let usedIDs = new Set()

        function uniqeId(t = null) {
            let id = Math.random().toString(36).substring(2, 10)
            while (usedIDs.has(id)) {
                id = Math.random().toString(36).substring(2, 10)
            }
            usedIDs.add(id)
            if (!t) {
            return "t"+id
            } else {
                return id
            }
        }

        function randomInt(min, max) {
              min = Math.ceil(min);
            max = Math.floor(max);
              return Math.floor(Math.random() * (max - min + 1)) + min;
        }


        function updateUrlInBar() {
                  

                let frame = active().frame
                let realLocation = frame.contentWindow.location.href
                
                //let frameSrc = frame.src;
                let url = scramjet.decodeUrl(frame.contentWindow.location.href); //should return "" but doesnt


                if ((!url) || (url == "rt-page/start-page.html")) { //lol hardcoded, now i cant change the path
                    if (realLocation) { //idk why it works, but id it works, it works
                        url = "atlantis://new-tab"
                    } else {
                    return
                    }
                }



                let input = document.querySelector('.sj-input')
                

                

                //if (currentInput == url) return

                input.value = url;

                

        }

        function updateTabTitleAndFavicon() {
            let title = active().frame.contentWindow.document.title;
            let apiEndpoint = "https://icon.horse/icon/"
            let tab = active().tab;
            let tabFavicon = tab.querySelector(".tab-favicon")
            let frame = active().frame;
            
            //idk

                let realLocation = frame.contentWindow.location.href
                
                
                let url = scramjet.decodeUrl(frame.contentWindow.location.href); //should return "" but doesnt


                if ((!url) || (url == "rt-page/start-page.html")) { 
                    if (realLocation) { 
                        url = "atlantis://new-tab"
                    }
                }

            //kdi

            let imgLink = apiEndpoint + normalizeUrl(url)

                tabFavicon.src = imgLink;

                let listener = () => {
                    frameReadyStateChange(tab, frame, listener)
                }

                if (frame.contentDocument.readyState == "loading") {
                    frame.contentDocument.addEventListener("readystatechange", listener);
                    
                }
            


                
        }


        function frameReadyStateChange(tab, frame, listener) {
            

            if ((frame.contentDocument.readyState === "interactive") || (frame.contentDocument.readyState === "complete")) {
                //OKay this isnt my most organized code. but stop loading bar when the iframe is interactive
                //nvm this no work fully
                document.documentElement.style.setProperty("--loadingAnimation", "none")

                
            let title = frame.contentWindow.document.title
            tab.querySelector(".tab-text-title").textContent = title

            frame.contentDocument.removeEventListener("readystatechange", listener);

        }





        }

         function handleSjFrameLoad() {
            console.log()
            console.log("SJ frame load called")


            let frame = active().frame;

            console.log(frame)

            console.log(frame?.contentDocument?.readyState)
            

            if ((frame?.contentDocument?.readyState === "complete") || (frame?.contentDocument?.readyState === "interactive" )) {
                document.documentElement.style.setProperty("--loadingAnimation", "none")
                console.log("Set Loading Animation To None")
            }
            console.log("=------==-------=")
        }


        function normalizeUrl(url) {
  try {
    // add protocall
    let withProtocol = url.match(/^https?:\/\//) ? url : `https://${url}`;
    let  hostname  = new URL(withProtocol);
    hostname = hostname.hostname
    // remove www
    return hostname.replace(/^www\./, "");
  } catch {
    return url; // original if error
  }
}

        createTab()
       
       parseUrlAndUseParams()