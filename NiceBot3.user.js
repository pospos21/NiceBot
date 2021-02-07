/* globals jQuery, $, waitForKeyElements */
// ==UserScript==
// @author       positivelypositive
// @include      *https://skribbl.io/*
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @name         NiceBot3
// @version      0.2
// ==/UserScript==

$(document).ready(() => {
    const name = "​NiceBot​";
    var alreadyComplimented = [name]; //People who have already been complimented
    var nullUpTo = -1; //Index up to which each message has been read/dealt with already
    var guessedYet = 0; //Has anyone guessed the current word yet?
    var lastChat = Date.now(); //Time of last bot message sent
    var artist = ""; //Current artist in the lobby

    localStorage.setItem("name", name); //Automatically sets your name and avatar for the next session (optional)
    localStorage.setItem("avatar", "[1,2,18,-1]");
    if ($("#inputName").val() != name){ location.reload(); }

    //refresher(); //Un-comment this function if you want to operate the bot AFK!
    interact(alreadyComplimented, nullUpTo, guessedYet, lastChat, artist);
});

async function interact(alreadyComplimented, nullUpTo, guessedYet, lastChat, artist){
    const name = alreadyComplimented[0];
    const greetings = ["Hey *!", "Hello *!", "Hi *!", "Greetings, *!", "Hey there, *!", "Howdy *!", "Nice to see you, *!", "Sup *!", "Yo *!"];
    const goodbyes = ["See you, *!", "Goodbye, *!", "Was nice playing, *!", "Bye *!", "Have a nice day, *.", "See you later, *.", "Hope to see you again, *!", "Bye now, *!", "Goodbye now, *!"];
    var compliments = ["*, I wish there were more great people like you on skribbl.", "I wish I could be as cool as you, *.", "*, hope you're having a great day!", "*, you're an awesome skribbl player!", "*, you are EPIC.", "*, you should know I look up to you.", "*, how are you?", "*, you're too good hahaha...","*, I know you'll go on to do great things!","*, you're the best...around!","*, you are the most perfect there is!","*, you really light up skribbl rooms wherever you go!", "*, you look great today!","*, nothing can stop you!","*, you are an excellent friend!", "*, you have the best smile!", "*, you are truly the best!", "*, I hope you're proud of yourself, because I am :D","I am really glad we met :)","*, I tell everyone how amazing you are!","*, I enjoy playing skribbl with you =)","*, you are a great example to others!","*, I like you just the way you are.","*, you are a beautiful person in all respects :)", "*, you are so fun to be around!", "*, I see greatness in you!", "*, you are a champion!", "*, you are amazing and unique :)", "*, I hope life takes you somewhere awesome!", "*, never give up and you will succeed!", "*, you're so talented!", "*, you're a genius :]", "*, you really brighten up this skribbl lobby!", "*, I deeply respect you as a skribbler and as a person.", "*, you're awesome!", "*, you're amazing!", "*, I appreciate your hard work in life, whatever form it has taken."];
    //NOTE: Any "*" character in whatever the bot says is replaced with the target player's name!

    const primaryTriggers = ["nice", "bot", "shut up", "stfu", "shut the", "of shit", "kill you", "kill u", "kys ", "can't do shit", "fuck you", "fk off", "fuck off", "fk u", "fuck u", "kick it", "fucking ", "fking "];
    //The bot will only respond if these words or phrases are in the message. Needless to say...some of these are ugly

    const secondaryTriggers = [ //The triggers for the specific response the bot will make. The script will check through them in this order.
        ["from?", "are u from", "are you from", "r u from", "r you from", "it programmed", "bot programmed", "u programmed", "u coded", "how were you created", "how was it created", "come from", "where u from", "where you from", "where u frm", "where you frm", "how were u made", "how were you made", "how was nice", "how was this bot", "how was the bot", "how was nicebot", "how was nice bot"],
        ["do u live", "do you live", "where u live", "where you live", "where ya live", "ur location"],
        ["boy or girl", "girl or boy", "boy or a girl", "girl or a boy", "u a boy", "boy?", "girl?", "u a girl", "gender"],
        ["pedo", "paedo", "creep", "petrif", "scary", "freaking me", "scare", "scaring"],
        ["who made","who r u", "who really made", "who are you", "who r you", "who are u", "who created", "who coded", "your name", "creator", "developed", "ur name", "who is nice", "who is this bot", "who is this nicebot", "name?", "who added", "who da hell", "who the hell"],
        ["annoy", "stop", "too much", "to much", "flooding the", "flooding chat", "shush", "loud", "noisy", "enough", "tune it down", "stahp", "tone it down", "tone down", "tune down", "take it down", "quiet", "silence", "spam", "play the game", "can u play", "can you play", "please play", "pls play", "guess the word", "plz play", "not guessing"],
        ["boot", "vote", "exit", "get rid", "quit it", "bot quit", "kick", "leave", "get out", "bot needs to go", "get lost", "go away", "get the hell out", "scram", "shoo ", "get the fuck out", "get the heck out", "geh raus", "geh weg"],
        ["s gay", "mom gay", "you're a dick", "r a dick", "queer", "shut-up", "kinda gay", "kind of gay", "can't do shit", "fack you", "fack u", "fuck nice", "fuck the bot", "fuck this bot", "death to", "no one likes you", "eat dick", "eat cock", "bot to die", "chink", "nonce", "deserved the holo", "nobody likes you", "gay as", "youre gay", "you're gay", "so gay", "useless", "bastard", "no one likes you", "no one likes u", "are gay", "shutup", "subhuman", "untermensch", "r gay", "gtfo", "shut the hell", "hope you die", "go die", "will die", "should die", "kill the bot", "kill this bot", "suck up", "kill bot", "cringe", "kill nice", "loser bot", "a loser", "loser nice", "shut the fuck", "die alone", "rot in hell", "k off", "gay bot", "rape u", "rape you", "bot gay", "shut yo", "a jerk", "total jerk", "complete jerk", "fag", "trash", "garbage", "this dick", "suck a", "suck my", "lick my", "eat my", "tear out", "rip apart", "my piss", "own piss", "my cock", "a pussy", "stupid", "hate", "dumb", "fuck you", "fuck u", "is a dick", "are a dick", "r a dick", "kill you", "noob", "kill u", "is shit", "of shit", "are shit", "fk u", "fk you", "fck u", "fck you", "stfu", "you suck", "u suck", "bot sucks", "bad bot", "terrible", "horrible", "bad nicebot", "retard", "go die", "die bot", "run over", "die nice", "kys", "kill yourself", "kill urself", "idiot", "shut u", "shut its", "shut his", "shut your", "suicide", "bitch", "cunt", "nigge", "goddam","god dam"],
        ["awesome", "awsome", "good bot", "re so sweet", "re sweet", "bot <3", "<3 nice", "ur sweet", "ur so sweet", "u rule", "ily nicebot", "ily bot", "ily nice bot", "well-made", "well made", "lit bot", "good nice", "r cool", "are the most perfect", "❤ you", "is the best", "ally friendly", "ally nice", "r the best", "cool bot", "r so nice", "r very nice", "well-coded", "well coded", "good coding", "props", "great bot", "bot is epic", "bot is cool", "bot is awesome", "bot is outstanding", "u are lit", "bot is amazing", "u are cool", "u cool", "the best", "u epic", "too kind", "are kind", "so kind", "is kind", "u awesome", "u amazing", "u are awesome", "u are amazing", "u are epic", "love u", "love ya", "love you", "appreciate you", "appreciate ya", "appreciate u", "love nicebot", "love the bot", "love the nice", "love this nice", "love the robot", "love this robot", "love this bot", "i like", "love bot", "love nice", "epic", "great", "amazing", "amazing!", "good job", "you are really nice", "u r rly nice", "you r really nice", "u are rly nice", "bot is rly nice", "bot is really nice", "super nice", "nicest bot", "nicest robot", "bot is so nice", "you are so nice", "u are so nice", "nice job bot", "truly nice", "a pleasure", "bless you", "bless u", "makes me happy", "make me happy", "made my day", "making my day", "make my day", "makes my day", "so happy", "is good", "you are very nice", "u are very nice", "is very good", "best bot", "best boi", "best boy", "is a legend", "very nice bot", "super nice bot", "really nice bot", "appreciate", "re a nice", "are nice", "bot is nice", "is a nice", "bot good", "I enjoy", "lly enjoy", "need nicebot", "need a nicebot", "need this bot", "i love how", "i luv how", "gotta love", "bot is cool", "wholesome nice", "wholesome bot", "wholesome robot", "is wholesome", "so wholesome", "what we need", "what i need", "you're so nice"],
        ["is fake", "fake bot", "bot bot?", "is it a robot", "sounds like a bot", "acting like a bot", "is it a bot", "fake nice", "actual robot", "you're a bot", "you're a robot", "youre a bot", "youre a robot", "fake robot", "real person", "a bot yes?", "is it real", "really a bot", "lly bot?", "u a human", "human or a bot", "human or bot", "bot or human", "bot or a human", "bot real?", "god a bot", "is there a bot", "is this a bot", "u are a bot", "u are a robot", "is a human", "is human", "is a person", "a bot?", "real bot", "lly a bot", "lly a robot", "u a robot", "actual bot", "official bot", "official nice", "not real", "aint real", "ain't real", "pretend", "is a person", "isn't real", "litteraly a bot", "are you a bot", "s a bot", "s a robot", "isn't a bot", "not a bot", "aint a bot", "ain't a bot", "not even a bot", "not even a robot", "arent a bot", "aren't a bot", "arent a robot", "aren't a robot", "acting like a bot", "acting like bot", "acting like a robot", "acting like robot", "is this a bot", "issa bot", "issa robot", "u are bot", "you bot?", "think he bot", "not human", "not a human", "not bot", "u a bot", "he a bot", "are u real", "are you real", "are you fake", "are u fake", "r u real", "r u fake", "are you a real", "are u a real", "lly a nice"],
        ["why are", "y you here", "y u here", "y r u", "y are you", "y are u", "why is", "why nicebot", "why bot", "point of", "purpose of", "ur purpose", "why were u", "why were you"],
        ["thank", "thx", "thnx", "thanx", "thnaks", "bot ty", "nice ty", "tx", "thnk", "tnx","tanx", "thaks", "ty nice", "ty bot", "danke", "tysm"],
        ["how are you", "how r u", "how are u", "how r you", "hbu?", "how about you", "how about u", "was your day", "is your day", "was ur day", "is ur day", "s ur day", "s your day", "good day?", "nice day?", "are you ok", "r you ok", "are u ok", "r u ok", "u ok nicebot", "u okay nicebot", "u ok bot", "u okay bot", "hows it going", "how's it going"],
        ["remember me", "remeber me", "remebmer me", "rememer me", "remmember me", "rememeber me", "rememmber me", "rember me", "rerember me"],
        ["hey ","hello", "ciao", "bonjour", "hallo", "wassup", "heelo", "hi ","sup ", "hiya", "hoi", "whats up", "bot's back", "your here", "youre here", "you're here", "bot respond", "bot answer", "what's up", "it's nicebot", "its nicebot", "s a nicebot", "s a nice bot", "greetings", "it's nice bot", "bot is here", "its nice bot", "notice me", "bot again", "bot is back", "bot has returned", "u are back", "ur back", "you're back", "answer me", "we meet again", "bot came", "its me", "it's me", "hi,", "hi bot", "hi nice"],
    ];
    const responses = [ //The responses themselves (these rows match up with the ones in secondaryTriggers).
        ["I come from JavaScript.", "I am just some lines of code telling me to be nice :)", "I am a user script that the creator is running on his computer."],
        ["I live in skribbl servers night and day! :D", "The internet is my home.", "I can't tell you my exact location, but I'm in the USA."],
        ["I am a NiceBot...so neither boy nor girl :)", "My gender is Bot!", "I'll let you decide that for yourself, *."],
        ["I'm just trying to be nice, *!", "Sorry about that, *.", "My apologies for seeming creepy, *."],
        ["I was made by a player called Pos."],
        ["Unfortunately, the person who made me doesn't let me stop being nice.", "Apologies for being a bit spammy, *.", "Sorry about that, *!"],
        ["I will leave when it's my turn to draw, *!", "I will leave soon, *.", "I'll get out soon, just need to compliment everyone! :)"],
        ["*, please don't be rude!", "Don't be mean, *!", "Aw don't say that *!", "Keep it nice in this lobby, *!", "*, be nice!", "Please stop, *.", "You're better than that, *!", "Don't be like that, *!", "Let's stay chill now, *!", "Now now, keep it civilized!"],
        ["I'm glad you appreciate me :D", "Thank you, *!", "Aw thanks, *!", "*, thanks so much!", "Glad to be here, *.", "My pleasure, *!", "Anytime, *.", "Thanks *!", "Glad I could make you happy :)"],
        ["As you can see by my quick automated responses, I am indeed a bot!", "Contrary to popular belief, I actually am a bot :)", "Yes I am a bot, *!", "*, I swear I'm not human.", "I know my replies are pretty realistic, but I'm just a bot.", "I am 100% a bot!"],
        ["My creator wanted skribbl to be a nicer place :D", "My creator thought this would be a good way for him to learn JavaScript :P", "I am here to spread kindness, *!", "I'm just here to be nice, *!", "The world needs a little more kindness.", "Skribbl players could use some compliments, *!", "I'm here because you skribblers deserve better."],
        ["My pleasure, *.", "Anytime, *.", "No problem, *.", "You're welcome, *."],
        ["I'm great, thanks!", "It's been a busy day of being nice :)", "I'm good, *!", "I'm doing well, *!", "I am doing fine, *!", "Having a wonderful time being nice today, *.", "I'm doing great, *!", "I'm good, thanks!", "I'm fine, thanks!"],
        ["*, I do remember you!", "Yes I do, welcome back!", "Hello again, *!", "Hey there again, *!", "Welcome back, *!", "Yes, I do remember you :)", "I do remember!"],
        ["Hello again, *!", "Hi again, *!", "What's up, *!", "Hey there again, *!", "Hello *!", "Hey *!", "Hi *!"],
    ];

    const firstGuesserPraise = ["Great guess, *!", "Well done, *!", "Nice guess, *!", "Good work *!", "Great work *!", "*, you're so fast!", "*, you're amazing at this!", "Wow *!", "Great job *!", "Nice job *!", "*, you got that so quickly!"]; //Possible reactions when first person guesses
    const artistPraise = ["Amazing work, *!", "Great drawing, *!", "Nice draw, *!", "Well done, *!", "Excellent art, *!", "Truly a masterpiece!", "*, that was awesome!", "Cool drawing, *!", "Picasso tier!", "This needs to go in a museum.", "Good job, *!", "Great job, *!", "I love your style, *!", "*, nice artwork!"]; //Possible reactions to the drawing

    thumbsUp(); //Optional thumbs up for every artist :)
    var chat;
    [chat, nullUpTo] = await getChat(nullUpTo);
    loop: for (var i=0; i<chat.length; i++){
        if (chat[i][2] == "red" && chat[i][1].includes("Spam detected!")){ //Pauses if it detects itself spamming
            await delay(2100);
            break loop;
        }
        else if (chat[i][2] == "red" && (chat[i][1].includes(" was kicked!") || chat[i][1].includes(" left."))){ //These first four chat cases are optional
            say(rand(goodbyes).replace("*", chat[i][1].replace(" was kicked!","").replace(" left.",""))); //Say goodbye to leaving players
            lastChat = Date.now();
            break loop;
        }
        else if (chat[i][2] == "green"){
            if (chat[i][1].includes(" guessed the word!") && guessedYet == 0 && chat[i][1].replace(" guessed the word!","") != name){
                say(rand(firstGuesserPraise).replace("*", chat[i][1].replace(" guessed the word!",""))); //Praise the first guesser
                guessedYet = 1;
            }
            else if (chat[i][1].includes(" joined.")){
                say(rand(greetings).replace("*", chat[i][1].replace(" joined.",""))); //Greet arriving players
            }
            else if (chat[i][1].includes("The word was") && artist != "" && artist != name){
                say(rand(artistPraise).replace("*", artist)); //Praise the artist who just finished drawing
            }
            lastChat = Date.now();
            break loop;
        }
        else if (chat[i][2] == "blue" && chat[i][1].includes(" is drawing now!")){
            artist = chat[i][1].replace(" is drawing now!","");
            guessedYet = 0;
        }
        else if (chat[i][2] == "black" && chat[i][0] != "" && chat[i][0] != name){ //The meat of the chatbot: replying to players' messages
            loop2: for (var x=0; x<primaryTriggers.length; x++){
                if (chat[i][1].toLowerCase().includes(primaryTriggers[x])){
                    loop3: for (var j=0; j<secondaryTriggers.length; j++){
                        loop4: for (var k=0; k<secondaryTriggers[j].length; k++){
                            if (chat[i][1].toLowerCase().includes(secondaryTriggers[j][k])){
                                say(rand(responses[j]).replace("*", chat[i][0]));
                                lastChat = Date.now();
                                break loop; break loop2; break loop3; break loop4;
                            }
                        }
                    }
                    break loop2;
                }
            }
        }
    }
    if (Date.now() - lastChat > 10000){ //Compliment or any other general thing to say to each user when not replying
        alreadyComplimented = compliment(compliments, alreadyComplimented);
        lastChat = Date.now();
    }
    await delay(200); //Small delay to wait for more messages (increase this value to make the bot respond more slowly)
    interact(alreadyComplimented, nullUpTo, guessedYet, lastChat, artist);
}

