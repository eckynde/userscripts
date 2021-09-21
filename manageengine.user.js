// ==UserScript==
// @name     Tab Titles for ticket system ManageEngine ServiceDesk Plus
// @name:de-DE Tabtitel für Ticketsystem ManageEngine ServiceDesk Plus
// @description Find the right tab instantly: Useful title with the ticket no and title or with information you choose
// @description:de-DE Endlich sofort den richtigen Tab finden: Nützlicher Titel mit Ticketnr. und Betreff oder selbst gewählten Informationen 
// @namespace jandunker
// @version  1.2
// @include  http://servicedesk/*
// @include  http://servicedesk.hgroup.intra/*
// @include  https://servicedesk/*
// @include  https://servicedesk.hgroup.intra/*
// @license  GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright 2020, eckende (https://openuserjs.org/users/eckende)
// @updateURL https://openuserjs.org/meta/eckende/Tab_Titles_for_ticket_system_ManageEngine_ServiceDesk_Plus.meta.js
// @downloadURL https://openuserjs.org/install/eckende/Tab_Titles_for_ticket_system_ManageEngine_ServiceDesk_Plus.user.js
// @grant    none
// @author   Jan Dunker
// ==/UserScript==

// OpenUser.js can't handle this url
// @icon     http://servicedesk/images/favicon.ico

// SETTINGS
// EINSTELLUNGEN

// If this script doesn't run after editing settings / custom functions, please perform a syntax check (https://esprima.org/demo/validate.html).
// Wenn das Skript nach Änderungen der Einstellungen oder benutzerdefinierten Funktionen nicht läuft, bitte einen Syntaxcheck durchführen (https://esprima.org/demo/validate.html).

// Do not make custom functions computing heavy as they run on every update (default: once per second) and as many times as a placeholder is substituted.
// 

// Language
// Sprache
// 0: de
// 1: en
var lang;
if (navigator.language == "de") lang = 0; else lang = 1;
//lang = 0;
//lang = 1;

// Prefix (before every title)
// Präfix vor allen Titeln
var prefix = "";

// Suffix (after every title)
// Suffix nach allen Titeln
var suffix = "";
//var suffix = " - Ticketsystem";
//var suffix = " - Servicedesk";

// Empty field string
var emptyfield = "";
//var emptyfield = "[...]";

/* Page title for tickets
   Seitentitel für Tickets
  
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
var ticketstring = "%ticket_id% %ticket_title% - %ticket_requester%";

function getFieldTicket_custom1(){let now = new Date(); return now.getHours().toString() + ":" + (now.getMinutes().toString()<10 ? "0" & now.getMinutes().toString() : now.getMinutes().toString());}
function getFieldTicket_custom2(){return "";}
function getFieldTicket_custom3(){return "";}
function getFieldTicket_custom4(){return "";}
function getFieldTicket_custom5(){return "";}


/* Page title for tasks
   Seitentitel für Aufgaben
   
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
var taskstring = "%ticket_id% Task %task_title% (Task ID: %task_id%)";

function getFieldTask_custom1(){return "";}
function getFieldTask_custom2(){return "";}
function getFieldTask_custom3(){return "";}
function getFieldTask_custom4(){return "";}
function getFieldTask_custom5(){return "";}


/* Page title for the ticket list
   Seitentitel für die Ticketübersicht
   
%ticketlist_group%   Gruppe
%custom1%            Eigene Funktion 1
...                  
%custom5%            Eigene Funktion 5
*/
var ticketliststring = "%ticketlist_group%";

function getFieldTicketList_custom1(){return "";}
function getFieldTicketList_custom2(){return "";}
function getFieldTicketList_custom3(){return "";}
function getFieldTicketList_custom4(){return "";}
function getFieldTicketList_custom5(){return "";}


/* Page title for the task list
   Seitentitel für die Aufgabenübersicht

%tasklist_filter%    Aufgabenfilter
%custom1%            Eigene Funktion 1
...                  
%custom5%            Eigene Funktion 5
*/
var taskliststring = "%tasklist_filter%";

function getFieldTaskList_custom1(){return "";}
function getFieldTaskList_custom2(){return "";}
function getFieldTaskList_custom3(){return "";}
function getFieldTaskList_custom4(){return "";}
function getFieldTaskList_custom5(){return "";}


