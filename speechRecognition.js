if (!("webkitSpeechRecognition" in window)) {
  var statusElement = document.querySelector("#status");
  statusElement.innerText = "זיהוי דיבור אינו זמין בדפדפן זה"
  statusElement.style.display = "block";
}

let final_transcript = "";
let speechRecognition = new webkitSpeechRecognition();
speechRecognition.continuous = true;
speechRecognition.interimResults = true;
speechRecognition.lang = 'he-IL'
speechRecognition.onstart = () => {
  document.querySelector("#status").style.display = "block";
};
speechRecognition.onerror = (e) => {
  statusElement.innerText = "שגיאה בזיהוי דיבור: " + e.error;
};
speechRecognition.onend = () => {
  document.querySelector("#status").style.display = "none";
  console.log("Speech Recognition Ended");
};
speechRecognition.onresult = (event) => {
  let interim_transcript = "";

  for (let i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      final_transcript += event.results[i][0].transcript;
    } else {
      interim_transcript += event.results[i][0].transcript;
    }
  }
  document.querySelector("#final").innerHTML = final_transcript;
  document.querySelector("#interim").innerHTML = interim_transcript;
};

var startButton = document.querySelector("#recordingButton")
startButton.onclick = () => {
  if (startButton.innerText=="התחל הקלטה"){
    startButton.classList="btn btn-danger"
    startButton.innerText="עצור הקלטה"
    speechRecognition.start();
    mediaRecorder.start();
  }
  else{
    startButton.classList="btn btn-success"
    startButton.innerText="התחל הקלטה"
    speechRecognition.stop();  
    mediaRecorder.stop();
  }
};

var copyButton = document.querySelector("#copyButton")
copyButton.onclick = () => {
  var textToCopy = document.querySelector("#final").innerText

  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = textToCopy;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
    
  var copyAlert = document.querySelector("#copyAlert")
  copyAlert.style.display = 'block';
  setTimeout(function(){
    copyAlert.style.display = 'none';
  }, 3000);   
}

var downloadButton = document.querySelector("#downloadButton")
downloadButton.onclick = () => {
  var textToDownload = document.querySelector("#final").innerText
  var blob = new Blob([textToDownload], {type: "text/plain;charset=utf-8"});
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "speech.txt";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
