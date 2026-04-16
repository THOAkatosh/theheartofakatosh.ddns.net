const linktext = document.querySelectorAll(".linktext")
const copyMessage = document.querySelector(".copy-message")

document.querySelector("link[rel*='icon']").href = "image/ag-favicon.ico"

function copyMessageToast() {
    if (!copyMessage.classList.contains("show")) {
        copyMessage.classList.add("show")
        setTimeout(() => {
            copyMessage.classList.remove("show")
        }, 2000)
    }
}

linktext.forEach(button => {
    const leftArrow = button.querySelector(".arrow")
    const rightArrow = button.querySelector(".arrow.reverse")

    button.addEventListener("mouseenter", () => {
        if (!button.classList.contains("inactive")){
            leftArrow.style.marginRight = "-7px"
            rightArrow.style.marginLeft = "-6px"
        }
    })

    button.addEventListener("mouseleave", () => {
        leftArrow.style.marginRight = "unset"
        rightArrow.style.marginLeft = "unset"
    })

    button.addEventListener("click", () => {
        if (!button.classList.contains("inactive")){
            copyTextInsert(button.querySelector("span").textContent)
            copyMessageToast()
            button.classList.add("inactive")
            setTimeout(() => {
                button.classList.remove("inactive")
            }, 2500);
        } else {
                errorAudio.play();
        }
    }) 
})

async function copyTextInsert(textToCopy) {
    try {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(textToCopy);
        }
    } catch (err) {
        console.error(err);
    }
}
