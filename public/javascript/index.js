const div = document.querySelector(".indicator")
const on = document.querySelector(".btn1")
const off = document.querySelector(".btn2")

const baseUrl = "/root"

const dataOn = {
  msg : "on"
}

const dataOff = {
  msg : "off"
}

const onOptions = {
  method: 'POST',
  headers: {
      "Content-type": "application/json; charset=UTF-8"
  },
  body: JSON.stringify(dataOn)
}

const offOptions = {
  method : 'POST',
  headers : {
    "Content-type" : "application/json; charset=UTF-8"
  },
  body: JSON.stringify(dataOff)
}

const onFn = async (e) => {
  e.preventDefault()
  div.style.backgroundColor = "green";
  await fetch(baseUrl, onOptions);
}

const offFn = async (e) => {
  e.preventDefault()
  div.style.backgroundColor = "red";
  await fetch(baseUrl, offOptions);
}

// Add event listener to Buttons
on.addEventListener("click", onFn);
off.addEventListener("click", offFn);


