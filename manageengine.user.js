// ==UserScript==
// @name              Tweaks for ticket system ManageEngine ServiceDesk Plus
// @name:de-DE        Tweaks für Ticketsystem ManageEngine ServiceDesk Plus
// @description       Automatically make ticket ids clickable and embed IK svg. (Less features than in v1.5 because GM_config needs code changes due to updates.)
// @description:de-DE Automatisch Ticket-Links klickbar machen und IK SVG einbetten. (Weniger Features als in v1.5, da für GM_config Code-Anpassungen notwendig wären.)
// @namespace         jandunker
// @version           1.6
// @match             http://servicedesk/*
// @match             http://servicedesk.hgroup.intra/*
// @match             https://servicedesk/*
// @match             https://servicedesk.hgroup.intra/*
// @exclude           */framework/html/blank.html
// @noframes
// @license           GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright         2020-2024, eckende (https://openuserjs.org/users/eckende)
// @updateURL         https://openuserjs.org/meta/eckende/Tab_Titles_for_ticket_system_ManageEngine_ServiceDesk_Plus.meta.js
// @downloadURL       https://openuserjs.org/install/eckende/Tab_Titles_for_ticket_system_ManageEngine_ServiceDesk_Plus.user.js
// @icon              data:image/gif;base64,R0lGODlhEAAQAHAAACH5BAkAAAMALAAAAAAQABAAgQAAAHSK///TdAAAAAI7nI85wIDtDhAiGhCCXXRj/XRP5nXNQp4TJX4ZuLKOS3KVmjK2V0smlGuYTKkUS0bLHYEvHUS3eCqmiAIAOw==
// @icon64            data:image/gif;base64,R0lGODlhQABAAHAAACH5BAkAAAMALAAAAABAAEAAgQAAAHSK///TdAAAAAL/nI+py+0Po5y02ouzPqD7DwJUSHpjSZ4oqK7m5LJw/Ep0HX3Czu9fGwgKg79Zp9cr2jzDoTLnQfKekE9TSH3opIKsw3oNeBtb6ZgBvp4XZeRakW6+E+0krsoMzxH16V2bp/b3FcW1xxEoN0hWaLaIluj0yNboNgkXiXVJV2nXAaS3ydfpdzPaESZ2I4J4ZLh6CpC6ymrQ5wPbKhtqqsvVlWubSRQ8cPtr+ambyqypLOyKjPwU1yz4bEwq7VmbjWo9i3O8DYxdDe7cPb5NPYzeHk2erO4ODg8g/2peb32f77jvGzpFAfHpoxErXC9oBgEiXMbrIcNftBJGjBGLYrFzoMQWems4D9S1bnjicRNJkCQgk6VUEhKYsoVGbCV3jZR5kBZHVTpBzOzpDqjPnEAVCgXJTahRoT+PlVgalERTbeVAQIUpKcRUlrhCXLWZ0qlUoljT7SzxbxqJgc3QpiULlm1Yqmmfyr1I95/du3O16l0ll1ZdwGwF/70ReNVgxIVT6BIK6ajLj5ApSY58FHNlTJctZ94AOrTo0aRLmz5NoQAAOw==
// @author            Jan Dunker
// ==/UserScript==

// global variable declaration
var ticketlinksuccess = false;

// Language
// 0: de
// 1: en
const lang = navigator.language == "de" ? 0 : 1;

// debug mode
var logLevel = 0; // 0, 1 or 2



// clickable ticket no. links
//
// If activated, the texts on ticket pages are searched for ticket no.. Results get replaced by links.
const doAddTicketLinks = true;

// Open ticket links in new tabs
const openLinksInNewTab = true;

// The search runs every x ms:
const ticketlinksinterval = 5000;

// Regex to detect tickets
const ticketregex = new RegExp('\\b([5-9]\\d{5})\\b'); // 6 digits starting with 5, 6, 7, 8 or 9



// embed svg screenshot attachment
// /!\ This is a company specific feature. You can disable this if you work for a different employer.
const doEmbedSVG = true;

// Update interval for svg embed
// The smaller the number, the more often and more bad for performance
const updateinterval = 1000 // 1 Sekunde



const emptyfield = "";

