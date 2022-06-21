// ==UserScript==
// @name              Tab Titles for ticket system ManageEngine ServiceDesk Plus
// @name:de-DE        Tabtitel für Ticketsystem ManageEngine ServiceDesk Plus
// @description       Find the right tab instantly: Useful title with the ticket no and title or with information you choose
// @description:de-DE Endlich sofort den richtigen Tab finden: Nützlicher Titel mit Ticketnr. und Betreff oder selbst gewählten Informationen 
// @namespace         jandunker
// @version           1.4
// @match             http://servicedesk/*
// @match             http://servicedesk.hgroup.intra/*
// @match             https://servicedesk/*
// @match             https://servicedesk.hgroup.intra/*
// @exclude           */framework/html/blank.html
// @noframes
// @license           GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright         2020-2022, eckende (https://openuserjs.org/users/eckende)
// @require           https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_registerMenuCommand
// @updateURL         https://openuserjs.org/meta/eckende/Tab_Titles_for_ticket_system_ManageEngine_ServiceDesk_Plus.meta.js
// @downloadURL       https://openuserjs.org/install/eckende/Tab_Titles_for_ticket_system_ManageEngine_ServiceDesk_Plus.user.js
// @icon              data:image/gif;base64,R0lGODlhEAAQAHAAACH5BAkAAAMALAAAAAAQABAAgQAAAHSK///TdAAAAAI7nI85wIDtDhAiGhCCXXRj/XRP5nXNQp4TJX4ZuLKOS3KVmjK2V0smlGuYTKkUS0bLHYEvHUS3eCqmiAIAOw==
// @icon64            data:image/gif;base64,R0lGODlhQABAAHAAACH5BAkAAAMALAAAAABAAEAAgQAAAHSK///TdAAAAAL/nI+py+0Po5y02ouzPqD7DwJUSHpjSZ4oqK7m5LJw/Ep0HX3Czu9fGwgKg79Zp9cr2jzDoTLnQfKekE9TSH3opIKsw3oNeBtb6ZgBvp4XZeRakW6+E+0krsoMzxH16V2bp/b3FcW1xxEoN0hWaLaIluj0yNboNgkXiXVJV2nXAaS3ydfpdzPaESZ2I4J4ZLh6CpC6ymrQ5wPbKhtqqsvVlWubSRQ8cPtr+ambyqypLOyKjPwU1yz4bEwq7VmbjWo9i3O8DYxdDe7cPb5NPYzeHk2erO4ODg8g/2peb32f77jvGzpFAfHpoxErXC9oBgEiXMbrIcNftBJGjBGLYrFzoMQWems4D9S1bnjicRNJkCQgk6VUEhKYsoVGbCV3jZR5kBZHVTpBzOzpDqjPnEAVCgXJTahRoT+PlVgalERTbeVAQIUpKcRUlrhCXLWZ0qlUoljT7SzxbxqJgc3QpiULlm1Yqmmfyr1I95/du3O16l0ll1ZdwGwF/70ReNVgxIVT6BIK6ajLj5ApSY58FHNlTJctZ94AOrTo0aRLmz5NoQAAOw==
// @author            Jan Dunker
// ==/UserScript==

// global variable declaration
var tabtitlesucess = false;
var ticketlinksuccess = false;
var uiretrycounter = 0;

