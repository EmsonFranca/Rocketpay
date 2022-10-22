import "./css/index.css"
import IMask from 'imask'

//querySelector: selecionar um elemento qalquer
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type){
    
    const colors = {
        "visa":["#436D99","#2D57F2"],
        "mastercard":["#DF6F29","#C69347"],
        "unibank":["#8707C2","#063A02"],
        "default": ["#black","#gray"],
    }

    ccBgColor01.setAttribute("fill",colors[type][0])
    ccBgColor02.setAttribute("fill",colors[type][1])
    ccLogo.setAttribute("src",`cc-${type}.svg`)
}

globalThis.setCardType = setCardType 
//jeito padrão
//var securityCode = document.getElementById("security-code")
//a tag do securityCode esta na linha 154 no index.html
// security-code
const securityCode = document.querySelector("#security-code")

const securityCodePattern = {
    mask: "0000",
}

const securityCodeMasked = IMask (securityCode, securityCodePattern)

//a tag do expiration-date esta na linha 149 no index.html
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear()+10).slice(2)
        },
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        },
    },
}
const expirationDateMasked = IMask(expirationDate,expirationDatePattern)

//mascara dinamica
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
    mask: [
        {
            mask:"0000 0000 0000 0000",
            regex:/^4\d{0,15}/,
            cardtype: "visa"
        },
        {
            mask:"0000 0000 0000 0000",
            regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|{^2[3-7]\n{0,2}})\d{0,12} /,
            cardtype: "mastercard"
        },
        {
            mask:"0000 0000 0000 0000",
            cardtype: "default"
        }
    ],
    dispatch: function(appended, dynamiMasked){
        const number = (dynamiMasked.value + appended).replace(/\D/g,"")
        const foundMask = dynamiMasked.compiledMasks.find(function(item){
            return number.match(item.regex)
        })
        return foundMask
    },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
//addEventListener onserva as ações do butão especificado
addButton.addEventListener("click", () => {
    alert("Cartão adicionado com suscesso!")

})

document.querySelector("form").addEventListener("submit", (event) =>{
    event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
    const ccHolder = document.querySelector(".cc-holder .value")
    ccHolder.innerText = cardHolder.value.length === 0 ? "FULANDO DDA SILVA": cardHolder.value
})

securityCodeMasked.on("accept",()=>{
    updateSecurityCode(securityCodeMasked)
})

function updateSecurityCode(code){
    const ccSecurity = document.querySelector(".cc-security .value")
    ccSecurity.innerText = code.length === 0 ? "123": code
}

cardNumberMasked.on("accept", () => {
    const cardtype = cardNumberMasked.masked.currentMask.cardtype
    setCardType(cardtype)
    updateCarNumber(cardNumberMasked.value)
})

function updateCarNumber(number){
    const ccNumeber = document.querySelector(".cc-number")
    ccNumeber.innerText = number.length === 0 ? "1234 5678 9012 3456": number
}

expirationDateMasked.on("accepy", () =>{
    updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date){
    const ccExpiration = document.querySelector(".cc-extra .value")
    ccExpiration.innerText = date.length === 0 ? "02/32": date
}