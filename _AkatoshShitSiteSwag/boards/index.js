async function loadCSV() {
    try {
        const response = await fetch('boards.csv');
        if (!response.ok) {
            throw new Error('Ошибка при загрузке файла CSV');
        }
        const csvText = await response.text();
        const rows = csvText.split('\n').map(row => row.split(',')).slice(1);
        
        rows.forEach((element) => {

            if (element[0].length < 1) { return }

            var brand = element[0];
            var name = element[1];
            var sw_type = element[2];
            var sw = element[3].replace("<------------------", element[2]);
            var brand_col = element[7].replace("\r", "");
            var sw_type_col = element[8].replace("\r", "");
            var sw_col = element[9].replace("\r", "");

            var elm = document.createElement("div");
            elm.className = "board";
            elm.id = `${brand}__${name}`.toLowerCase().replaceAll(" ", "_");

            var fullname = document.createElement("a");
            fullname.innerHTML = `${brand} ${name}`;
            fullname.style.color = brand_col;
            elm.appendChild(fullname);

            var imgcontainer = document.createElement("div");
            imgcontainer.className = "imgcontainer";
            var image = document.createElement("img");
            image.src = `img/${brand}%20${name}.jpg`.replaceAll(" ", "%20");
            imgcontainer.appendChild(image);
            elm.appendChild(imgcontainer);

            var imageView = new Viewer(image, {
                toolbar: false, navbar: false, button: false
            });
            imgcontainer.addEventListener('click', function() {
                imageView.show()
            });

            var switchtype = document.createElement("a");
            switchtype.innerHTML = `Type: ${sw_type}`;
            switchtype.style.color = sw_type_col;
            elm.appendChild(switchtype);

            var switchname = document.createElement("a");
            switchname.innerHTML = `Switch: ${sw}`;
            switchname.style.color = sw_col;
            elm.appendChild(switchname);

            document.getElementById("list_holder").appendChild(elm);
        });
        console.log(rows);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

loadCSV();