// This script uses the GM_config library by sizzle to manage user settings
GM_config.init(
    {
        'id': 'ttmesdp',
        'title': 'Einstellungen',
        'events':
        {
            'save': function (){
                // automatically close dialog when saving
                GM_config.close();

                // ask if settings should be applied now (page reload required)
                if (window.confirm('Soll der Tab jetzt neu geladen werden, um die Einstellungen zu übernehmen?')) {
                    location.reload();
                }
            },
            'open': function (doc, window, frame){
                // add shadow to dialog and change border color
                GM_config.frame.style.border = '1px solid #888';
                GM_config.frame.style.boxShadow = '0px 4px 15px 10px rgba(0, 0, 0, 0.3)';

                // change button labels
                doc.getElementById('ttmesdp_saveBtn').textContent = 'Speichern';
                doc.getElementById('ttmesdp_closeBtn').textContent = 'Abbrechen';
                doc.getElementById('ttmesdp_resetLink').textContent = 'Felder zurücksetzen';

                // give focus to settings dialog
                window.focus();

                // prevent scrolling
                document.body.style.overflow = 'hidden';
            },
            'close': function (){
                // re-enable scrolling
                document.body.style.overflow = 'auto';
            }
        },
        'css': '#ttmesdp_header:before {content: ""; display: block; background: url("data:image/gif;base64,R0lGODlhEAAQAHAAACH5BAkAAAMALAAAAAAQABAAgQAAAHSK///TdAAAAAI7nI85wIDtDhAiGhCCXXRj/XRP5nXNQp4TJX4ZuLKOS3KVmjK2V0smlGuYTKkUS0bLHYEvHUS3eCqmiAIAOw==") no-repeat; background-size: contain; width: 32px; height: 32px; image-rendering: crisp-edges; float: left; margin: 2px 15px 0 0; } #ttmesdp_buttons_holder .reset_holder.block {display: inline;}  #ttmesdp_buttons_holder .saveclose_buttons, #ttmesdp_resetLink {margin: 10px 10px 10px 0px;} .section_header_holder, #ttmesdp #ttmesdp_header.config_header {margin: 15px} #ttmesdp_buttons_holder {position: sticky; bottom: 0px; width: 100%; background-color: #fffe; border-top: 1px solid #888; box-shadow: 0px -3px 5px 0px rgba(0, 0, 0, 0.3);} #ttmesdp_wrapper, body#ttmesdp {margin: 0px} .section_header center { margin-top: 10px; } .section_desc { margin-bottom: 10px; } #ttmesdp .center {text-align: left; padding: 5px; } body#ttmesdp * {font-family: Segoe UI, Arial, sans-serif; } #ttmesdp label.field_label { display: block; margin: 5px; font-size: 13px; font-weight: normal;} input { margin: 2px 5px 10px; font-size: 13px; font-weight: normal;} input[type=text]{padding: 3px; width: 90%;}',
        'fields':
        {
            'lang': {
                'label': 'Sprache der Tabtitel / Language of tab titles',
                'section': ['Tabtitel allgemein','Automatisch einen passenden Tabtitel setzen. Mehr Infos in den Tooltips.'],
                'type': 'radio',
                'options': ['Auto', 'DE', 'EN'],
                'default': 'Auto',
                'title': 'Sprache der Tabtitel. Bitte beachten, dass die Sprache der Texte, die aus der Seite stammen, ggf. abweichen kann.\n\
Language of the tab titles. Please note that the language of the texts coming from the site may differ.\n\
\u26A0\uFE0F Unfortunately the settings dialog is not translated yet. Please refer to the script source code starting around line 450.'
            },
            'updateinterval':
            {
                'label': 'Aktualisierungsintervall des Titels (in ms)',
                'type': 'int',
                'default': 1000,
                'min': 50,
                'title': 'Desto niedriger die Zahl, desto häufiger wird der Tabtitel aktualisiert. Bei schlechter Performance sollte der Wert hochgesetzt werden.\nWenn der Tab sich im Hintergrund befindet, wird die Tabtitelaktualisierung pausiert, um die Systemressourcen zu schonen.'
            },
            'prefix':
            {
                'label': 'Allgemeines Präfix (vor allen Titeln)',
                'type': 'text',
                'default': '',
                'title': 'steht immer vor dem generierten Tabtitel'
            },
            'suffix':
            {
                'label': 'Allgemeines Suffix (nach allen Titeln)',
                'type': 'text',
                'default': ' - Ticketsystem',
                'title': 'steht immer hinter dem generierten Tabtitel'
            },
            'fallbacktitle':
            {
                'label': 'Titel im Fall, dass keine spezifische Seite erkannt werden kann',
                'type': 'text',
                'default': 'Ticketsystem',
                'title': 'Anhand der URL wird für fast alle Seiten ein Titel ermittelt. Sollte es mal Keinen geben, wird stattdessen diese Einstellung als Titel verwendet.'
            },
            'emptyfield':
            {
                'label': 'Wert, der im Tabtitel benutzt wird, wenn ein %platzhalter% nicht gefunden werden kann',
                'type': 'text',
                'default': '[...]',
                'title': 'Sollte beispielweise die Ticketnummer nicht auf der Seite gefunden werden können, wird der Platzhalter %ticket_id% stattdessen durch diesen Wert ersetzt.'
            },
            'ticketstring':
            {
                'label': 'Ticketdetails',
                'section': ['Tabtitel für Detailseiten','Hier kann der Tabtitel für bestimmte Seiten mit Platzhaltern gestaltet werden. Die verfügbaren Platzhalter sind im Tooltip zu finden.'],
                'type': 'text',
                'default': '%ticket_id% %ticket_title% - %ticket_requester%',
                'title': '%ticket_id% - Ticketnummer\n\
%ticket_status% - Ticketstatus (Open/Closed/On Hold)\n\
%ticket_title% - Betreff\n%ticket_technician%  Techniker/Bearbeiter\n\
%ticket_group% - Gruppe\n\
%ticket_requester% - Anforderer\n\
%ticket_site% - Standort\n\
%ticket_category% - Kategorie\n\
%ticket_subcategory% - Unterkategorie\n\
%ticket_element% - Element'
            },
            'taskstring':
            {
                'label': 'Aufgabendetails',
                'type': 'text',
                'default': '%ticket_id% Task %task_title% (Task ID: %task_id%)',
                'title': '%ticket_id% - Ticketnummer\n\
%ticket_status% - Ticketstatus (Open/Closed/On Hold)\n\
%task_status% - Aufgabenstatus\n\
%task_title% - Aufgabentitel\n\
%task_technician% - Techniker/Bearbeiter\n\
%task_group% - Gruppe\n\
%task_createdby% - Aufgabenersteller\n\
%task_type% - Aufgabentyp'
            },
            'problemstring':
            {
                'label': 'Problemdetails',
                'type': 'text',
                'default': 'Problem %problem_id% %problem_title% - %problem_requester%',
                'title': '%problem_id% - Problemnummer\n\
%problem_status% - Problemstatus\n\
%problem_title% - Problemtitel\n\
%problem_priority% - Priorität\n\
%problem_technician% - Techniker/Bearbeitern\n\
%problem_group% - Gruppe\n\
%problem_requester% - Anforderer\n\
%problem_category% - Kategorie\n\
%problem_subcategory% - Unterkategorie\n\
%problem_element% - Element\n\
%problem_site% - Standort'
            },
            'ticketliststring':
            {
                'label': 'Ticketübersicht',
                'section': ['Tabtitel für Übersichts-/Listenseiten','Hier kann der Tabtitel für bestimmte Seiten mit Platzhaltern gestaltet werden. Die verfügbaren Platzhalter sind im Tooltip zu finden.'],
                'type': 'text',
                'default': '%ticketlist_group%',
                'title': '%ticketlist_group% - Gruppe'
            },
            'taskliststring':
            {
                'label': 'Aufgabenübersicht',
                'type': 'text',
                'default': '%tasklist_filter%',
                'title': '%tasklist_filter% - Aufgabenfilter'
            },
            'problemliststring':
            {
                'label': 'Problemübersicht',
                'type': 'text',
                'default': '%problemlist_filter%',
                'title': '%problemlist_filter% - Problemfilter'
            },


            'doAddTicketLinks':
            {
                'label': 'Funktion aktivieren',
                'section': ['Klickbare Ticketnummern', 'Wenn aktiviert, werden die Ticketseiten nach anderen Ticketnummern durchsucht und verlinkt.'],
                'type': 'checkbox',
                'default': true,
                'title': 'Durchsucht werden Ticketbetreff, Ticketbeschreibung und Besprechungen (Notizen und E-Mails) auf Ticketseiten.'
            },
            'openLinksInNewTab':
            {
                'label': 'Ticketlinks in neuem Tab öffnen',
                'type': 'checkbox',
                'default': true,
                'title': 'Bei deaktivierter Einstellung wird der Link im aktuellen Tab geöffnet.'
            },

            'ticketregex':
            {
                'label': 'Regex zur Erkennung von Ticketnummern',
                'type': 'text',
                'default': '\\b([4-6]\\d{5})\\b',
                'title': 'Um die Ticketnummern zu erkennen, werden reguläre Ausdrücke verwendet.\n\
In der Standardeinstellung werden sechsstellige Nummern erkannt, die mit 4, 5 oder 6 anfangen.\n\
\\b(\\d{6})\\b - alle sechsstelligen Nummern erkennen\n\
\\b(\\d{4})\\b - alle vierstelligen Nummern erkennen\n\
Hilfreiches Tool: regexr.com'
            },
            'ticketlinksinterval':
            {
                'label': 'Aktualisierungsintervall für klickbare Ticketnummern (in ms)',
                'type': 'int',
                'default': 5000,
                'min': 0,
                'title': 'Desto niedriger die Zahl, desto häufiger werden die Texte nach Ticketnummern durchsucht. Bei schlechter Performance sollte der Wert hochgesetzt werden.\nWenn der Tab sich im Hintergrund befindet, wird die Funktion pausiert, um die Systemressourcen zu schonen.',
            },
            'doEmbedSVG' : {
                'label': 'Funktion aktivieren',
                'section': ['SVG einbetten', '[Firmenspezifisch] Wenn aktiviert, wird bei Hilfebutton-Tickets der SVG-Screenshot-Anhang in die Seite eingebettet.'],
                'type': 'checkbox',
                'default': true,
                'title': 'Der Screenshot erscheint unterhalb der Ticketbeschreibung.'
            },
            'hidenavbaricon':
            {
                'label': 'Icon oben links in der Navigationsleiste ausblenden',
                'section': ['UI Tweaks', 'Wenn aktiviert, werden kleine Anpassungen an der Benutzeroberfläche vorgenommen.'],
                'type': 'checkbox',
                'default': true,
                'title': 'Beim Neuladen des Tabs kann es einen Moment dauern, bis das Element versteckt ist.'
            },
            'hidenavbartext':
            {
                'label': 'Text oben links in der Navigationsleiste ausblenden',
                'type': 'checkbox',
                'default': true,
                'title': 'Beim Neuladen des Tabs kann es einen Moment dauern, bis das Element versteckt ist.'
            },

            'hidetopbar':
            {
                'label': 'Weiße Leiste unterhalb der Navigationsleiste ausblenden. Der Notizblockbutton wird dann in der Navigationsleiste neben dem Suchbutton angezeigt.',
                'type': 'checkbox',
                'default': false,
                'title': 'Beim Neuladen des Tabs kann es einen Moment dauern, bis das Element versteckt ist.'
            },
            'hidedcdownmsg' : {
                'label': 'Fehlermeldung "DC-Dienst ausgefallen. Bitte wenden Sie sich an Ihren Administrator" ausblenden.',
                'type': 'checkbox',
                'default': true,
                'title': 'Beim Neuladen des Tabs kann es einen Moment dauern, bis das Element versteckt ist.'
            },
            'uicustomizinginterval':
            {
                'label': 'Bei Fehlschlag erneut versuchen nach (in ms)',
                'type': 'int',
                'default': 500,
                'min': 0,
                'title': 'Klappt das Umsetzen der UI-Anpassungen nicht, wird der Vorgang ein paar Mal wiederholt. Meldungen dazu können in den Entwicklertools in der Konsole eingesehen werden.'
            },
            'logLevel': {
                'label': 'Performancemessungen in Konsole ausgeben',
                'section': ['Erweiterte Konfiguration', 'Weiterführende Einstellungen.'],
                'type': 'radio',
                'options': ['aus', 'einfach', 'detailliert'],
                'default': 'aus',
                'title': 'Wie lange dauert XY? Wenn aktiviert, können die Zeitmessungen in den Entwicklertools in der Konsole eingesehen werden.'
            },
            'defaulttabtitle':
            {
                'label': 'Produktname/systemseitiger Standardtitel (nicht ändern, wenn es funktioniert)',
                'type': 'text',
                'size': 0,
                'default': 'ManageEngine ServiceDesk Plus',
                'title': 'Der Titel, der ohne das Skript angezeigt werden würde. Auch zu finden in der Variable sdp_app.PRODUCT_NAME. Der Wert wird intern benötigt und muss nur verändert werden, wenn er nicht passt.'
            }
        }
    });




