const Knowledge = {
    // --- ENGLISH ---
    "science day": "National Science Day is celebrated in India every year on February 28th. It commemorates the discovery of the 'Raman Effect' by the legendary Indian physicist Sir C.V. Raman in 1928. This discovery earned him the Nobel Prize in Physics in 1930.",
    "why we celebrate": "We celebrate National Science Day to spread the message about the importance of science in our daily lives. It aims to encourage the youth to develop a scientific temper and explore how innovation can solve global challenges.",
    "python": "Python is a high-level, interpreted programming language known for its simplicity and readability. It is the most popular choice today for AI and Data Science.",
    "computer": "A computer is a sophisticated electronic device that processes data according to a set of instructions. It performs the Input-Process-Output cycle to provide useful information.",

    // --- HINDI ---
    "विज्ञान दिवस": "राष्ट्रीय विज्ञान दिवस हर साल 28 फरवरी को सर सी.वी. रमन द्वारा 'रमन प्रभाव' की खोज की याद में मनाया जाता है। इसका मुख्य उद्देश्य युवाओं में वैज्ञानिक सोच को बढ़ावा देना है।",
    "क्यों मनाते हैं": "हम विज्ञान दिवस इसलिए मनाते हैं ताकि लोगों के जीवन में विज्ञान के महत्व को समझाया जा सके और नई पीढ़ी को शोध और खोज के लिए प्रेरित किया जा सके।",
    "कंप्यूटर": "कंप्यूटर एक इलेक्ट्रॉनिक उपकरण है जो डेटा को इनपुट के रूप में लेता है, उसे प्रोसेस करता है और उपयोगी जानकारी आउटपुट के रूप में देता है।",
    "नमस्ते": "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?",

    // --- TELUGU ---
    "సైన్స్ డే": "సర్ సి.వి. రామన్ 1928 ఫిబ్రవరి 28న 'రామన్ ఎఫెక్ట్'ను కనుగొన్నందుకు గుర్తుగా ప్రతి సంవత్సరం జాతీయ సైన్స్ దినోత్సవాన్ని జరుపుకుంటారు.",
    "ఎందుకు జరుపుకుంటాము": "ప్రజల రోజువారీ జీవితంలో సైన్స్ ప్రాముఖ్యత గురించి అవగాహన కల్పించడానికి మరియు యువతలో శాస్త్రీయ దృక్పథాన్ని పెంపొందించడానికి మనం సైన్స్ డేని జరుపుకుంటాము.",
    "కంప్యూటర్": "కంప్యూటర్ అనేది సమాచారాన్ని ప్రాసెస్ చేసే ఒక ఎలక్ట్రానిక్ పరికరం.",
    "నమస్కారం": "నమస్కారం! నేను మీకు ఎలా సహాయపడగలను?"
};

let isMuted = false;

// 1. VOICE OUTPUT
function speak(text) {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (/[హ-౯]/.test(text)) utterance.lang = 'te-IN'; 
    else if (/[अ-ह]/.test(text)) utterance.lang = 'hi-IN'; 
    else utterance.lang = 'en-IN'; 
    window.speechSynthesis.speak(utterance);
}

// 2. MIC INPUT
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    function startVoice() {
        document.querySelector(".mic-btn").style.color = "red";
        recognition.start();
    }
    recognition.onresult = (event) => {
        document.getElementById("userInput").value = event.results[0][0].transcript;
        handleSend();
    };
    recognition.onspeechend = () => { recognition.stop(); document.querySelector(".mic-btn").style.color = "inherit"; };
    recognition.onerror = () => { document.querySelector(".mic-btn").style.color = "inherit"; };
}

// 3. LOGIC
function getResponse(userInput) {
    const text = userInput.trim();
    const textLower = text.toLowerCase();
    const isHindi = /[अ-ह]/.test(text);
    const isTelugu = /[హ-౯]/.test(text);

    for (let key in Knowledge) {
        if (textLower.includes(key.toLowerCase())) return Knowledge[key];
    }

    if (textLower.includes("why") || textLower.includes("क्यों") || textLower.includes("ఎందుకు")) {
        if (isHindi) return Knowledge["क्यों मनाते हैं"];
        if (isTelugu) return Knowledge["ఎందుకు జరుపుకుంటాము"];
        return Knowledge["why we celebrate"];
    }

    if (isHindi) return `क्षमा करें, मुझे "${text}" के बारे में जानकारी नहीं है।`;
    if (isTelugu) return `క్షమించండి, నా దగ్గర "${text}" గురించి సమాచారం లేదు.`;
    return "I'm still learning! Try asking about Science Day or Python.";
}

// 4. UI FUNCTIONS
function handleSend() {
    const inputField = document.getElementById("userInput");
    const val = inputField.value.trim();
    if (!val) return;

    renderMessage(val, 'user-msg');
    inputField.value = "";
    document.getElementById("typing").classList.remove("hidden");

    setTimeout(() => {
        document.getElementById("typing").classList.add("hidden");
        const reply = getResponse(val);
        renderMessage(reply, 'bot-msg');
        speak(reply);
    }, 600);
}

function renderMessage(txt, type) {
    const chatbox = document.getElementById("chatbox");
    const div = document.createElement("div");
    div.className = `msg ${type}`;
    div.innerText = txt;
    chatbox.appendChild(div);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function clearChat() {
    document.getElementById("chatbox").innerHTML = '<div class="msg bot-msg">Chat cleared. How can I help you?</div>';
}

function toggleTheme() { document.body.classList.toggle('dark-mode'); }
function toggleMute() {
    isMuted = !isMuted;
    document.getElementById("muteBtn").innerText = isMuted ? "🔇" : "🔊";
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("userInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSend();
    });
});
