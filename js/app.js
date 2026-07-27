/* ==========================================
   English Buddy
   Version 1.0
   Main JavaScript File
==========================================*/

// ------------------------------
// Global Variables
// ------------------------------

const progressFill = document.getElementById("progressFill");
const progressValue = document.getElementById("progressValue");

const darkBtn = document.getElementById("darkBtn");

const hindiSentence = document.getElementById("hindiSentence");
const englishSentence = document.getElementById("englishSentence");

const searchInput = document.getElementById("searchInput");

const todayDate = document.getElementById("todayDate");

// ------------------------------
// Daily Lessons
// ------------------------------

const lessons = [

{
hindi:"नमस्ते",
english:"Hello",
pronunciation:"हेलो"
},

{
hindi:"आप कैसे हैं?",
english:"How are you?",
pronunciation:"हाउ आर यू"
},

{
hindi:"मेरा नाम राहुल है",
english:"My name is Rahul",
pronunciation:"माय नेम इज़ राहुल"
},

{
hindi:"धन्यवाद",
english:"Thank you",
pronunciation:"थैंक यू"
},

{
hindi:"शुभ प्रभात",
english:"Good Morning",
pronunciation:"गुड मॉर्निंग"
},

{
hindi:"फिर मिलेंगे",
english:"See you again",
pronunciation:"सी यू अगेन"
}

];

// ------------------------------
// Today's Date
// ------------------------------

todayDate.innerHTML =
new Date().toDateString();

// ------------------------------
// Splash Screen
// ------------------------------

setTimeout(() => {

document.getElementById("splash").style.display="none";

document.getElementById("app").style.display="block";

},2000);

// ------------------------------
// Daily Sentence
// ------------------------------

function loadDailySentence(){

let random=Math.floor(Math.random()*lessons.length);

hindiSentence.innerHTML=lessons[random].hindi;

englishSentence.innerHTML=lessons[random].english;

}

loadDailySentence();

// ------------------------------
// English Speech
// ------------------------------

document.getElementById("speakEnglish")
.addEventListener("click",()=>{

let speech=new SpeechSynthesisUtterance(
englishSentence.innerHTML
);

speech.lang="en-US";

speech.rate=0.9;

speechSynthesis.speak(speech);

});

// ------------------------------
// Hindi Speech
// ------------------------------

document.getElementById("speakHindi")
.addEventListener("click",()=>{

let speech=new SpeechSynthesisUtterance(
hindiSentence.innerHTML
);

speech.lang="hi-IN";

speech.rate=0.9;

speechSynthesis.speak(speech);

});

// ------------------------------
// Dark Mode
// ------------------------------

darkBtn.addEventListener("click",()=>{

document.body.classList.toggle("dark");

localStorage.setItem(
"theme",
document.body.classList.contains("dark")
);

});

// Load Theme

if(localStorage.getItem("theme")=="true"){

document.body.classList.add("dark");

}

// ------------------------------
// Progress
// ------------------------------

let progress=
localStorage.getItem("progress") || 10;

updateProgress();

function updateProgress(){

progressFill.style.width=
progress+"%";

progressValue.innerHTML=
progress+"%";

}

// ------------------------------
// Increase Progress
// ------------------------------

function increaseProgress(){

if(progress<100){

progress++;

localStorage.setItem(
"progress",
progress
);

updateProgress();

}

}

// ------------------------------
// Favourite
// ------------------------------

document
.getElementById("saveFavorite")
.addEventListener("click",()=>{

let favourite={

hindi:hindiSentence.innerHTML,

english:englishSentence.innerHTML

};

let list=
JSON.parse(localStorage.getItem("fav"))
|| [];

list.push(favourite);

localStorage.setItem(
"fav",
JSON.stringify(list)
);

alert("Saved to Favourite ⭐");

});

// ------------------------------
// Search
// ------------------------------

searchInput.addEventListener("keyup",()=>{

let value=
searchInput.value.toLowerCase();

let result=
lessons.find(item=>

item.hindi.includes(value)

||

item.english.toLowerCase().includes(value)

);

if(result){

hindiSentence.innerHTML=result.hindi;

englishSentence.innerHTML=result.english;

}

});

