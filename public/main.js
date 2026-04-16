const clippy = document.querySelector(".clippy");
const clippyAnim = document.querySelector(".clippy-anim");
const links = document.querySelectorAll("a");

const idleSrc = "video/idle.webm";
const animations = [
    "video/airplane.webm",
    "video/check.webm",
    "video/cool.webm",
    "video/eyes.webm",
    "video/leave.webm",
    "video/listen.webm",
    "video/music.webm",
    "video/noted.webm",
    "video/office.webm",
    "video/point_down.webm",
    "video/point_left.webm",
    "video/point_right.webm",
    "video/point_up.webm",
    "video/read.webm",
    "video/showel.webm",
    "video/sleep.webm",
    "video/spyglass.webm",
    "video/think.webm",
    "video/tired.webm",
    "video/wakeup.webm",
    "video/watch_front.webm",
    "video/watch_left.webm",
    "video/watch_right.webm",
    "video/weird.webm"
];

const notifyAudio = new Audio('sound/notify.wav');
const clickAudio = new Audio('sound/click.wav');
const errorAudio = new Audio('sound/error.wav');

window.addEventListener("click", () => {
    clickAudio.play();
});

links.forEach(link => {
    if (link.className === "") { link.removeAttribute("class") }
    if (!link.classList.contains("current")) {
        if (link.hasAttribute("href")){
            const href = link.href;
            link.removeAttribute("href");
            link.addEventListener("click", () => {
                clickAudio.play();
                setTimeout(() => {window.location.href = href;}, 120)
            })
        }
    } else if(link.classList.contains("current")) {
        link.removeAttribute("href");
        link.addEventListener("click", () => {
            errorAudio.play();
        })
    }
});

let isPlaying = false;

clippy.addEventListener("click", () => {
    if (isPlaying) return;

    isPlaying = true;

    clippy.classList.add("hidden")
    clippyAnim.classList.add("show")
    notifyAudio.play();

    const random = animations[Math.floor(Math.random() * animations.length)];

    clippyAnim.src = random;
    clippyAnim.loop = false;
    clippyAnim.currentTime = 0;
    clippyAnim.play();

    clippyAnim.onended = () => {
        clippy.classList.remove("hidden")
        clippyAnim.classList.remove("show")
        isPlaying = false;
    };
});