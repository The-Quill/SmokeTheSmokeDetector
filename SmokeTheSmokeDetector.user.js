// ==UserScript==
// @name SmokeTheSmokeDetector
// @description No more smokey spam
// @version 0.0.1
// @match *://chat.stackexchange.com/rooms/*
// @match *://chat.stackoverflow.com/rooms/*
// @match *://chat.meta.stackexchange.com/rooms/*
// @author The-Quill
// @downloadURL  https://github.com/The-Quill/SmokeTheSmokeDetector/raw/master/SmokeTheSmokeDetector.user.js
// @updateURL https://github.com/The-Quill/SmokeTheSmokeDetector/raw/master/SmokeTheSmokeDetector.user.js
// @run-at document-end
// ==/UserScript==

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.substr(position || 0, searchString.length) === searchString;
    };
}
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        }
        return this.indexOf(search, start) !== -1;
    };
}
var SmokeyIdsBasedOnSite = {
    "chat.meta.stackexchange.com": 266345,
    "chat.stackexchange.com": 120914,
    "chat.stackoverflow.com": 3735529
};
var SmokeyUserId = SmokeyIdsBasedOnSite[document.location.host];
function innerText(element, selector){
    if (!selector) return "";
    var foundElement = element.querySelector(selector);
    if (!foundElement || !foundElement.innerText) return "";
    return foundElement.innerText;
}
function hideSmokeyMessage(message){
    var messageBlock = message.parentNode.parentNode;
    if (messageBlock.classList.contains('user-' + SmokeyUserId)){
        var text = innerText(message, '.content');
        if (!text.includes('fault.') && !text.includes('privileged user')){
            var parentNode = message.parentNode;
            parentNode.removeChild(message);
            if (parentNode.children.length === 0){
                messageBlock.style.display = "none";
            }
        }
        return;
    }
    var messageText = innerText(message, '.content');
    var isSmokeyResponse = innerText(message, '.mention') === '@SmokeDetector';
    if (messageText.startsWith('sd') || (messageText.startsWith('!!/') && messageText !== '!!/blame' && messageText !== '!!/amiprivileged') || isSmokeyResponse){
        messageBlock.parentNode.removeChild(messageBlock);
        return;
    }
}
function nodeInsertionListener(){
    var messages = document.querySelectorAll(".monologue .message");
    Array.prototype.slice.apply(messages).forEach(hideSmokeyMessage);
}
window.addEventListener("DOMNodeInserted", nodeInsertionListener);
