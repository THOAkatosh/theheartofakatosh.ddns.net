let sortState = 0;
let originalOrder = [];
let keyboardCount = 1;
let totalMoneyLoss = 0;
let curWinLock = window.location.pathname;

function toggleNumbering(hide) {
    const numberings = document.querySelectorAll("#listHolder .board .numbering");
    numberings.forEach(num => {
        num.style.opacity = hide ? 0 : 0.5;
    });
}

document.getElementById("sortHolder").querySelector("input").addEventListener("input", function(e) {
    const searchText = e.target.value.toLowerCase().trim();
    
    if (searchText !== "" && sortState !== 0) {
        resetSorting();
    }
    
    const boards = document.querySelectorAll("#listHolder .board");
    
    boards.forEach(board => {
        const link = board.querySelector("a.keyboard-name");
        if (link) {
            const text = link.textContent.toLowerCase();
            if (searchText === "" || text.includes(searchText)) {
                board.style.display = "";
            } else {
                board.style.display = "none";
            }
        }
    });
    
    const brandHeaders = document.querySelectorAll("#listHolder h2.brand-header");
    brandHeaders.forEach(header => {
        let nextSibling = header.nextSibling;
        let hasVisibleBoards = false;
        
        while (nextSibling) {
            if (nextSibling.nodeType === 1 && nextSibling.tagName === 'H2') break;
            if (nextSibling.nodeType === 1 && nextSibling.classList.contains('board') && nextSibling.style.display !== 'none') {
                hasVisibleBoards = true;
                break;
            }
            nextSibling = nextSibling.nextSibling;
        }
        
        header.style.display = hasVisibleBoards ? '' : 'none';
    });
    
    if (searchText !== "") {
        toggleNumbering(true);
    } else if (sortState === 0) {
        toggleNumbering(false);
    }
});

function resetSorting() {
    const listHolder = document.getElementById("listHolder");
    const brandSortButton = document.getElementById("brandSortButton")
    const headers = listHolder.querySelectorAll("h2.brand-header");
    headers.forEach(header => header.remove());

    brandSortButton.textContent = "Sort: OFF"

    listHolder.innerHTML = '';
    originalOrder.forEach(element => {
        listHolder.appendChild(element);
    });
    
    sortState = 0;
    toggleNumbering(false);
}

function applySorting(state) {
    const listHolder = document.getElementById("listHolder");
    const brandSortButton = document.getElementById("brandSortButton")
    const boards = Array.from(listHolder.querySelectorAll(".board"));
    
    if (sortState === 0) {
        originalOrder = [...boards];
    }
    
    const boardsByBrand = {};
    boards.forEach(board => {
        const brand = board.getAttribute("data-kb-brand");
        if (!boardsByBrand[brand]) {
            boardsByBrand[brand] = [];
        }
        boardsByBrand[brand].push(board);
    });
    
    listHolder.innerHTML = '';
    
    let brandOrder;
    if (state === 1) {
        brandSortButton.textContent = "Sort: By Brand"
        brandOrder = Object.keys(boardsByBrand).sort();
    } else if (state === 2) {
        brandSortButton.textContent = "Sort: By Brand & Quantity"
        brandOrder = Object.keys(boardsByBrand).sort((a, b) => {
            return boardsByBrand[b].length - boardsByBrand[a].length;
        });
    }
    
    brandOrder.forEach(brand => {
        const brandHeader = document.createElement("h2");
        brandHeader.innerHTML = `${brand}<span>${boardsByBrand[brand].length}</span>`;
        brandHeader.className = "brand-header";
        brandHeader.style.color = boardsByBrand[brand][0].querySelector("a").style.color;
        listHolder.appendChild(brandHeader);
        
        boardsByBrand[brand].forEach(board => {
            listHolder.appendChild(board);
        });
    });
    
    sortState = state;
    toggleNumbering(true);
}

document.getElementById("brandSortButton").addEventListener("click", function() {
    const nextState = (sortState + 1) % 3;
    
    if (nextState === 0) {
        resetSorting();
    } else {
        applySorting(nextState);
    }
});

document.querySelector("link[rel*='icon']").href = "image/kb-favicon.ico"