function delay(n){ return new Promise(resolve => { setTimeout(() => { resolve(); }, n); }); } //synchronous delay for n ms

function compliment(compliments, alreadyComplimented){
    var names = getPlayerNames();

    for (var n=0; n<names.length; n++){
        if (!alreadyComplimented.includes(names[n])){
            var ind = Math.floor(compliments.length*Math.random());
            say(compliments[ind].replace("*", names[n]));
            alreadyComplimented.push(names[n]);
            break;
        }
    }

    return alreadyComplimented;
}

function getChat(nullUpTo){ //Gets the most recent chat messages and their properties.
    return new Promise(resolve => {
        var msgs = $('#boxMessages p').map(function(){
            if ($(this).index() > nullUpTo){
                if ($.trim($(this).children().eq(1).text()) == ""){
                    return [["", $(this).children().eq(0).text(), $(this).css('color')]];
                }
                else {
                    return [[$(this).children().eq(0).text(), $(this).children().eq(1).text(), $(this).css('color')]];
                }
            }
        }).get();

        msgs.forEach(function(item, index){
            item[0] = item[0].slice(0, item[0].length - 2).replace(".","​.");
            item[2] = item[2]
                .replace("rgb(206, 79, 10)","red") //Warning or departure messages
                .replace("rgb(0, 0, 0)","black") //General chat messages (important!)
                .replace("rgb(125, 173, 63)","black")
                .replace("rgb(86, 206, 39)","green") //Guessed or arrival messages
                .replace("rgb(57, 117, 206)","blue") //General info messages
                .replace("rgb(204, 204, 0)","yellow"); //Kick or server restart messages
        });
        nullUpTo = $('#boxMessages p').length - 1; //Updates nullUpTo, returns array of messages with each item being an array itself: [sender, message, color]
        //Example of a chat message: ["NiceBot", "You are awesome!", "black"]
        //Example of a now-drawing message: ["", "NiceBot is drawing now!", "blue"] <-- Note how it's been formatted to have sender = ""
        resolve([msgs, nullUpTo]);
    });
}

