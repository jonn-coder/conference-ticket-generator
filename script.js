//## element vars
let dropAreaEl = document.querySelector(".drop-area")
let uploadTextEl = document.querySelector(".upload-text")
const fileInputEl = document.getElementById("file-input")
const prevEl = dropAreaEl.querySelector(".prev-image")
const uploadEl = dropAreaEl.querySelector(".upload-image")
const prevImgEl = dropAreaEl.querySelector(".prev-image > img")
const formEl = document.getElementById("form")
const inputEls = document.querySelectorAll(".text-boxes input")
const formWrapper = document.querySelector(".form-wrapper")
const ticketEl = document.querySelector(".generated-ticket-wrapper")
const submitBtn = document.querySelector(".generate-ticket")
const ticketTitleEl = document.querySelector(".ticket-title")
const emailEl = ticketEl.querySelector(".description .email")
const ticketUser = ticketEl.querySelector(".user")
const gitHubUserNameEl = ticketUser.querySelector(".github-user-name")
const stampEl = ticketEl.querySelector(".stamp")

const fullNameInput = document.getElementById("fullName")
const emailInput = document.getElementById("email")
const gitHubUserNameInput = document.getElementById("gitHubUserName")

//## regEx var for text input
const regExes = {
  fullName: /^[\s]*([a-zA-Z]{3,16})+(([\s]{1,2})([a-zA-Z]{3,16})+){0,2}[\s]*$/,
  email: /^([\w\-])+@([\w\-])+\.([\w]{2,8})((\.[\w]{2,8})+)?$/,
  gitHubUserName: /^@[a-zA-Z0-9-_]+$/,
}

let file = null
dropAreaEl.addEventListener("click", (e) => {
  if (dropAreaEl.classList.contains("disabled")) {
    if (e.target.classList.contains("remove-image")) {
      removeImage()
    } else if (e.target.classList.contains("change-image")) {
      const inputMethod = 'click'
      changeImage(inputMethod, null)
    }
    // return, if image already exist on preview
    return
  }
  // file input will be clicked if drop area is clicked
  fileInputEl.click()
  dropAreaEl.focus()
})

fileInputEl.addEventListener("change", (e) => processFile(e.target.files[0]))

//### drag an drop###
// ->preventDefault of drag and drop events
;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropAreaEl.addEventListener(
    eventName,
    (e) => {
      e.preventDefault()
      e.stopPropagation()
    },
    false
  )
})

// ->show focus state on dragover or dragenter
;["dragenter", "dragover"].forEach((eventName) => {
  dropAreaEl.addEventListener(
    eventName,
    () => {
        dropAreaEl.classList.add("dragged-over")
    },
    false
  )
})

// ->remove focus on dragleave or drop
;["dragleave", "drop"].forEach((eventName) => {
  dropAreaEl.addEventListener(
    eventName,
    () => {
      dropAreaEl.classList.remove("dragged-over")
    },
    false
  )
})

// -> finally get file image with drop event
dropAreaEl.addEventListener(
  "drop",
  (e) => {
    let files = e.dataTransfer.files
    if (!dropAreaEl.classList.contains("disabled")) {
      processFile(files[0])
    } else if (dropAreaEl.classList.contains("disabled")) {
      const inputMethod = 'dragAndDrop'
      changeImage(inputMethod, files)
    }
  },
  false
)

// process/preview image
function processFile(fileInput) {
  if (!fileInput) return
  file = fileInput
  const fileType = file.type
  const extensionRegEx = /^image\/(png|jpe?g)$/
  const matched = fileType.match(extensionRegEx)
  const fileSizeInKB = file.size / 1000
  let message = ""
  let isValid = true
  // upload only if image extension match extensionRegEx, image size less than or equel 500kb
  if (matched) {
    if (fileSizeInKB > 500) {
      message = "File too large. Please upload a photo under 500KB"
      isValid = false
      imageWarning(message, isValid)
      return
    }
    message = "Upload your photo (JPG or PNG, max size: 500KB)."
    isValid = true
    imageWarning(message, isValid)
    displayImage()
    // disabled button untill all input are valid
    disabledButton(validForm())
  } else if (!matched) {
    message = "Photo can either be .JPG or .PNG extension"
    isValid = false
    imageWarning(message, isValid)
  }
}

let imageUrl = ""
let imageLoaded = false
// display image func
function displayImage() {
  let fileReader = new FileReader()
  fileReader.addEventListener("loadend", () => {
    imageUrl = fileReader.result
    uploadEl.classList.replace("active", "none-active")
    prevEl.classList.replace("none-active", "active")
    prevImgEl.src = imageUrl
  })
  fileReader.readAsDataURL(file)
  dropAreaEl.classList.add("disabled")
  imageLoaded = (fileReader.DONE === 2) //fileReader.DONE has code 2 if image reading successfully
}

// remove image func
function removeImage() {
  uploadEl.classList.replace("none-active", "active")
  prevEl.classList.replace("active", "none-active")
  dropAreaEl.classList.remove("disabled")
  prevImgEl.src = ""
  imageLoaded = false;
  fileInputEl.value = ""
  // disabled button untill all input are valid
  disabledButton(validForm())
}

