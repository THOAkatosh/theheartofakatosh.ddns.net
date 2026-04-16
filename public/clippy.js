const clippy = document.querySelector(".clippy");

const idleSrc = "image/clippy/idle.webm";

const animations = [
    "image/clippy/airplane.webm",
    "image/clippy/check.webm",
    "image/clippy/cool.webm",
    "image/clippy/eyes.webm",
    "image/clippy/leave.webm",
    "image/clippy/listen.webm",
    "image/clippy/music.webm",
    "image/clippy/noted.webm",
    "image/clippy/office.webm",
    "image/clippy/point_down.webm",
    "image/clippy/point_left.webm",
    "image/clippy/point_right.webm",
    "image/clippy/point_up.webm",
    "image/clippy/read.webm",
    "image/clippy/showel.webm",
    "image/clippy/sleep.webm",
    "image/clippy/spyglass.webm",
    "image/clippy/think.webm",
    "image/clippy/tired.webm",
    "image/clippy/wakeup.webm",
    "image/clippy/watch_front.webm",
    "image/clippy/watch_left.webm",
    "image/clippy/watch_right.webm",
    "image/clippy/weird.webm"
];

let isPlaying = false;

clippy.addEventListener("click", () => {
    if (isPlaying) return;

    isPlaying = true;

    const random =
        animations[Math.floor(Math.random() * animations.length)];

    clippy.src = random;
    clippy.loop = false;
    clippy.currentTime = 0;
    clippy.play();

    clippy.onended = () => {
        clippy.src = idleSrc;
        clippy.loop = true;
        clippy.currentTime = 0;
        clippy.play();

        isPlaying = false;
    };
});