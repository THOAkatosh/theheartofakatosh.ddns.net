var count = 1;
var totalMoneyLoss = 0;

document.querySelector("link[rel*='icon']").href = "image/kb-favicon.ico"

fetch('wish_boards.json')
    .then(response => response.json())
    .then(boards => {
        boards.forEach((element) => {
            if (element["Brand"].length < 1) { return }

            var brand = element["Brand"];
            var name = element["Name"];
            var sw_type = element["Switch_Type"];
            var sw = element["Switch"].replace("<------------------", element["Switch_Type"]);
            // var price = element["Price"];
            // var description = element["Description"];
            var brand_col = element["Brand_Color"].replace("\r", "");
            var sw_type_col = element["Switch_Type_Color"].replace("\r", "");
            var sw_col = element["Switch_Color"].replace("\r", "");
            var img_dir = element["Img_Dir"];

            // if (!isNaN(parseFloat(price))) {
            //     totalMoneyLoss += parseFloat(price);
            // }

            var elm = document.createElement("div");
            elm.className = "board";
            elm.id = `${brand}__${name}`.toLowerCase().replaceAll(" ", "_");

            var fullname = document.createElement("a");
            fullname.innerHTML = `${brand} ${name}`;
            fullname.className = "keyboard-name"
            fullname.style.color = brand_col;
            elm.appendChild(fullname);

            var imageSrc = `${img_dir}/base.jpg`.replaceAll(" ", "%20");
            var imgcontainer = document.createElement("div");
            imgcontainer.className = "imgcontainer";

            var blurImage = document.createElement("img");
            blurImage.className = "img-blur";
            blurImage.src = imageSrc;
            imgcontainer.appendChild(blurImage);

            var image = document.createElement("img");
            image.src = imageSrc;
            imgcontainer.appendChild(image);
            elm.appendChild(imgcontainer);

            imgcontainer.addEventListener('click', function (e) {
                clickAudio.play();
                e.stopPropagation();
                showKeyboardCard(element, imageSrc);
            });

            var numbering = document.createElement("a");
            numbering.className = "numbering";
            numbering.innerHTML = `${count}`;
            elm.appendChild(numbering);
            count += 1;

            var switchtype = document.createElement("a");
            switchtype.innerHTML = `Type: <span style="color:${sw_type_col}">${sw_type}</span>`;
            elm.appendChild(switchtype);

            var switchname = document.createElement("a");
            switchname.innerHTML = `Switch: <span style="color:${sw_col}">${sw}</span>`;
            elm.appendChild(switchname);

            document.getElementById("list_holder").appendChild(elm);
        });
    })
    // .then(data => {
    //     var title = document.querySelector('.title');
    //     var moneyLoss = document.createElement("a");
    //     moneyLoss.className = "moneyLoss";
    //     moneyLoss.innerHTML = `🔥TOTAL MONEY LOSS: ${totalMoneyLoss} RUB🔥`
    //     title.after(moneyLoss);
    // })
    .catch(error => console.error('Ошибка загрузки JSON:', error));

///////////////////////////////////////
// SPOOKY SCARY SKELETONS DOWN THERE //
///////////////////////////////////////

