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
                        