// INFO ZU BENUTZERDEFINIERTEN FUNKTIONEN
// information about custom functions
//
// Wenn das Skript nach Änderungen der Einstellungen oder benutzerdefinierten Funktionen nicht läuft, bitte einen Syntaxcheck durchführen (https://esprima.org/demo/validate.html).
// If this script doesn't run after editing settings / custom functions, please perform a syntax check (https://esprima.org/demo/validate.html).
// Benutzerdefinierte Funktionen sollen nicht arbeitsintensiv sein, da sie bei jeder Aktualisierung (Standard: ein Mal pro Sekunde) und bei jeder Platzhalterersetzung berechnet werden.
// Do not make custom functions computing heavy as they run on every update (default: once per second) and as many times as a placeholder is substituted.
//
// Bei benutzerdefinierten Funktionen sollten folgende Funktionen verwendet werden, um Fehler abzufangen und Texte rückzugeben:
// The following functions should be used because they do error handling and return strings:
// getById('id')             // document.getElementById('id')
// querySel('CSS selector')  // similar to document.querySelector('CSS selector')
// getByDataName('name')     // data-name='name'


// DETAILSEITEN
// detail pages

/* Seitentitel für Tickets
   Page title for tickets

%ticket_id%          Ticketnummer
%ticket_status%      Ticketstatus (Open/Closed/On Hold)
%ticket_title%       Betreff
%ticket_technician%  Techniker/Bearbeiter
%ticket_group%       Gruppe
%ticket_requester%   Anforderer
%ticket_site%        Standort
%ticket_category%    Kategorie
%ticket_subcategory% Unterkategorie
%ticket_element%     Element
%custom1%            Eigene Funktion 1
...                  
%custom5%            Eigene Funktion 5
*/
const ticketstring = GM_config.get('ticketstring'); //"%ticket_id% %ticket_title% - %ticket_requester%";

