// ==UserScript==
// @name Tab Titles for ticket system ManageEngine ServiceDesk Plus
// @name:de-DE Tabtitel für Ticketsystem ManageEngine ServiceDesk Plus
// @description Find the right tab instantly: Useful title with the ticket no and title or with information you choose
// @description:de-DE Endlich sofort den richtigen Tab finden: Nützlicher Titel mit Ticketnr. und Betreff oder selbst gewählten Informationen 
// @namespace jandunker
// @version  1.3
// @match http://servicedesk/*
// @match http://servicedesk.hgroup.intra/*
// @match https://servicedesk/*
// @match https://servicedesk.hgroup.intra/*
// @exclude */framework/html/blank.html
// @noframes
// @license  GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright 2020, eckende (https://openuserjs.org/users/eckende)
// @updateURL https://openuserjs.org/meta/eckende/Tab_Titles_for_ticket_system_ManageEngine_ServiceDesk_Plus.meta.js
// @downloadURL https://openuserjs.org/install/eckende/Tab_Titles_for_ticket_system_ManageEngine_ServiceDesk_Plus.user.js
// @icon         data:image/gif;base64,R0lGODlhEAAQAHAAACH5BAkAAAMALAAAAAAQABAAgQAAAHSK///TdAAAAAI7nI85wIDtDhAiGhCCXXRj/XRP5nXNQp4TJX4ZuLKOS3KVmjK2V0smlGuYTKkUS0bLHYEvHUS3eCqmiAIAOw==
// @icon64       data:image/gif;base64,R0lGODlhQABAAHAAACH5BAkAAAMALAAAAABAAEAAgQAAAHSK///TdAAAAAL/nI+py+0Po5y02ouzPqD7DwJUSHpjSZ4oqK7m5LJw/Ep0HX3Czu9fGwgKg79Zp9cr2jzDoTLnQfKekE9TSH3opIKsw3oNeBtb6ZgBvp4XZeRakW6+E+0krsoMzxH16V2bp/b3FcW1xxEoN0hWaLaIluj0yNboNgkXiXVJV2nXAaS3ydfpdzPaESZ2I4J4ZLh6CpC6ymrQ5wPbKhtqqsvVlWubSRQ8cPtr+ambyqypLOyKjPwU1yz4bEwq7VmbjWo9i3O8DYxdDe7cPb5NPYzeHk2erO4ODg8g/2peb32f77jvGzpFAfHpoxErXC9oBgEiXMbrIcNftBJGjBGLYrFzoMQWems4D9S1bnjicRNJkCQgk6VUEhKYsoVGbCV3jZR5kBZHVTpBzOzpDqjPnEAVCgXJTahRoT+PlVgalERTbeVAQIUpKcRUlrhCXLWZ0qlUoljT7SzxbxqJgc3QpiULlm1Yqmmfyr1I95/du3O16l0ll1ZdwGwF/70ReNVgxIVT6BIK6ajLj5ApSY58FHNlTJctZ94AOrTo0aRLmz5NoQAAOw==
// @author   Jan Dunker
// ==/UserScript==



// EINSTELLUNGEN
// SETTINGS

// Wenn das Skript nach Änderungen der Einstellungen oder benutzerdefinierten Funktionen nicht läuft, bitte einen Syntaxcheck durchführen (https://esprima.org/demo/validate.html).
// If this script doesn't run after editing settings / custom functions, please perform a syntax check (https://esprima.org/demo/validate.html).


// SPRACHE
// Language
// 0: de
// 1: en
var lang;
if (navigator.language == "de") lang = 0; else lang = 1;
//lang = 0;
//lang = 1;

// DEBUG-MODUS
// debug mode
// In Konsole zusätzliche Meldungen und Performance-Messungen anzeigen
const logLevel = 0;



// TABTITEL
// tab titles