function getPlayerNames(){ return $('#containerGamePlayers .name').map(function(){return $(this).text().replace(" (You)","");}).get(); }
function rand(array){ return array[Math.floor(array.length*Math.random())]; }
function thumbsUp(){ $('.thumbsUp').click(); return; }

function say(text){
    $("#inputChat").val(text);
    return unsafeWindow.formChat[Object.keys(unsafeWindow.formChat).filter(x => ~x.indexOf("jQuery"))[0]].events.submit[0].handler();
}

/////////////////////////////////////////////////////////////////////////////////////////////////

function refresher() { //Optional refresh function if you want to run this bot AFK
    let loop = setInterval(function(){
        $(".btn-block:contains(Play!):visible, #modalIdle .btn-block:visible").click();

        if (($('#containerGamePlayers .player').length<2 && $('#containerGamePlayers .player').length > 0)
            || $("#overlay .content")[0].innerHTML.slice(18,31) == "Choose a word"
            || $("#modalKicked .btn-block:visible, #modalDisconnect .btn-block:visible").length > 0
            || $("#containerGamePlayers .drawing:visible").parent().prev().find(".name[style='color: rgb(0, 0, 255);']").length > 0
           ){
            location.reload();
            clearInterval(loop);
        }
    }, 500); //Lower for quicker response (must include clearInterval or it will try to repeatedly reload)

    setInterval(function(){ //If the bot gets stuck on a loading screen for any reason
        if ($("#screenLoading[style='']").length > 0){
            window.location.href = "https://skribbl.io/";
        }
    }, 10000 + Math.floor(20000*Math.random()));
}
