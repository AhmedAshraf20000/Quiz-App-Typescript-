let quizContainer = <HTMLDivElement>document.getElementById("quiz-container");
let levelContainer = <HTMLDivElement>document.getElementById("level-container");
let levelSection = <HTMLDivElement>document.getElementById("level-section")
let questionCtr = <HTMLDivElement>document.getElementById("text-number");
let quizHeader = <HTMLDivElement>document.getElementById("quiz-header")
let qHeader = <HTMLDivElement>document.getElementById("qHeader");
let mainText = <HTMLDivElement>document.getElementById('text');
let answersbox = <HTMLDivElement>document.getElementById("answers-container");
let btn = <HTMLButtonElement>document.querySelector(".btn");
let levelBtn = <HTMLButtonElement>document.querySelector(".btn-level");
let inputs: any = document.getElementsByTagName("input");
let timer = <HTMLDivElement>document.getElementById("timer");
let hoursDiv: any = <HTMLDivElement>document.createElement("div");
let minDiv: any = <HTMLDivElement>document.createElement("div");
let secDiv: any = <HTMLDivElement>document.createElement("div");
let count: number = 0;
let correctAnswers: number = 0;
let answer: string = ""
let rightAns: string = "";
let seconds: number = 0;
let hours: number = 0;
let minutes: number = 0;
let level: string = '';

if (quizContainer.classList.contains('hide')) {
    for (let index = 0; index < inputs.length; index++) {
        inputs[index].onclick = () => level = inputs[index].id;
    }
    levelBtn.onclick = () => {
        switch (level) {
            case "easy":
                seconds = 60;
                break;
            case "mid":
                seconds = 40;
                break;
            default:
                seconds = 20;
        }
        levelSection.className = "hide";
        quizContainer.classList.remove("hide");
        getQuestions();
    }
}



async function getQuestions(): Promise<void> {
    let sec = seconds;
    let data = (await fetch("./questions.json")).json();
    let questions: any[] = await data;
    let numOfQuestions: number = questions.length;

    let hText = document.createTextNode(questions[count].question);
    qHeader.appendChild(hText);
    creatQuestionBox(questions[count].choices);
    rightAns = questions[count].answer;
    questionCtr.innerText = `Question NO.${count + 1} of ${numOfQuestions}`
    const timerInterval = setInterval(
        () => {
            if (sec > 0) {
                sec--;
                sec < 10 ? secDiv.innerHTML = `0${sec}` : secDiv.innerHTML = `${sec}`;
            }
            else {
                clearInterval(timerInterval);
                btn.click();
            }
        }
        , 1000)
    hours < 10 ? hoursDiv.innerHTML = `0${hours}` : hoursDiv.innerHTML = `${hours}`;
    minutes < 10 ? minDiv.innerHTML = `0${minutes}` : minDiv.innerHTML = `${minutes}`;
    timer.appendChild(hoursDiv);
    timer.appendChild(minDiv);
    timer.appendChild(secDiv);
    btn.onclick = (): void => {
        count++;
        if (count < numOfQuestions) {
            qHeader.innerText = "";
            answersbox.innerHTML = "";
            if (answer === rightAns) correctAnswers++;
            clearInterval(timerInterval);
            getQuestions();
        }
        else {
            seconds = Infinity;
            qHeader.remove();
            answersbox.remove();
            btn.remove();
            quizHeader.remove();
            mainText.remove();
            document.getElementById("text")?.remove();
            let result = <HTMLDivElement>document.createElement("div");
            result.className = "result";
            result.innerText = `You have ${correctAnswers} correct answers`
            let tryBtn = <HTMLButtonElement>document.createElement("button");
            tryBtn.className = "btn";
            tryBtn.innerHTML = `try again`;
            tryBtn.style.margin = "auto";
            quizContainer.style.marginTop = "150px";
            quizContainer.appendChild(result);
            quizContainer.appendChild(tryBtn);
            tryBtn.onclick = () => {
                location.reload();
            }
        }
    }

}

function creatQuestionBox(labelTxt: string[]): void {
    for (let i = 1; i <= labelTxt.length; i++) {
        let divQuestion = document.createElement("div");
        let input = document.createElement("input");
        let label = document.createElement("label");
        label.setAttribute("for", `answer-${i}`)
        label.textContent = `${i}."${labelTxt[i - 1]}"`;
        input.type = "radio";
        input.setAttribute("id", `answer-${i}`)
        input.setAttribute("name", "answer");
        input.dataset.answer = labelTxt[i - 1];
        input.onclick = () => {
            answer = labelTxt[i - 1];
        }
        divQuestion.appendChild(input);
        divQuestion.appendChild(label);
        answersbox.appendChild(divQuestion);
    }
}