// document.querySelector with handling
function querySel(selector){
    var elem = document.querySelector(selector);
    if (elem) {
        if (elem.innerText.trim() != "") return elem.innerText.trim();
        else return elem.title.trim();
    }
    else {
        console.log('[UserScript Tab Titles] "' + selector + '" not found, returning "' + emptyfield + '" instead. Try document.querySelector("' + selector + '")');
        return emptyfield;
    }
}


// adding ticket links: where to look/replace depending on current page
function addTicketLinks(){
    // if tab is not open (page is not visible) do not waste computing power and skip the update
    // except if tab title has not been set yet (if the tab was opened in the background) or if the tab was just hidden (see event handler)
    if (document.visibilityState != 'visible' && ticketlinksuccess){
        return;
    }

    let url = location.href;
    if (url.match(/^https?:\/\/[\w\d.-]*\/WorkOrder\.do\?(?:.*&)?woMode=viewWO/)) {
        addTicketLinksForTicket();
    } else if (url.match(/^https?:\/\/[\w\d.-]*\/SearchN\.do/) && document.getElementById("requestId")) {
        addTicketLinksForTicket();
    }
}

// adding ticket links: where to look/replace on ticket pages
function addTicketLinksForTicket(){
    ticketlinksuccess = true;
    if (logLevel > 0) console.time('addTicketLinksForTicket');

    // Subject
    if (logLevel > 1) console.time('addTicketLinksForTicket_Subject');
    addTicketLinksToId('req_subject');
    if (logLevel > 1) console.timeEnd('addTicketLinksForTicket_Subject');

    // Body
    if (logLevel > 1) console.time('addTicketLinksForTicket_Description');
    addTicketLinksToId('req-desc-body');
    if (logLevel > 1) console.timeEnd('addTicketLinksForTicket_Description');

    // Conversations
    if (logLevel > 1) console.time('addTicketLinksForTicket_Conversations');
    addTicketLinksToQuery('.panel-collapse.collapse');
    if (logLevel > 1) console.timeEnd('addTicketLinksForTicket_Conversations');

    if (logLevel > 0) console.timeEnd('addTicketLinksForTicket');
}

// adding ticket links: call function for element
function addTicketLinksToId(id){
    // if not found log to console and return
    let elem = document.getElementById(id);
    if (!elem) {
        console.log('[UserScript Tab Titles] Adding ticket links failed: "' + id + '" not found. Try document.getElementById("' + id + '")');
        return;
    }
    addTicketLinksToElem(elem);
}

// adding ticket links: call function for all elements
function addTicketLinksToQuery(selector){
    // if not found log to console and return
    let elems = document.querySelectorAll(selector);
    if (!elems) {
        console.log('[UserScript Tab Titles] Adding ticket links failed: "' + selector + '" not found. Try document.querySelectorAll("' + selector + '")');
        return;
    }

    for (let i=0; i<elems.length; i++) {
        addTicketLinksToElem(elems[i])
    }
}

// adding ticket links: the actual work
function addTicketLinksToElem(elem){
    if (elem) {
        // get all text nodes (within element)
        let iter = document.createNodeIterator(elem, NodeFilter.SHOW_TEXT);
        let textnode;

        // iterate through all text nodes
        while (textnode = iter.nextNode()) {
            // skip if parent is link to avoid nesting links
            if (textnode.parentNode.tagName != 'A') {
                // split text (e.g. ['My ticket is #', '123456', '. Thank you.'])
                let arr = textnode.nodeValue.split(ticketregex);
                for (let i = 0; i < arr.length; i++) {
                    let a;
                    if (ticketregex.test(arr[i])){
                        // if ticket number (and != current ticket) -> create a element
                        a = document.createElement('a');
                        a.href = '/WorkOrder.do?woMode=viewWO&woID=' + arr[i];
                        if (openLinksInNewTab) a.target = '_blank';
                        a.innerText = arr[i];
                    } else {
                        // else -> create text node
                        a = document.createTextNode(arr[i]);
                    }
                    // insert replacement nodes
                    textnode.parentNode.insertBefore(a, textnode);
                }
                // remove original text node
                textnode.parentNode.removeChild(textnode);
            }

        }
    }
}