// Benutzerdefinierte Funktionen
// custom functions
function getFieldTicket_custom1(){let now = new Date(); return now.getHours().toString() + ":" + (now.getMinutes().toString()<10 ? "0" & now.getMinutes().toString() : now.getMinutes().toString());}
function getFieldTicket_custom2(){return "";}
function getFieldTicket_custom3(){return "";}
function getFieldTicket_custom4(){return "";}
function getFieldTicket_custom5(){return "";}


/* Seitentitel für Aufgaben
   Page title for tasks

%ticket_id%          Ticketnummer
%ticket_status%      Ticketstatus (Open/Closed/On Hold)
%task_status%        Aufgabenstatus
%task_title%         Aufgabentitel
%task_technician%    Techniker/Bearbeiter
%task_group%         Gruppe
%task_createdby%     Aufgabenersteller
%task_type%          Aufgabentyp
%custom1%            Eigene Funktion 1
...                  
%custom5%            Eigene Funktion 5
*/
const taskstring = GM_config.get('taskstring'); //"%ticket_id% Task %task_title% (Task ID: %task_id%)";

// Benutzerdefinierte Funktionen
// custom functions
function getFieldTask_custom1(){return "";}
function getFieldTask_custom2(){return "";}
function getFieldTask_custom3(){return "";}
function getFieldTask_custom4(){return "";}
function getFieldTask_custom5(){return "";}


/* Seitentitel für Probleme
   Page title for problems

%problem_id%           Problemnummer
%problem_status%       Problemstatus
%problem_title%        Problemtitel
%problem_priority%     Priorität
%problem_technician%   Techniker/Bearbeiter
%problem_group%        Gruppe
%problem_requester%    Anforderer
%problem_category%     Kategorie
%problem_subcategory%  Unterkategorie
%problem_element%      Element
%problem_site%         Standort
%custom1%              Eigene Funktion 1
...
%custom5%              Eigene Funktion 5
*/
const problemstring = GM_config.get('problemstring'); //"Problem %problem_id% %problem_title% - %problem_requester%";

// Benutzerdefinierte Funktionen
// custom functions
function getFieldProblem_custom1(){return "";}
function getFieldProblem_custom2(){return "";}
function getFieldProblem_custom3(){return "";}
function getFieldProblem_custom4(){return "";}
function getFieldProblem_custom5(){return "";}


// LISTEN/ÜBERSICHTSSEITEN
// lists


/* Seitentitel für die Ticketübersicht
   Page title for the ticket list

%ticketlist_group%   Gruppe
%custom1%            Eigene Funktion 1
...                  
%custom5%            Eigene Funktion 5
*/
const ticketliststring = GM_config.get('ticketliststring'); //"%ticketlist_group%";

// Benutzerdefinierte Funktionen
// custom functions
function getFieldTicketList_custom1(){return "";}
function getFieldTicketList_custom2(){return "";}
function getFieldTicketList_custom3(){return "";}
function getFieldTicketList_custom4(){return "";}
function getFieldTicketList_custom5(){return "";}


/* Seitentitel für die Aufgabenübersicht
   Page title for the task list

%tasklist_filter%    Aufgabenfilter
%custom1%            Eigene Funktion 1
...
%custom5%            Eigene Funktion 5
*/
const taskliststring = GM_config.get('taskliststring'); //"%tasklist_filter%";

// Benutzerdefinierte Funktionen
// custom functions
function getFieldTaskList_custom1(){return "";}
function getFieldTaskList_custom2(){return "";}
function getFieldTaskList_custom3(){return "";}
function getFieldTaskList_custom4(){return "";}
function getFieldTaskList_custom5(){return "";}


/* Seitentitel für die Problemübersicht
   Page title for the problem list

%problemlist_filter% Aufgabenfilter
%custom1%            Eigene Funktion 1
...
%custom5%            Eigene Funktion 5
*/
const problemliststring = GM_config.get('problemliststring'); //"%problemlist_filter%";

// Benutzerdefinierte Funktionen
// custom functions
function getFieldProblemList_custom1(){return "";}
function getFieldProblemList_custom2(){return "";}
function getFieldProblemList_custom3(){return "";}
function getFieldProblemList_custom4(){return "";}
function getFieldProblemList_custom5(){return "";}



// Language
// 0: de
// 1: en
var lang = GM_config.get('lang');

if (lang == 'DE') lang = 0;
else if (lang == 'EN') lang = 1;
else if (navigator.language == "de") lang = 0; else lang = 1;

// debug mode
var logLevel = GM_config.get('logLevel');

if (logLevel == 'einfach') logLevel = 1;
else if (logLevel == 'detailliert') logLevel = 2;
else logLevel = 0;

// Prefix (before every title)
const prefix = GM_config.get('prefix');

// Suffix (after every title)
const suffix = GM_config.get('suffix');

// Empty field string
const emptyfield = GM_config.get('emptyfield');

// Update interval for the title in ms
// The smaller the number, the more often and more bad for performance
const updateinterval = GM_config.get('updateinterval'); // 1 Sekunde

// Fallback title, in case nothing is defined
const fallbacktitle = GM_config.get('fallbacktitle');

// Product name/system-sided default title
const defaulttabtitle = GM_config.get('defaulttabtitle');

// clickable ticket no. links
//
// If activated, the texts on ticket pages are searched for ticket no.. Results get replaced by links.
const doAddTicketLinks = GM_config.get('doAddTicketLinks');