async function showKeyboardCard(keyboardData, mainImageSrc) {
    const overlay = document.createElement('div');
    overlay.className = 'card-overlay';

    const card = document.createElement('div');
    card.className = 'keyboard-card';

    const title = document.createElement('h2');
    title.textContent = `${keyboardData.Brand} ${keyboardData.Name}`;
    title.style.color = keyboardData.Brand_Color;
    card.appendChild(title);

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-card';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    card.appendChild(closeBtn);

    const carousel = document.createElement('div');
    carousel.className = 'carousel';

    const imgDir = keyboardData.Img_Dir.replaceAll(" ", "%20");
    const availableImages = [];

    async function checkImage(imageName) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = `${imgDir}/${imageName}`;
            img.onload = function () {
                if (this.width > 0) {
                    availableImages.push(imageName);
                    resolve(true);
                }
            };
            img.onerror = function () {
                resolve(false);
            };
            setTimeout(() => {
                if (!img.complete) {
                    resolve(false);
                }
            }, 500);
        });
    }

    await checkImage('base.jpg');
    // await checkImage('arrows.jpg');

    // const additionalImages = [];
    // for (let i = 1; i <= 8; i++) {
    //     additionalImages.push(`misc_${i}.jpg`);
    // }

    // additionalImages.push('detail.jpg', 'back.jpg', 'side.jpg', 'angle.jpg');

    // for (const imgName of additionalImages) {
    //     await checkImage(imgName);
    // }

    if (availableImages.length === 0) {
        availableImages.push('base.jpg');
    }

    const currentImgContainer = document.createElement('div');
    currentImgContainer.className = 'carousel-img-container';

    const navContainer = document.createElement('div');
    navContainer.className = 'carousel-nav';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-btn prev';
    if (availableImages.length <= 1) {
        prevBtn.classList.add("disabled")
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-btn next';
    if (availableImages.length <= 1) {
        nextBtn.classList.add("disabled")
    }

    const imgCounter = document.createElement('span');
    imgCounter.className = 'carousel-counter';
    imgCounter.textContent = `1/${availableImages.length}`;

    navContainer.appendChild(prevBtn);
    navContainer.appendChild(imgCounter);
    navContainer.appendChild(nextBtn);

    carousel.appendChild(currentImgContainer);
    carousel.appendChild(navContainer);
    card.appendChild(carousel);

    let currentIndex = 0;
    let currentViewer = null;

    async function showImage(index) {
        if (availableImages.length === 0 || index < 0 || index >= availableImages.length) return;

        if (currentViewer) {
            currentViewer.destroy();
            currentViewer = null;
        }

        currentIndex = index;
        const imagePath = `${imgDir}/${availableImages[index]}`;

        currentImgContainer.innerHTML = '';

        const blurImage = document.createElement('img');
        blurImage.className = 'img-blur';
        blurImage.src = imagePath;
        currentImgContainer.appendChild(blurImage);

        const mainImg = document.createElement('img');
        mainImg.src = imagePath;
        mainImg.alt = `${keyboardData.Brand} ${keyboardData.Name}`;
        currentImgContainer.appendChild(mainImg);

        imgCounter.textContent = `${currentIndex + 1}/${availableImages.length}`;

        if (currentIndex === 0) {
            prevBtn.classList.add("disabled")
        } else if (prevBtn.classList.contains("disabled")) {
            prevBtn.classList.remove("disabled")
        }

        if (currentIndex === availableImages.length - 1) {
            nextBtn.classList.add("disabled")
        } else if (nextBtn.classList.contains("disabled")) {
            nextBtn.classList.remove("disabled")
        }

        mainImg.onload = function () {
            if (this.width > 0) {
                currentViewer = new Viewer(mainImg, {
                    toolbar: false,
                    navbar: false,
                    button: false
                });
                const clickHandler = function (e) {
                    clickAudio.play();
                    e.stopPropagation();
                    currentViewer.show();
                };
                currentImgContainer.addEventListener('click', clickHandler);
                currentImgContainer._clickHandler = clickHandler;
            }
        };
        mainImg.onerror = function () {
            if (availableImages.length > 1) {
                showImage((index + 1) % availableImages.length);
            }
        };
    }

    prevBtn.addEventListener('click', () => {
        if (prevBtn.classList.contains("disabled")){ 
            errorAudio.play();
        } else if (currentIndex > 0) {
            showImage(currentIndex - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (nextBtn.classList.contains("disabled")){ 
            errorAudio.play();
        } else if (currentIndex < availableImages.length - 1) {
            showImage(currentIndex + 1);
        }
    });

    showImage(0);

    const card_desc = document.createElement('div');
    card_desc.className = 'keyboard-description';

    const switchType = document.createElement('p');
    switchType.innerHTML = `Switch Type: <span style="color:${keyboardData.Switch_Type_Color}">${keyboardData.Switch_Type}</span>`;
    card_desc.appendChild(switchType);

    const switches = document.createElement('p');
    switches.innerHTML = `Switches: <span style="color:${keyboardData.Switch_Color}">${keyboardData.Switch.replace("<------------------", keyboardData.Switch_Type)}</span>`;
    card_desc.appendChild(switches);

    // const description = document.createElement('p');
    // description.innerHTML = `<strong>Description:</strong> <span>${keyboardData.Description}</span>`;
    // card_desc.appendChild(description);

    // const price = document.createElement('p');
    // price.className = 'card_desc_price';
    // let priceText;
    // const priceValue = keyboardData.Price;
    // if (priceValue === '0' || priceValue.toString().toLowerCase() === 'free') {
    //     priceText = 'Free';
    // } else if (!priceValue) {
    //     priceText = 'Free?';
    // } else if (!isNaN(parseFloat(priceValue))) {
    //     priceText = `${parseFloat(priceValue)} RUB`;
    // } else {
    //     priceText = priceValue;
    // }
    // price.innerHTML = `<strong>Price:</strong> <span>${priceText}</span>`;
    // card_desc.appendChild(price);

    card.appendChild(card_desc);
    overlay.appendChild(card);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            if (currentViewer) {
                currentViewer.destroy();
            }
            document.body.removeChild(overlay);
        }
    });

    document.body.appendChild(overlay);
}