fetch(curWinLock == '/boards' ? 'boards.json' : curWinLock == '/wish-boards' ? '/wish-boards.json' : '')
    .then(response => response.json())
    .then(boards => {
        const listHolder = document.getElementById("listHolder");
        listHolder.innerHTML = '';
        keyboardCount = 1;
        
        boards.forEach((element) => {
            if (element["Brand"].length < 1) { return }

            let brand = element["Brand"];
            let name = element["Name"];
            let sw_type = element["Switch_Type"];
            let sw = element["Switch"] != "" ? element["Switch"] : element["Switch_Type"]; 
            let price = element["Price"];
            let brand_col = element["Brand_Color"].replace("\r", "");
            let sw_type_col = element["Switch_Type_Color"].replace("\r", "");
            let sw_col = element["Switch_Color"].replace("\r", "");
            let img_dir = element["Img_Dir"];

            if (!isNaN(parseFloat(price))) {
                totalMoneyLoss += parseFloat(price);
            }

            let elm = document.createElement("div");
            elm.className = "board";
            elm.setAttribute("data-kb-brand", brand)
            elm.setAttribute("data-kb-name", name)

            let fullname = document.createElement("a");
            fullname.innerHTML = `${brand} ${name}`;
            fullname.className = "keyboard-name"
            fullname.style.color = brand_col;
            elm.appendChild(fullname);

            let imageSrc = `${img_dir}/base.jpg`.replaceAll(" ", "%20");
            let imgcontainer = document.createElement("div");
            imgcontainer.className = "imgcontainer";

            let blurImage = document.createElement("img");
            blurImage.className = "img-blur";
            blurImage.src = imageSrc;
            imgcontainer.appendChild(blurImage);

            let image = document.createElement("img");
            image.src = imageSrc;
            imgcontainer.appendChild(image);
            elm.appendChild(imgcontainer);

            imgcontainer.addEventListener('click', function (e) {
                clickAudio.play();
                e.stopPropagation();
                showKeyboardCard(element, imageSrc);
            });

            let numbering = document.createElement("a");
            numbering.className = "numbering";
            numbering.innerHTML = `${keyboardCount}`;
            elm.appendChild(numbering);
            keyboardCount += 1;

            let switchtype = document.createElement("a");
            switchtype.innerHTML = `Type: <span style="color:${sw_type_col}">${sw_type}</span>`;
            elm.appendChild(switchtype);

            let switchname = document.createElement("a");
            switchname.innerHTML = `Switch: <span style="color:${sw_col}">${sw}</span>`;
            elm.appendChild(switchname);

            listHolder.appendChild(elm);
        });
    })
    .then(data => {
        if (curWinLock == '/boards') {
            let sortHolder = document.getElementById("sortHolder");
            let moneyLoss = document.createElement("a");
            moneyLoss.className = "moneyLoss";
            moneyLoss.innerHTML = `🔥TOTAL MONEY LOSS: ${totalMoneyLoss} RUB🔥`
            sortHolder.before(moneyLoss);
        }
    })
    .catch(error => console.error('Ошибка загрузки JSON:', error));

async function showKeyboardCard(keyboardData, mainImageSrc) {

    fetch(`/api/get-board-img?path=${keyboardData.Img_Dir.split('/')[1]}&board=${keyboardData.Img_Dir.split('/').pop()}`)
        .then(res => res.json())
        .then(async data => {

            const boardImgList = data.files;

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
            if (boardImgList.includes('base.jpg')) {
                availableImages.push('base.jpg');
            }  
            boardImgList.forEach(file => {
                if (file !== 'base.jpg' && file !== 'arrows.jpg') {
                    availableImages.push(file);
                }
            });          
            if (boardImgList.includes('arrows.jpg')) {
                availableImages.push('arrows.jpg');
            }
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
            switches.innerHTML = `Switches: <span style="color:${keyboardData.Switch_Color}">${keyboardData.Switch != "" ? keyboardData.Switch : keyboardData.Switch_Type}</span>`;
            card_desc.appendChild(switches);

            if (curWinLock == "/boards") {
                const price = document.createElement('p');
                price.className = 'card_desc_price';
                let priceText;
                const priceValue = keyboardData.Price;
                if (priceValue === '0' || priceValue.toString().toLowerCase() === 'free') {
                    priceText = 'Free';
                } else if (!priceValue) {
                    priceText = 'Free?';
                } else if (!isNaN(parseFloat(priceValue))) {
                    priceText = `${parseFloat(priceValue)} RUB`;
                } else {
                    priceText = priceValue;
                }
                price.innerHTML = `Price: <span>${priceText}</span>`;
                card_desc.appendChild(price);
            }
            
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
    });
}