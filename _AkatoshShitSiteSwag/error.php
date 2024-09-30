<!DOCTYPE html>
<html>
    <head>
        <link rel="icon" type="image/x-icon" href="https://theheartofakatosh.ddns.net/image/favicon.ico"></link>
        <style>
        body{
            background:#000000;
            display: flex;
            width: 100dvw;
            height: 100dvh;
            align-content: center;
            justify-content: center;
            align-items: center;
            position: fixed;
        }
        </style>
    </head>
    <body>
        <img id="meow">
        <script>
            var lefun = {
                "401": "401 - Unauthorized: Access is denied due to invalid credentials.",
                "403": "403 - Forbidden: Access is denied.",
                "404": "404 - File or directory not found.",
                '405': "405 - HTTP verb used to access this page is not allowed.",
                "406": "406 - Client browser does not accept the MIME type of the requested page.",
                "412": "412 - Precondition set by the client failed when evaluated on the Web server.",
                "431": "431 - Request header too long.",
                "500": "500 - Internal server error.",
                "501": "501 - Header values specify a method that is not implemented.",
                "502": "502 - Web server received an invalid response while acting as a gateway or proxy server.",
            }
            document.querySelector("#meow").setAttribute('src', "https://http.cat/" + <?= htmlspecialchars($_GET["err"]) ?> + ".jpg");
            document.title = lefun[<?= htmlspecialchars($_GET["err"]) ?>];
        </script>
    </body>
</html>