// Open ticket links in new tabs
const openLinksInNewTab = GM_config.get('openLinksInNewTab');

// The search runs every x ms:
const ticketlinksinterval = GM_config.get('ticketlinksinterval');

// Ticket no. detection
const ticketregex = new RegExp(GM_config.get('ticketregex'), 'g');

// embed svg screenshot attachment
// /!\ This is a company specific feature. You can disable this if you work for a different employer.
const doEmbedSVG = GM_config.get('doEmbedSVG');

// ui customizing
// retry after x milliseconds
const uicustomizinginterval = GM_config.get('uicustomizinginterval')

// Hide left icon in navbar
const hidenavbaricon = GM_config.get('hidenavbaricon')

// Hide left text in navbar
const hidenavbartext = GM_config.get('hidenavbartext')

// Hide white bar under navbar
const hidetopbar = GM_config.get('hidetopbar')

// hide dc-service down alert
const hidedcdownmsg = GM_config.get('hidedcdownmsg')




// getElementById with handling
function getById(id){
    var elem = document.getElementById(id);
    if (elem) {
        if (elem.innerText.trim() != "") return elem.innerText.trim();
        else return elem.title.trim();
    }
    else {
        console.log('[UserScript Tab Titles] "' + id + '" not found, returning "' + emptyfield + '" instead. Try document.getElementById("' + id + '")');
        return emptyfield;
    }
}

// get using data-name  with handling
function getByDataName(name){
    var elem = null;
    let data = document.querySelectorAll("[data-name]");
    for (let i=0; i<data.length; i++) {
        if(name == data[i].dataset.name) {
            elem = data[i];
            break;
        }
    }
    if (elem) {
        if (elem.innerText.trim() != "") return elem.innerText.trim();
        else return elem.title.trim();
    }
    else {
        console.log('[UserScript Tab Titles] "' + name + '" not found, returning "' + emptyfield + '" instead.');
        return emptyfield;
    }
}

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

// Funktionen Ticket
// lazy functions
function getFieldTicket_ticket_id() {return getById("requestId");}                      //Ticketnummer
function getFieldTicket_ticket_status() {return getById("status-right-panel");}         //Ticketstatus (Open/Closed/On Hold)
function getFieldTicket_ticket_title() {return getById("req_subject");}                 //Betreff
function getFieldTicket_ticket_technician() {return getById("technician-right-panel");} //Techniker/Bearbeiter
function getFieldTicket_ticket_group() {return getById("group-right-panel");}           //Gruppe
function getFieldTicket_ticket_requester() {return getById("userName");}                //Anforderer
function getFieldTicket_ticket_priority() {return getById("priority-right-panel");}     //Priorität
function getFieldTicket_ticket_site() {return getByDataName("site");}                   //Standort
function getFieldTicket_ticket_category() {return getByDataName("category");}           //Kategorie
function getFieldTicket_ticket_subcategory() {return getByDataName("subcategory");}     //Unterkategorie
function getFieldTicket_ticket_element() {return getByDataName("item");}                //Element

function titleTicket(){
    setTitle(ticketstring.replace("%ticket_id%",getFieldTicket_ticket_id).replace("%ticket_title%",getFieldTicket_ticket_title).replace("%ticket_technician%",getFieldTicket_ticket_technician).replace("%ticket_site%",getFieldTicket_ticket_site).replace("%ticket_group%",getFieldTicket_ticket_group).replace("%ticket_status%",getFieldTicket_ticket_status).replace("%ticket_requester%",getFieldTicket_ticket_requester).replace("%ticket_category%",getFieldTicket_ticket_category).replace("%ticket_subcategory%",getFieldTicket_ticket_subcategory).replace("%ticket_element%",getFieldTicket_ticket_element).replace("%ticket_priority%",getFieldTicket_ticket_priority).replace("%custom1%",getFieldTicket_custom1).replace("%custom2%",getFieldTicket_custom2).replace("%custom3%",getFieldTicket_custom3).replace("%custom4%",getFieldTicket_custom4).replace("%custom5%",getFieldTicket_custom5));
    // add button to actionsbar if it's not already there
    //if (!document.getElementById('ttmesdp_opensettingsactionsbarbtn')) registerOpenSettingsActionsBar();
}

// Funktionen Task
// lazy functions
function getFieldTask_ticket_id() {return getById("TaskEntityID").substring(2);}  //Ticketnummer
function getFieldTask_ticket_status() {return getById("TaskEntityStatus");}       //Ticketstatus (Open/Closed/On Hold)
function getFieldTask_task_id() {return getById("Hidden_TASKID");}                //Aufgabennummer
function getFieldTask_task_status() {return getById("Details_STATUSID");}         //Aufgabenstatus
function getFieldTask_task_title() {return getById("Task_TITLE");}                //Aufgabentitel
function getFieldTask_task_technician() {return getById("Details_OWNERID");}      //Techniker/Bearbeiter
function getFieldTask_task_group() {return getById("Details_GROUPID");}           //Gruppe
function getFieldTask_task_createdby() {return getById("Details_CREATEDBY");}     //Aufgabenersteller
function getFieldTask_task_type() {return getById("Details_taskType");}           //Aufgabentyp

function titleTask(){
    setTitle(taskstring.replace("%ticket_id%",getFieldTask_ticket_id).replace("%ticket_status%",getFieldTask_ticket_status).replace("%task_id%",getFieldTask_task_id).replace("%task_title%",getFieldTask_task_title).replace("%task_createdby%",getFieldTask_task_createdby).replace("%task_group%",getFieldTask_task_group).replace("%task_status%",getFieldTask_task_status).replace("%task_technician%",getFieldTask_task_technician).replace("%task_type%",getFieldTask_task_type).replace("%custom1%",getFieldTask_custom1).replace("%custom2%",getFieldTask_custom2).replace("%custom3%",getFieldTask_custom3).replace("%custom4%",getFieldTask_custom4).replace("%custom5%",getFieldTask_custom5));
}