// Der Aufbau der Tabtitel für Tickets/Aufgaben etc. kann unten unter DETAILSEITEN und LISTEN/ÜBERSICHTSSEITEN frei festgelegt werden.
// Sollten die bereitgestellten Platzhalter nicht ausreichen, können bei Bedarf auch eigene Funktionen dafür verwendet werden.
// The tab title for tickets/tasks etc. can be customized down below at detail pages and lists.
// If the provided placeholders don't suffice you can develop your own functions.

// Präfix vor allen Titeln
// Prefix (before every title)
const prefix = "";

// Suffix nach allen Titeln
// Suffix (after every title)
const suffix = "";
//const suffix = " - Ticketsystem";
//const suffix = " - Servicedesk";

// Platzhalter, der im Tabtitel benutzt wird, wenn ein Feld nicht gefunden werden kann.
// Empty field string
const emptyfield = "";
//const emptyfield = "[...]";

// Aktualisierungsintervall des Titels in ms
// Desto geringer, desto häufiger und schlechter für die Performance
// Update interval for the title in ms
// The smaller the number, the more often and more bad for performance
const updateinterval = 1000; // 1 Sekunde

// Rückfalltitel, wenn keine bestimmte Seite erkannt werden kann
// Fallback title, in case nothing is defined
const fallbacktitle = "Ticketsystem";
//const fallbacktitle = "Ticketing System";

// Produktname/systemseitiger Standardtitel
// Product name/system-sided default title
const defaulttabtitle = "ManageEngine ServiceDesk Plus";



// KLICKBARE TICKETNUMMERN
// clickable ticket no. links
//
// Wenn aktiviert, werden die Texte auf Ticketseiten nach Ticketnummern durchsucht. Funde werden durch Links ersetzt.
// If activated, the texts on ticket pages are searched for ticket no.. Results get replaced by links.
const doAddTicketLinks = true;
// const doAddTicketLinks = false;

// Ticketslinks in neuem Tab öffnen
// Open ticket links in new tabs
const openLinksInNewTab = true;

// Diese Suche wird alle x Millisekunden durchgeführt:
// The search runs every x ms:
const ticketlinksinterval = 5000;

// Erkennung/Aufbau der Ticketnummer
// Ticket no. detection
// const ticketregex = /\b(\d{6})\b/g;  // Alle 6-stelligen Nummern
const ticketregex = /\b([4-6]\d{5})\b/g; // 6-stellige Nummern, die mit 4, 5 oder 6 anfangen



// SVG SCREENSHOT ANHANG EINBETTEN
// embed svg screenshot attachment
// /!\ Firmenspezifisches Feature. Kann abgestellt werden, wenn für einen anderen Arbeitgeber gearbeitet wird.
// /!\ This is a company specific feature. You can disable this if you work for a different employer.
const doEmbedSVG = true;
// const doEmbedSVG = false;



// ANPASSUNG DER BENUTZEROBERFLÄCHE
// ui customizing
// retry after x milliseconds
const uicustomizinginterval = 500;

// Text links in Navigationsleiste ausblenden
// Hide left text in navbar
const hidenavbartext = true
//const hidenavbartext = false


// Icon links in Navigationsleiste ausblenden
// Hide left icon in navbar

const hidenavbaricon = true
//const hidenavbaricon = false


// Weiße Leiste unter Navigationsleiste ausblenden
// Hide white bar under navbar

const hidetopbar = true
//const hidetopbar = false




// INFO ZU BENUTZERDEFINIERTEN FUNKTIONEN
// information about custom functions
//
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
const ticketstring = "%ticket_id% %ticket_title% - %ticket_requester%";

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
const taskstring = "%ticket_id% Task %task_title% (Task ID: %task_id%)";

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
const problemstring = "Problem %problem_id% %problem_title% - %problem_requester%";

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
const ticketliststring = "%ticketlist_group%";

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
const taskliststring = "%tasklist_filter%";

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
const problemliststring = "%problemlist_filter%";

