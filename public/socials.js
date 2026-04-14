const topButtons = document.querySelector(".tg-discord-holder")
const buttons = document.querySelectorAll(".buttons")
const copyMessage = document.querySelector(".copy-message")

function copyMessageToast() {
    if (!copyMessage.classList.contains("show")) {
        copyMessage.classList.add("show")
        setTimeout(() => {
            copyMessage.classList.remove("show")
        }, 2000)
    }
}

buttons.forEach(button => {
    const leftArrow = button.querySelector(".arrow")
    const rightArrow = button.querySelector(".arrow.reverse")
    
    button.addEventListener("mouseenter", () => {
        leftArrow.style.marginRight = "-7px"
        rightArrow.style.marginLeft = "-6px"
    })

    button.addEventListener("mouseleave", () => {
        leftArrow.style.marginRight = "unset"
        rightArrow.style.marginLeft = "unset"
    })
});

topButtons.querySelectorAll("a").forEach(button => {
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

topButtons.querySelectorAll("div").forEach(block => {
    const buttons = block.querySelectorAll("a")
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            if (!button.classList.contains("inactive")){
                if (block.className === "Telegram") {
                    copyTextInsert("@TheHeartOfAkatosh")
                } else if (block.className === "Discord") {
                    copyTextInsert("@thoakatosh")
                }
                copyMessageToast()
                button.classList.add("inactive")
                setTimeout(() => {
                    button.classList.remove("inactive")
                }, 2500);
            }
        })      
    });
})