// Funktionen Problem
// lazy functions
function getFieldProblem_problem_id() {return getById("problemid_ph");}               //Problemnummer
function getFieldProblem_problem_status() {return getById("STATUSID_CUR");}           //Problemstatus
function getFieldProblem_problem_title() {return getById("problemTitle");}            //Problemtitel
function getFieldProblem_problem_priority() {return getById("PRIORITYID_CUR");}       //Priorität
function getFieldProblem_problem_technician() {return getById("OWNERID_CUR");}        //Techniker/Bearbeiter
function getFieldProblem_problem_group() {return getById("QUEUEID_CUR");}             //Gruppe
function getFieldProblem_problem_requester() {return querySel(".reqtr-name");}         //Anforderer
function getFieldProblem_problem_category() {return getById("CATEGORYID_CUR");}       //Kategorie
function getFieldProblem_problem_subcategory() {return getById("SUBCATEGORYID_CUR");} //Unterkategorie
function getFieldProblem_problem_element() {return getById("ITEMID_CUR");}            //Element
function getFieldProblem_problem_site() {return getById("SITEID_CUR");}               //Standort

function titleProblem(){
    setTitle(problemstring.replace("%problem_id%",getFieldProblem_problem_id).replace("%problem_status%",getFieldProblem_problem_status).replace("%problem_title%",getFieldProblem_problem_title).replace("%problem_priority%",getFieldProblem_problem_priority).replace("%problem_technician%",getFieldProblem_problem_technician).replace("%problem_group%",getFieldProblem_problem_group).replace("%problem_requester%",getFieldProblem_problem_requester).replace("%problem_category%",getFieldProblem_problem_category).replace("%problem_subcategory%",getFieldProblem_problem_subcategory).replace("%problem_element%",getFieldProblem_problem_element).replace("%problem_site%",getFieldProblem_problem_site).replace("%custom1%",getFieldProblem_custom1).replace("%custom2%",getFieldProblem_custom2).replace("%custom3%",getFieldProblem_custom3).replace("%custom4%",getFieldProblem_custom4).replace("%custom5%",getFieldProblem_custom5));
}


//Funktionen Ticketlist
function titleTicketlist(){
    setTitle(ticketliststring.replace("%ticketlist_group%",getById("listview_btn")).replace("%custom1%",getFieldTicketList_custom1).replace("%custom2%",getFieldTicketList_custom2).replace("%custom3%",getFieldTicketList_custom3).replace("%custom4%",getFieldTicketList_custom4).replace("%custom5%",getFieldTicketList_custom5));
}

// Funktionen Tasklist
function titleTasklist(){
    setTitle(taskliststring.replace("%tasklist_filter%",getById("selected_tasklist_filter")).replace("%custom1%",getFieldTaskList_custom1).replace("%custom2%",getFieldTaskList_custom2).replace("%custom3%",getFieldTaskList_custom3).replace("%custom4%",getFieldTaskList_custom4).replace("%custom5%",getFieldTaskList_custom5));
}

// Funktionen Problemlist
function titleProblemlist(){
    setTitle(problemliststring.replace("%problemlist_filter%",getById("ProListHdr")).replace("%custom1%",getFieldProblemList_custom1).replace("%custom2%",getFieldProblemList_custom2).replace("%custom3%",getFieldProblemList_custom3).replace("%custom4%",getFieldProblemList_custom4).replace("%custom5%",getFieldProblemList_custom5));
}

// Titel mit Präfix und Suffix setzen
function setTitle(str1, str2){
    tabtitlesucess = true;
    if (str2) {
        if (lang == 0) window.document.title = prefix + str1 + suffix;
        else window.document.title = prefix + str2 + suffix;
    }
    else {
        window.document.title = prefix + str1 + suffix;
    }
}