// change image function
function changeImage(inputMethod, files) {
  if (inputMethod === 'dragAndDrop') {
    if(!files) return;
    if (files[0].name !== file.name && confirm(`Are you sure you want to replace the old image ${file.name} with ${files[0].name}?`)) {
      processFile(files[0])
    }
    else if (files[0].name === file.name && confirm(`Image with name ${files[0].name} already exist!, OK to replace or CANCEL to abort!`)) {
      processFile(files[0])
    }
  }
  else if (inputMethod === 'click') {
    fileInputEl.click()
    dropAreaEl.focus()
  }
}

// warning if no correct image
function imageWarning(message, isValid) {
  const inValidMessageEl = dropAreaEl.parentNode.querySelector(".upload-description")
  inValidMessageEl.innerHTML = `
      <img src="assets/images/${
        isValid ? "icon-info.svg" : "icon-error.svg"
      }" alt="" />
      <span style="color: ${isValid ? "" : "#e16151"};">${message}</span>
  `
}

// focus next input if enter got clicked
document.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && e.target.nodeName === "INPUT") {
    const currentInput = e.target
    const AllInput = e.target.form.querySelector(".text-boxes").querySelectorAll("input");
    let currentIndex = Object.values(AllInput).indexOf(currentInput)
    if (handleWarning(currentInput) && currentIndex < inputEls.length - 1) {
      inputEls[currentIndex + 1].focus()
    } else if (currentIndex == inputEls.length - 1 && handleWarning(currentInput)) {
      submitBtn.focus()
    }
    e.preventDefault()
  }
})

// preventDefault on form
form.addEventListener("submit", (e) => {
  e.preventDefault()
})

// submit form
submitBtn.addEventListener("click", (e) => {
  handleForm()
})

// handle form 
function handleForm() {
  validForm() && generateTicket()
  !validForm() && showGeneralWarning()
}

// generay error if all input are not valid
function showGeneralWarning() {
  // loop throgh and add error to text input when necessary
  for (let i = 0; i < inputEls.length; i++) {
    const input = inputEls[i]
    handleWarning(input)
  }
  // show error for image if not valid
  if (!imageLoaded) {
    let isValid = false
    let message = "Please upload your photo (JPG or PNG, max size: 500KB)."
    imageWarning(message, isValid)
  }
}

//  handle warning on typing
for (let i = 0; i < inputEls.length; i++) {
  const input = inputEls[i]
  const errorTextEl = input.parentNode.querySelector(".error-info")
  ;["change", "input"].forEach((eventName) => {
    input.addEventListener(eventName, (e) => {
      // disabled button untill all input are valid
      disabledButton(validForm())


      if (errorTextEl.classList.contains("show-error")) {
        // add 'contains-error' to know if input has error when onChange or onInput, because "show-error" class will change
        errorTextEl.classList.add("contains-error")
      }
      // remove or add error on typing if error already exist
      if (eventName === "input" && errorTextEl.classList.contains("contains-error")) {
        handleWarning(e.target)
      } else if (eventName === "change") {
        handleWarning(e.target)
      }
    })
  })
}

// -> handleWarning func
function handleWarning(input) {
  let errorTextEl = input.parentNode.querySelector(".error-info")
  if (input.value.match(regExes[input.name])) {
    hideWarning(errorTextEl)
    return true
  } else if (!input.value.match(regExes[input.name])) {
    showWarning(errorTextEl)
    return false
  }
}

//## show warning for text inputs
function showWarning(errorTextEl) {
  errorTextEl.classList.add("show-error")
  return true
}

//## hide warning  for text inputs
function hideWarning(errorTextEl) {
  errorTextEl.classList.remove("show-error")
  return true
}

function validForm() {
  // loop through text input to check if no error
  const isValidText = Object.entries(inputEls).every((input) => {
    return regExes[input[1].name].test(input[1].value)
  })
  return (isValidText && imageLoaded) //both text and file input are valid
}

// generate ticket
function generateTicket() {
  emailEl.textContent = emailInput.value
  ticketTitleEl.querySelector(".name").textContent = fullNameInput.value
  ticketUser.querySelector(".name").textContent = fullNameInput.value
  ticketUser.querySelector("img:first-child").src = imageUrl
  gitHubUserNameEl.querySelector(".name").textContent =
    gitHubUserNameInput.value
  stampEl.textContent = getStamp()
  formWrapper.classList.add("hide-form")
  ticketEl.classList.add("show-ticket")
}

function getStamp() {
  let stampSign = "#"
  for (let i = 0; i < 5; i++) {
    stampSign += Math.floor(Math.random() * 5)
  }
  return stampSign
}

// disable button untill input correctly filled
function disabledButton(isValidForm) {
  if(!isValidForm){
    submitBtn.setAttribute('disabled', 'false')
  }
  else {
    submitBtn.removeAttribute('disabled')
  }
}
disabledButton(validForm())