// Benutzerdefinierte Funktionen
// custom functions
function getFieldProblemList_custom1(){return "";}
function getFieldProblemList_custom2(){return "";}
function getFieldProblemList_custom3(){return "";}
function getFieldProblemList_custom4(){return "";}
function getFieldProblemList_custom5(){return "";}





// END OF SETTINGS
// ENDE EINSTELLUNGEN

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
        setTitle("Neue Anforderung erstellen","Create New Ticket");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/TaskDefAction\.do/)){ //Neue Aufgabe erstellen
        setTitle("Neue Aufgabe erstellen","Create New Task");

    } else if (url.match(/^https?:\/\/[\w\d.-]*\/AddNewProblem\.cc/)){
        setTitle("Neues Problem erstellen","Create New Problem");

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
    let url = location.href;
    if (url.match(/^https?:\/\/[\w\d.-]*\/WorkOrder\.do\?(?:.*&)?woMode=viewWO/)) {
        addTicketLinksForTicket();
    } else if (url.match(/^https?:\/\/[\w\d.-]*\/SearchN\.do/) && document.getElementById("requestId")) {
        addTicketLinksForTicket();
    }
}

// adding ticket links: where to look/replace on ticket pages
function addTicketLinksForTicket(){
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
        if (hidenavbartext) document.getElementById("headinstanceicon").nextElementSibling.style = "display: none;";

        // hide navbar icon if enabled
        if (hidenavbaricon) document.getElementById("headinstanceicon").style = "display: none;";

        // hide topbar if enabled
        if (hidetopbar) {
            document.getElementById("top-subheader").style = "display: none;";
            // create extra note button in the top right because the other one is now missing
            let elem = document.createElement("li");
            elem.innerHTML = '<a id="custom-sticky-notes" onclick="$sticky_notes.load()" tab-name="Notizblock"><span><svg class="header-menu-icons" viewBox="0 0 24 24"> <g id="g33"> <rect style="stroke-width:0.8px;stroke-miterlimit:10" x="-9.4238186" y="18.841644" height="11.238" transform="rotate(-45)" id="rect27" /> <rect style="stroke-width:1.33094px;stroke-miterlimit:10" x="6.1109867" y="3.6965828" width="0.801" height="16.606834" id="rect29" /> <rect style="stroke-width:1.33094px;stroke-miterlimit:10" x="17.088013" y="3.6965828" width="0.801" height="16.606834" id="rect29-6" /> <rect style="stroke-width:1.12086px;stroke-miterlimit:10" x="6.1109862" y="19.502417" width="11.778027" height="0.801" id="rect31" /> <rect style="stroke-width:1.12086px;stroke-miterlimit:10" x="6.1109867" y="3.6965828" width="11.778027" height="0.801" id="rect31-7" /> <rect style="stroke-width:1.12086px;stroke-miterlimit:10" x="6.1109867" y="6.4593182" width="11.778027" height="0.801" id="rect31-7-2" /> </g></svg></span></a>';
            let menu = document.querySelector(".header-icon-list");
            menu.insertBefore(elem, menu.firstChild);
        }
    } catch {
        console.log('[UserScript Tab Title] Failed to fully customize UI. Retrying in ' + uicustomizinginterval + ' ms');
        // try again later
        if (uicustomizinginterval > 50) window.setTimeout(customizeUI, uicustomizinginterval);
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
    if (document.visibilityState != 'visible'){
        return;
    }

    if (logLevel > 0) console.time('update');

    // set tab titles
    tabTitles();

    // embed SVG if available
    if (doEmbedSVG) embedSVG();

    if (logLevel > 0) console.timeEnd('update');
}


console.log('[UserScript Tab Title] Injected at \'' + window.location + '\'');

// customize ui
customizeUI();

// run first update
update();

// schedule to run every x ms
if (updateinterval > 50) window.setInterval(update, updateinterval);

// add ticket links
if (doAddTicketLinks) window.setInterval(addTicketLinks, ticketlinksinterval);