// SVG Embed
// Embedding SVG can be done in many ways - here it's done by inserting the svg element into the html. This way, text can be selected and copied.
function embedSVG(){
    if (document.querySelector('a[download^=Screenshot_]') && document.getElementById('desc-content').innerText.match(/\[IK_SupportMail\]\s*$/) && !document.getElementById('ik_screenshot')) {

        if (logLevel > 0) console.time('embedSVG_all');
        if (logLevel > 1) console.time('embedSVG_prepare');

        // get screenshot attachment url
        let url = document.querySelector('a[download^=Screenshot_]').href;

        // prepare localized error messages just in case
        let embeddingErrorMsg;
        if (lang == 0) embeddingErrorMsg = 'Nachträgliches Einbetten des Screenshots fehlgeschlagen. Stattdessen den Anhang öffnen.'
        else embeddingErrorMsg = 'Dynamic embedding of the screenshot failed. Open the attachment instead.';

        // create new ik_screenshot container
        let section = document.createElement('template');
        section.innerHTML = '<div id="desc-ik_screenshot" class="atp-container-target atp-container m0 p10 clearfix"><p class="sb">Screenshot</p><hr class="mt0"><div id="ik_screenshot"></div></div>';
        section = section.content.firstChild;
        // add at new position
        let att = document.getElementById('desc-attachments');
        att.parentNode.insertBefore(section, att);


        // until SVG file is replaced, show 'Loading...'
        document.getElementById('ik_screenshot').innerHTML = 'Loading...';

        if (logLevel > 1) console.time('embedSVG_download');

        // fetch SVG file and insert contents into the container
        fetch(url).then(
            (response) => {
                response.text()
                    .then(
                    (text) => {
                        if (logLevel > 1) console.timeEnd('embedSVG_download');
                        if (logLevel > 1) console.time('embedSVG_insert');

                        // use a sandboxed iframe to avoid XSS
                        document.getElementById('ik_screenshot').innerHTML = '<iframe id="ik_screenshot_iframe" sandbox style="border: 1px solid #bbb; width: 100%; height: 400px; resize: vertical"></iframe>';
                        document.getElementById('ik_screenshot_iframe').srcdoc = text;

                        if (logLevel > 1) console.timeEnd('embedSVG_insert');
                        if (logLevel > 0) console.timeEnd('embedSVG_all');

                    }
                )
                    .catch(
                    (e) => {
                        if (logLevel > 1) console.timeEnd('embedSVG_download');

                        console.log('Response failed: ' + e.message);
                        document.getElementById('ik_screenshot').innerHTML = '[UserScript Tab Title] ' + embeddingErrorMsg + ' (Response, ' + e.message + ')';

                        if (logLevel > 1) console.timeEnd('embedSVG_insert');
                        if (logLevel > 0) console.timeEnd('embedSVG_all');
                    }
                )
            }
        )
            .catch(
            (e) => {
                if (logLevel > 1) console.timeEnd('embedSVG_download');

                console.log('Fetch failed: ' + e.message);
                document.getElementById('ik_screenshot').innerHTML = '[UserScript Tab Title] ' + embeddingErrorMsg + ' (Fetch, ' + e.message + ')';

                if (logLevel > 1) console.timeEnd('embedSVG_insert');
                if (logLevel > 0) console.timeEnd('embedSVG_all');
            }
        );
        if (logLevel > 1) console.timeEnd('embedSVG_prepare');
    }
}

// Hauptfunktion / Core Loop
function update(){
    // if tab is not open (page is not visible) do not waste computing power and skip the update
    // except if tab title has not been set yet (if the tab was opened in the background) or if the tab was just hidden (see event handler)
    if (document.visibilityState != 'visible' && ticketlinksuccess){
        return;
    }

    if (logLevel > 0) console.time('update');

    // embed SVG if available
    if (doEmbedSVG) embedSVG();

    if (logLevel > 0) console.timeEnd('update');
}



console.log('[UserScript Tab Title] Injected at \'' + window.location + '\'');


// make sure update runs once after a page is hidden
addEventListener('visibilitychange', event => {
    if (document.visibilityState == 'hidden') {
        ticketlinksuccess = false;
    }
});


// run first update
update();

// schedule to run every x ms
if (updateinterval > 50) window.setInterval(update, updateinterval);

// add ticket links
if (doAddTicketLinks && ticketlinksinterval > 50) window.setInterval(addTicketLinks, ticketlinksinterval);