// ------------------------------
// Start Learning
// ------------------------------

document
.getElementById("startLearning")
.addEventListener("click",()=>{

increaseProgress();

alert("Lesson Started 📚");

});

// ------------------------------
// Practice
// ------------------------------

document
.getElementById("practiceNow")
.addEventListener("click",()=>{

alert("Voice Practice Coming Soon 🎤");

});

// ------------------------------
// Service Worker
// ------------------------------

if("serviceWorker" in navigator){

window.addEventListener("load",()=>{

navigator.serviceWorker.register("./service-worker.js")
.then(() => {

console.log("Service Worker Registered Successfully");

})
.catch(err => {

console.log(err);

});

}
/* ==========================================
   Lesson Engine
========================================== */

let lessonData = [];
let vocabularyData = {};

// Load Lessons
async function loadLessons() {
    try {
        const response = await fetch("data/lessons.json");
        lessonData = await response.json();

        loadRandomLesson();

    } catch (error) {
        console.log("Unable to load lessons", error);
    }
}

// Load Vocabulary
async function loadVocabulary() {

    try {

        const response = await fetch("data/vocabulary.json");

        vocabularyData = await response.json();

    } catch (error) {

        console.log(error);

    }

}

// Random Lesson

function loadRandomLesson(){

    if(lessonData.length===0) return;

    let random=Math.floor(Math.random()*lessonData.length);

    let lesson=lessonData[random];

    document.getElementById("hindiSentence").innerHTML=lesson.hindi;

    document.getElementById("englishSentence").innerHTML=lesson.english;

}

// Search

searchInput.addEventListener("keyup",()=>{

let keyword=searchInput.value.toLowerCase();

if(keyword.length<1){

loadRandomLesson();

return;

}

let result=lessonData.find(item=>

item.hindi.includes(keyword)

||

item.english.toLowerCase().includes(keyword)

);

if(result){

document.getElementById("hindiSentence").innerHTML=result.hindi;

document.getElementById("englishSentence").innerHTML=result.english;

}

});

// Start App

loadLessons();

loadVocabulary();
   document
.getElementById("nextLesson")
.addEventListener("click",()=>{

loadRandomLesson();

increaseProgress();

});
// ==========================
// Conversation Engine
// ==========================

let conversations = [];

async function loadConversations(){

    const response = await fetch("data/conversations.json");

    conversations = await response.json();

}

function showConversation(index){

    const conversation = conversations[index];

    alert(
        conversation.title +
        "\n\n" +
        conversation.conversation
        .map(c => c.hindi + "\n" + c.english)
        .join("\n\n")
    );

}

loadConversations();                        
/* ============================
   Quiz Engine
============================ */

let quizData = [];
let currentQuestion = 0;
let score = 0;

async function loadQuiz() {
    const response = await fetch("data/quiz.json");
    quizData = await response.json();
}

function startQuiz() {

    currentQuestion = 0;
    score = 0;

    showQuestion();
}

function showQuestion() {

    if (currentQuestion >= quizData.length) {

    updateStreak();

    alert(
        "🎉 Quiz Completed!\n\n" +
        "Score: " + score + "/" + quizData.length +
        "\nXP: " + xp +
        "\nBadge: " + getBadge() +
        "\n🔥 Streak: " + streak
    );

    return;

}

    const q = quizData[currentQuestion];

    let answer = prompt(

        q.question +

        "\n\n1. " + q.options[0] +

        "\n2. " + q.options[1] +

        "\n3. " + q.options[2] +

        "\n4. " + q.options[3] +

        "\n\nEnter Option Number (1-4)"

    );

    if (
    q.options[Number(answer) - 1] === q.answer
) {

    score++;

    addXP(10);

    alert("✅ Correct! +10 XP");

    }
   else {

        alert("❌ Wrong!\nCorrect Answer : " + q.answer);

    }

    currentQuestion++;

    showQuestion();

}

loadQuiz();

  /* =====================================
   XP & Achievement System
===================================== */

let xp = Number(localStorage.getItem("xp")) || 0;
let streak = Number(localStorage.getItem("streak")) || 1;

// Add XP
function addXP(points) {

    xp += points;

    localStorage.setItem("xp", xp);

    updateDashboard();

}

// Daily Streak

function updateStreak() {

    streak++;

    localStorage.setItem("streak", streak);

    updateDashboard();

}

// Badge

function getBadge() {

    if (xp >= 600) return "🏆 Expert";

    if (xp >= 300) return "🥇 Advanced";

    if (xp >= 100) return "🥈 Intermediate";

    return "🥉 Beginner";

}

// Dashboard

function updateDashboard() {

    document.getElementById("xpValue").innerHTML = xp;

    document.getElementById("streakValue").innerHTML = streak;

    document.getElementById("badgeValue").innerHTML = getBadge();

}

window.onload = () => {

    updateDashboard();

} 

/* ==========================================
   Voice Practice Engine
========================================== */

let recognition;

if ("webkitSpeechRecognition" in window) {

recognition = new webkitSpeechRecognition();

recognition.lang = "en-US";

recognition.continuous = false;

recognition.interimResults = false;

recognition.onresult = function(event){

let speech = event.results[0][0].transcript;

document.getElementById("speechOutput").innerHTML = speech;

checkSpeech(speech);

};

recognition.onerror = function(){

document.getElementById("voiceResult").innerHTML =
"❌ Unable to recognize speech.";

};

}else{

alert("Speech Recognition is not supported on this browser.");

}

document
.getElementById("startVoice")
.addEventListener("click",()=>{

if(recognition){

recognition.start();

}

});

document
.getElementById("stopVoice")
.addEventListener("click",()=>{

if(recognition){

recognition.stop();

}

});

function checkSpeech(userSpeech){

const target = document
.getElementById("targetSentence")
.innerText
.toLowerCase();

if(userSpeech.toLowerCase()==target){

document.getElementById("voiceResult").innerHTML =
"✅ Excellent! Perfect pronunciation.";

addXP(20);

}else{

document.getElementById("voiceResult").innerHTML =
"🙂 Good try! Please speak again.";

}

}

/* ==================================
   Translation Practice
================================== */

let currentTranslation = null;

function newTranslationQuestion(){

if(lessonData.length===0) return;

let random=Math.floor(Math.random()*lessonData.length);

currentTranslation=lessonData[random];

const mode=document
.getElementById("practiceMode")
.value;

if(mode==="hi-en"){

document
.getElementById("translationQuestion")
.innerHTML=currentTranslation.hindi;

}else{

document
.getElementById("translationQuestion")
.innerHTML=currentTranslation.english;

}

document
.getElementById("translationResult")
.innerHTML="";

document
.getElementById("translationInput")
.value="";

}

document
.getElementById("checkTranslation")
.addEventListener("click",()=>{

const mode=document
.getElementById("practiceMode")
.value;

const answer=document
.getElementById("translationInput")
.value
.trim()
.toLowerCase();

let correct=false;

if(mode==="hi-en"){

correct=
answer===currentTranslation.english.toLowerCase();

}else{

correct=
answer===currentTranslation.hindi;

}

if(correct){

document
.getElementById("translationResult")
.innerHTML=
"✅ Correct! +15 XP";

addXP(15);

}else{

document
.getElementById("translationResult")
.innerHTML=
"❌ Correct Answer:<br><br><b>"
+
(mode==="hi-en"
?currentTranslation.english
:currentTranslation.hindi)
+
"</b>";

}

setTimeout(newTranslationQuestion,2000);

});

document
.getElementById("practiceMode")
.addEventListener("change",newTranslationQuestion);

setTimeout(newTranslationQuestion,1000);
   
 /* ==========================================
   Story Engine
========================================== */

let stories = [];

async function loadStories(){

const response = await fetch("data/stories.json");

stories = await response.json();

showStory();

}

function showStory(){

if(stories.length===0) return;

let random = Math.floor(Math.random()*stories.length);

let story = stories[random];

document.getElementById("storyTitle").innerHTML = story.title;

let html = "";

story.story.forEach(line=>{

html += `
<p>
🇮🇳 ${line.hindi}<br>
🇬🇧 ${line.english}
</p><hr>
`;

});

document.getElementById("storyContent").innerHTML = html;

}

document.getElementById("nextStory")
.addEventListener("click",showStory);

document.getElementById("readStory")
.addEventListener("click",()=>{

let text=document.getElementById("storyContent")
.innerText;

let speech=new SpeechSynthesisUtterance(text);

speech.lang="en-US";

speech.rate=0.8;

speechSynthesis.speak(speech);

addXP(20);

});

loadStories();
   
/* ==========================================
   Flashcard Engine
========================================== */

let flashcards=[];
let currentFlash=0;

async function loadFlashcards(){

const response=await fetch("data/flashcards.json");

flashcards=await response.json();

showFlashcard();

}

function showFlashcard(){

if(flashcards.length===0)return;

const card=flashcards[currentFlash];

flashEmoji.innerHTML=card.emoji;

flashEnglish.innerHTML=card.english;

flashHindi.innerHTML=card.hindi;

flashPronunciation.innerHTML=card.pronunciation;

}

nextCard.onclick=()=>{

currentFlash++;

if(currentFlash>=flashcards.length){

currentFlash=0;

}

showFlashcard();

addXP(2);

}

prevCard.onclick=()=>{

currentFlash--;

if(currentFlash<0){

currentFlash=flashcards.length-1;

}

showFlashcard();

}

speakCard.onclick=()=>{

let speech=new SpeechSynthesisUtterance(

flashEnglish.innerHTML9o

);

speech.lang="en-US";

speech.rate=0.8;

speechSynthesis.speak(speech);

}

loadFlashcards();
/* ==========================================
   Flashcard Engine
========================================== */

let flashcards=[];
let currentFlash=0;

async function loadFlashcards(){

const response=await fetch("data/flashcards.json");

flashcards=await response.json();

showFlashcard();

}

function showFlashcard(){

if(flashcards.length===0)return;

const card=flashcards[currentFlash];

flashEmoji.innerHTML=card.emoji;

flashEnglish.innerHTML=card.english;

flashHindi.innerHTML=card.hindi;

flashPronunciation.innerHTML=card.pronunciation;

}

nextCard.onclick=()=>{

currentFlash++;

if(currentFlash>=flashcards.length){

currentFlash=0;

}

showFlashcard();

addXP(2);

}

prevCard.onclick=()=>{

currentFlash--;

if(currentFlash<0){

currentFlash=flashcards.length-1;

}

showFlashcard();

}

speakCard.onclick=()=>{

let speech=new SpeechSynthesisUtterance(

flashEnglish.innerHTML

);

speech.lang="en-US";

speech.rate=0.8;

speechSynthesis.speak(speech);

}

loadFlashcards();   
   
/* ==========================================
   Daily Learning Challenge
========================================== */

let goal = Number(localStorage.getItem("goal")) || 0;

const words = [
"Apple",
"Teacher",
"School",
"Morning",
"Friend",
"Family",
"Book",
"Water",
"House",
"Market"
];

const sentences = [

"I am learning English every day.",

"Practice makes a person confident.",

"Speak English without fear.",

"Learning one sentence daily is enough.",

"Believe in yourself."

];

function loadDailyChallenge(){

let word=

words[Math.floor(Math.random()*words.length)];

let sentence=

sentences[Math.floor(Math.random()*sentences.length)];

wordDay.innerHTML=word;

sentenceDay.innerHTML=sentence;

updateGoal();

}

function updateGoal(){

goalBar.style.width=goal+"%";

goalValue.innerHTML=goal+"%";

}

completeGoal.onclick=()=>{

if(goal<100){

goal+=10;

localStorage.setItem("goal",goal);

updateGoal();

addXP(5);

}

if(goal>=100){

alert("🎉 Daily Goal Completed!");

}

}

loadDailyChallenge();

function resetDailyGoal(){

const today=new Date().toDateString();

const saved=localStorage.getItem("goalDate");

if(saved!==today){

goal=0;
9localStorage.setItem("goalDate",today);

localStorage.setItem("goal",0);

}

}

resetDailyGoal();
   