// set tab title
function tabTitles(){
    if (logLevel > 0) console.time('tabTitles');

    let url = location.href;
    if (url.match(/^https?:\/\/[\w\d.-]*\/WorkOrder\.do\?(?:.*&)?woMode=viewWO/)){ //Ticket
        titleTicket();

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/TaskDetails\.cc/)){ //Task
        if (document.getElementById("Task_TITLE")) titleTask();
        else titleTasklist();

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/WOListView\.do/)){ //Ticketübersicht
        titleTicketlist();

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/SearchN\.do/)){ //Suche -> List/Ticket
        if (document.getElementById("requestId")) titleTicket();
        else if (document.getElementById("Task_TITLE")) titleTask(); //Just in case
        else titleTicketlist();

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/WOAdvListView\.do/)){
        setTitle("Erweiterte Ticketsuche","Advanced Ticket Search");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/WOAdvancedSearch\.do/)){
        setTitle("Erweiterte Ticketsuche","Advanced Ticket Search");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/HomePage\.do/)){
        setTitle("Home");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/DashBoard\.do/)){
        setTitle("Dashboard");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/Problems\.cc/)){
        titleProblemlist();

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/ProblemDetails\.cc/)){
        titleProblem();

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/SolutionsHome\.do/)){
        setTitle("Lösungen","Solutions");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/Templates\.do/)){ //Ticket-Vorlagen
        setTitle("Vorlagen","Templates");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/ShowTaskTemplateList\.cc/)){
        setTitle("Vorlage auswählen","Select Template");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/SDArchiveWOListView\.do/)){
        setTitle("Archivierte Anfragen","Archived Tickets");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/ReplyTemplate\.do/)){
        setTitle("Antwortvorlagen","Reply Templates");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/AddNewProblem\.cc/)){
        setTitle("Neues Problem erstellen","Create New Problem");

    } else if (url.match(/https?:\/\/[\w\d.-]*\/WorkOrder\.do\?woMode=newWO/)){
        setTitle("Neue Anforderung erstellen","Create New Request");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/TaskDefAction\.do/)){ //Neue Aufgabe erstellen
        setTitle("Neue Aufgabe erstellen","Create New Task");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/AddNewProblem\.cc/)){
        setTitle("Neues Problem erstellen","Create New Problem");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/AddSolution\.do\\?.*submitaction=viewsolution/)){
        setTitle("Lösung " + getById('solution_title'),"Solution " + getById('solution_title'));

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/AddSolution\.do\\?.*submitaction=editsolution/)){
        setTitle("Lösung bearbeiten","Edit Solution");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/AddSolution\.do/)){
        setTitle("Lösung hinzufügen","Add Solution");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/showTopicDetails\.do/)){
        setTitle("Lösungen","Solutions");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/ListRequests\.do/)){
        setTitle(getById("defaultTitle"));

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/CustomFilter\.do/)){
        setTitle("Benutzerdefinierte Ansichten", "Custom Views");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/SearchRequester\.do/)){
        setTitle("Anforderer auswählen","Select Requester");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/(?:AllReminders\.do|jsp\/Reminder\.jsp|ReminderDisplay\.do)/)){
        setTitle("Erinnerungen","Reminders");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/(?:Announce|AnnounceShow)\.do/)){
        setTitle("Ankündigungen","Announcements");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/calendar\//)){
        setTitle("Kalender","Calendar");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/TopicAction\.do/)){
        setTitle("Themen verwalten","Manage Topics");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/ImportXLSSolution\.do/)){
        setTitle("Lösung importieren","Import Solution");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/AssociateCIList\.do/)){
        setTitle("Assets auswählen","Select Assets");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/SiteLookup\.do/)){
        setTitle("Standort auswählen","Select Site");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/ShowTaskTemplateList\.cc/)){
        setTitle("Vorlage auswählen","Select Template");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/FilteredProblems\.cc/)){
        setTitle("Problem auswählen","Select Problem");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/UserAssets\.do/)){
        setTitle("Benutzer Assets","User Assets");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/SendNotification\.cc/)){
        setTitle("Benachrichtigung senden", "Send Notification");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/ShowTaskTemplateList\.cc/)){
        setTitle("Vorlage auswählen","Select Template");

    } else if (document.title === defaulttabtitle) { //Fallback nur Default
        setTitle(fallbacktitle);

    } else if (document.title.includes(defaulttabtitle + " - ")){ //Fallback Default mit Titel
        setTitle(document.title.replace(defaulttabtitle + " - ", ""));

    }
    if (logLevel > 0) console.timeEnd('tabTitles');
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
        console.log('[UserScript Tab Titles] Adding ticket links failed: "' + selector + '" not found. Try document.querySelectprAll("' + selector + '")');
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
                    if (ticketregex.test(arr[i]) && arr[i] != getFieldTicket_ticket_id()){
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


// UI customizing
function customizeUI(){
    try {
        // hide navbar text if enabled
        if (hidenavbartext) document.getElementById("headinstanceicon").nextElementSibling.style.display = 'none';

        // hide navbar icon if enabled
        if (hidenavbaricon) document.getElementById("headinstanceicon").style.display = 'none';

        // hide topbar if enabled
        if (hidetopbar) {
            document.getElementById("top-subheader").style.display = 'none';
            // create extra note button in the top right because the other one is now missing
            let elem = document.createElement("li");
            elem.innerHTML = '<a id="custom-sticky-notes" onclick="$sticky_notes.load()" tab-name="Notizblock"><span><svg class="header-menu-icons" viewBox="0 0 24 24"> <g id="g33"> <rect style="stroke-width:0.8px;stroke-miterlimit:10" x="-9.4238186" y="18.841644" height="11.238" transform="rotate(-45)" id="rect27" /> <rect style="stroke-width:1.33094px;stroke-miterlimit:10" x="6.1109867" y="3.6965828" width="0.801" height="16.606834" id="rect29" /> <rect style="stroke-width:1.33094px;stroke-miterlimit:10" x="17.088013" y="3.6965828" width="0.801" height="16.606834" id="rect29-6" /> <rect style="stroke-width:1.12086px;stroke-miterlimit:10" x="6.1109862" y="19.502417" width="11.778027" height="0.801" id="rect31" /> <rect style="stroke-width:1.12086px;stroke-miterlimit:10" x="6.1109867" y="3.6965828" width="11.778027" height="0.801" id="rect31-7" /> <rect style="stroke-width:1.12086px;stroke-miterlimit:10" x="6.1109867" y="6.4593182" width="11.778027" height="0.801" id="rect31-7-2" /> </g></svg></span></a>';
            let menu = document.querySelector(".header-icon-list");
            menu.insertBefore(elem, menu.firstChild);
        }
        // hide dc service down message if enabled
        if (hidedcdownmsg) {
            if (document.getElementById('dc_down_msg')) {
                document.getElementById('dc_down_msg').style.display = 'none';
            }
        }
    } catch {
        uiretrycounter++;

        if (uiretrycounter < 5) {
            // try again later
            console.log('[UserScript Tab Title] Failed to fully customize UI. Retrying in ' + uicustomizinginterval + ' ms');
            if (uicustomizinginterval > 50) window.setTimeout(customizeUI, uicustomizinginterval);
        } else {
            console.log('[UserScript Tab Title] Failed to fully customize UI. Not retrying anymore, retry limit reached.');
        }
    }
}

// SVG Embed
// Embedding SVG can be done in many ways - here it's done by inserting the svg element into the html. This way, text can be selected and copied.
function embedSVG(){
    if (document.getElementById('ik_screenshot') && document.getElementById('ik_screenshot').children.length > 0 && document.getElementById('ik_screenshot').children[0].tagName == 'P' && document.querySelector('a[download^=Screenshot_]')) {

        if (logLevel > 0) console.time('embedSVG_all');
        if (logLevel > 1) console.time('embedSVG_prepare');

        // get screenshot attachment url
        let url = document.querySelector('a[download^=Screenshot_]').href;

        // prepare localized error messages just in case
        let embeddingErrorMsg;
        if (lang == 0) embeddingErrorMsg = 'Nachträgliches Einbetten des Screenshots fehlgeschlagen. Stattdessen den Anhang öffnen.'
        else embeddingErrorMsg = 'Dynamic embedding of the screenshot failed. Open the attachment instead.';

        // we move the container (div) from the mail body to a separate section (for looks)
        // remove container at current position
        document.getElementById('ik_screenshot').parentNode.removeChild(document.getElementById('ik_screenshot'));

        // create new ik_screenshot container
        let section = document.createElement('template');
        section.innerHTML = '<div id="desc-ik_screenshot" class="atp-container-target atp-container m0 p10 clearfix"><p class="sb">Screenshot</p><hr class="mt0"><div id="ik_screenshot"></div></div>';
        section = section.content.firstChild;
        // add at new position
        let att = document.getElementById('desc-attachments');
        att.parentNode.insertBefore(section, att);


        // until SVG file is replaced, show 'Loading...'
        document.getElementById('ik_screenshot').innerHTML = 'Loading...';
        //document.getElementById('ik_screenshot').innerHTML = '<object type="image/svg+xml" data="' + url + '"><img src="' + url + '" /></object>';

        if (logLevel > 1) console.time('embedSVG_download');
        // fetch SVG file and insert contents into the container
        fetch(url).then(
            (response) => {
                response.text()
                    .then(
                    (text) => {
                        if (logLevel > 1) console.timeEnd('embedSVG_download');
                        if (logLevel > 1) console.time('embedSVG_insert');

                        document.getElementById('ik_screenshot').innerHTML = text;

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
    if (document.visibilityState != 'visible' && tabtitlesucess){
        return;
    }

    if (logLevel > 0) console.time('update');

    // set tab titles
    tabTitles();

    // embed SVG if available
    if (doEmbedSVG) embedSVG();


    if (logLevel > 0) console.timeEnd('update');
}

function openSettings(){
    GM_config.open();
}

function registerOpenSettings(){
    if (logLevel > 1) console.time('registerOpenSettings');

    GM_registerMenuCommand('Einstellungen', openSettings, 'e');
    registerOpenSettingsProfile();
    registerOpenSettingsTopbar();

    if (logLevel > 1) console.timeEnd('registerOpenSettings');
}
function registerOpenSettingsProfile(){
    let a = document.getElementById('Pro-Personalize');
    if (a) {
        let b = document.createElement('li');
        a.parentElement.parentElement.appendChild(b);
        b.innerHTML = '<a href="javascript:void(0);" id="ttmesdp_opensettingsprofilebtn" name="Tabtitel-Einstellungen" class="p10"><span class="icon-md ml10" style="background-repeat: no-repeat; background-image: url(data:image/gif;base64,R0lGODlhEAAQAHAAACH5BAkAAAMALAAAAAAQABAAgQAAAHSK///TdAAAAAI7nI85wIDtDhAiGhCCXXRj/XRP5nXNQp4TJX4ZuLKOS3KVmjK2V0smlGuYTKkUS0bLHYEvHUS3eCqmiAIAOw==);"></span><span class="ml15">Tabtitel-Einstellungen</span></a>';
        b.firstChild.addEventListener('click', openSettings);
    }
}

// currently unused
function registerOpenSettingsActionsBar(){
    let a = document.getElementById('actionsBar');
    if (a) {
        let c = a.firstElementChild;
        if (c) {
            let b = document.createElement('a');
            c.appendChild(b);
            b.href="javascript:void(0);";
            b.id="ttmesdp_opensettingsactionsbarbtn";
            b.name="Tabtitel-Einstellungen";
            b.title="Tabtitel-Einstellungen";
            b.className="btn btn-default btn-xs fl mr10";
            b.style="top: 3px";
            b.role = 'button';
            b.innerHTML = '<span class="common-sprite icon-sm" style="top: 3px; background-repeat: no-repeat; background-image: url(data:image/gif;base64,R0lGODlhEAAQAHAAACH5BAkAAAMALAAAAAAQABAAgQAAAHSK///TdAAAAAI7nI85wIDtDhAiGhCCXXRj/XRP5nXNQp4TJX4ZuLKOS3KVmjK2V0smlGuYTKkUS0bLHYEvHUS3eCqmiAIAOw==);"></span>';
            b.addEventListener('click', openSettings);

        }
    }
}

function registerOpenSettingsTopbar(){
    //skip if this is not going to be shown anyways
    if (hidetopbar) return;

    let a = document.getElementById('subheader-show-menu');
    if (a) {
        let b = document.createElement('div');
        a.appendChild(b);
        b.id = 'ttmesdp_opensettingstopbarbtn';
        b.className = 'vmiddle disp-ib bs-noconflict';
        b.innerHTML = '<span aria-label="Tabtitel-Einstellungen" class="vmiddle cur-ptr" rel="uitooltip" title="Tabtitel-Einstellungen" style="border: solid #c8c7c8 1px; width: 24px; height: 23px; background-position: 3px 3px; display: inline-block; background-repeat: no-repeat; background-image: url(data:image/gif;base64,R0lGODlhEAAQAHAAACH5BAkAAAMALAAAAAAQABAAgQAAAHSK///TdAAAAAI7nI85wIDtDhAiGhCCXXRj/XRP5nXNQp4TJX4ZuLKOS3KVmjK2V0smlGuYTKkUS0bLHYEvHUS3eCqmiAIAOw==);"></span>';
        b.addEventListener('click', openSettings);
    }
}

console.log('[UserScript Tab Title] Injected at \'' + window.location + '\'');

// make settings available in several places
registerOpenSettings();

// make sure update runs once after a page is hidden
addEventListener('visibilitychange', event => {
    if (document.visibilityState == 'hidden') {
        tabtitlesucess = false;
        ticketlinksuccess = false;
    }
});

// customize ui
customizeUI();

// run first update
update();

// schedule to run every x ms
if (updateinterval > 50) window.setInterval(update, updateinterval);

// add ticket links
if (doAddTicketLinks && ticketlinksinterval > 50) window.setInterval(addTicketLinks, ticketlinksinterval);