// Update interval for the title in ms
// Aktualisierungsintervall des Titels in ms

var updateinterval = 1000;


// Fallback title, in case nothing is defined
// Rückfalltitel, wenn nichts definiert ist

//var fallbacktitle = "Ticketing System";
var fallbacktitle = "Ticketsystem";


// Product name/system-sided default title
// Produktname/systemseitiger Standardtitel

var defaulttabtitle = "ManageEngine ServiceDesk Plus";


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


//Funktionen Ticket
//lazy functions
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

//Funktionen Task
//lazy functions
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

//Funktionen Ticketlist
function titleTicketlist(){
  setTitle(ticketliststring.replace("%ticketlist_group%",getById("listview_btn")).replace("%custom1%",getFieldTicketList_custom1).replace("%custom2%",getFieldTicketList_custom2).replace("%custom3%",getFieldTicketList_custom3).replace("%custom4%",getFieldTicketList_custom4).replace("%custom5%",getFieldTicketList_custom5));
}

//Funktionen Tasklist
function titleTasklist(){
  setTitle(taskliststring.replace("%tasklist_filter%",getById("selected_tasklist_filter")).replace("%custom1%",getFieldTaskList_custom1).replace("%custom2%",getFieldTaskList_custom2).replace("%custom3%",getFieldTaskList_custom3).replace("%custom4%",getFieldTaskList_custom4).replace("%custom5%",getFieldTaskList_custom5));
}

//Titel mit Präfix und Suffix setzen
function setTitle(str1, str2){
  if (str2) {
		if (lang == 0) window.document.title = prefix + str1 + suffix;
    else window.document.title = prefix + str2 + suffix;
	}
	else {
    window.document.title = prefix + str1 + suffix;
  }
}

//Hauptfunktion / Core Loop
function update(){
  //console.log("[UserScript Tab Title] Executing...");
  var url = location.href;
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
    setTitle("Probleme","Problems");
  
  } else if (url.match(/^https?:\/\/[\w\d.-]*\/SolutionsHome\.do/)){
    setTitle("Lösungen","Solutions");
  
  } else if (url.match(/^https?:\/\/[\w\d.-]*\/Templates\.do/)){ //Ticket-Vorlagen
    setTitle("Vorlagen","Templates");
  
  } else if (url.match(/^https?:\/\/[\w\d.-]*\/ListViewFilter\.do/)){
    setTitle("Ansichten verwalten","Manage Views");
  
  } else if (url.match(/^https?:\/\/[\w\d.-]*\/AddNewProblem\.cc/)){
    setTitle("Neues Problem erstellen","Create New Problem");
  
  } else if (url.match(/^https?:\/\/[\w\d.-]*\/WorkOrder\.do\?woMode=newWO/)){
    setTitle("Neue Anforderung erstellen","Create New Ticket");
  
  } else if (url.match(/^https?:\/\/[\w\d.-]*\/TaskDefAction\.do/)){ //Neue Aufgabe erstellen
    setTitle("Neue Aufgabe erstellen","Create New Task");
  
  } else if (url.match(/^https?:\/\/[\w\d.-]*\/AddNewProblem\.cc/)){
    setTitle("Neues Problem erstellen","Create New Problem");
  
  } else if (url.match(/^https?:\/\/[\w\d.-]*\/AddSolution\.do/)){
    setTitle("Lösung hinzufügen","Add Solution");
  
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
  
  } else if (url.match(/^https?:\/\/[\w\d.-]*\/UserAssets\.do/)){
    setTitle("Benutzer Assets","User Assets");
  
  } else if (url.match(/^https?:\/\/[\w\d.-]*\/ShowTaskTemplateList\.cc/)){
    setTitle("Vorlage auswählen","Select Template");
  
  } else if (document.title === defaulttabtitle) { //Fallback nur Default
    setTitle(fallbacktitle);
    
  } else if (document.title.includes(defaulttabtitle + " - ")){ //Fallback Default mit Titel
  	setTitle(document.title.replace(defaulttabtitle + " - ", ""));
    
  }
  //console.log("[UserScript Tab Titles] Done.");
}
update();
if (updateinterval > 50) window.setInterval(update, updateinterval);
