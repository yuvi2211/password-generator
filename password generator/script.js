const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNnumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#Uppercase");
const lowercaseCheck = document.querySelector("#Lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allcheckBox = document.querySelector("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password ="";
let passwordLength=10;
let checkCount = 1;
uppercaseCheck.checked=true;
setIndicator("#ccc");
handslider();


function handslider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndmInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNum(){
    return getRndmInteger(0,10);
}

function generateLowercase(){
    return String.fromCharCode(getRndmInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndmInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndmInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true;

    if( hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8){
        setIndicator("#0f0");
    }else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >=6
    ){
        setIndicator("#ff0");
    } else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch(err){
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(()=> {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    //Fisher Yates Method

    for(let i=array.length-1; i>0;i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el) => (str+=el));
    return str;
}


function handleCheckBoxChange(){
    checkCount =0;
    allcheckBox.forEach((check) =>{
        if(check.checked)
             checkCount++;
    });

    //special condn
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handslider();
    }
}

Array.prototype.forEach.call(allcheckBox,handleCheckBoxChange);

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handslider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
})


generateBtn.addEventListener('click', ()=>{

    if(checkCount==0){
        return;
    }

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handslider();
    }

    console.log("Starting the journey");
    password="";

    let funcArr = [];
  
 if(uppercaseCheck.checked){
    funcArr.push(generateUpperCase);
 }
 if(lowercaseCheck.checked){
    funcArr.push(generateLowercase);
 }
 if(symbolCheck.checked){
    funcArr.push(generateSymbol);
 }
 if(numberCheck.checked){
    funcArr.push(generateRandomNum);
 }

 for(let i=0;i<funcArr.length;i++){
    password+= funcArr[i]();
 }
 console.log("Compulsory addition done");
//remaining addition
 for(let i=0;i<passwordLength-funcArr.length;i++){
    let randIndex = getRndmInteger(0,funcArr.length);
    console.log("randomindex" + randIndex);
    password += funcArr[randIndex]();
 }
 console.log("remaining addition done");

 //shuffle password
 password = shufflePassword(Array.from(password));
 console.log("Shuffling done");
 //Show in UI
 passwordDisplay.value = password;
 console.log("UI Addition done");

 calcStrength();

});