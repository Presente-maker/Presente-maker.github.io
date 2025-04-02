// Variável para controlar o evento de clique fora
let outsideClickHandler = null;

function showError(message) {
    const errorPopup = document.getElementById('error-popup');
    const errorMessage = document.getElementById('error-message');
    const errorClose = errorPopup.querySelector('.error__close');
    
    // Remove o handler anterior se existir
    if (outsideClickHandler) {
        document.removeEventListener('click', outsideClickHandler);
    }
    
    errorMessage.textContent = message;
    errorPopup.style.display = 'flex';
    
    // Fechar ao clicar no X
    errorClose.onclick = function() {
        errorPopup.style.display = 'none';
        if (outsideClickHandler) {
            document.removeEventListener('click', outsideClickHandler);
            outsideClickHandler = null;
        }
    };
    
    // Novo handler para clique fora
    outsideClickHandler = function(e) {
        if (!errorPopup.contains(e.target)) {
            errorPopup.style.display = 'none';
            document.removeEventListener('click', outsideClickHandler);
            outsideClickHandler = null;
        }
    };
    
    // Adiciona o event listener após um pequeno delay
    setTimeout(() => {
        document.addEventListener('click', outsideClickHandler);
    }, 10);
    
    // Fechar automaticamente após 5 segundos
    setTimeout(() => {
        errorPopup.style.display = 'none';
        if (outsideClickHandler) {
            document.removeEventListener('click', outsideClickHandler);
            outsideClickHandler = null;
        }
    }, 5000);
}

const mensagens = [
    "Oi minha princesa, este mini projetinho é para o mês mais especial do ano, o mês em que comemoramos 1 ano de namoro, nessa primeira cartinha não irei me estender muito apenas para te deixar na curiosidade. Espero que a senhorita não roube e veja no códido todas as mensagens de uma vez. Eu te amo muito e espero que a declaração diária durante este mês te deixe feliz.",
    "Surpresa do dia 2! ✨",
    "Que o dia 3 seja incrível! 🌟",
    // Continue até a mensagem 30...
    "Mensagem especial para o dia 27! 💖",  // Esta será substituída para o card especial
    // Continue até...
    "Última mensagem para o dia 30! 🎉"
];

mensagens[26] = "❤️ Mensagem SUPER especial para o dia 27/04! ❤️";




$(document).ready(function () {
    // Primeiro, carregue todas as imagens e depois inicialize o slider
    const imagePaths = [
        "images/imagem1.jpeg", "images/imagem2.jpeg", "images/imagem3.jpeg",
        "images/imagem4.jpeg", "images/imagem5.jpeg", "images/imagem6.jpeg",
        "images/imagem7.jpeg", "images/imagem8.jpeg", "images/imagem17.jpeg",
        "images/imagem18.jpeg", "images/imagem27.jpeg", "images/imagem9.jpeg",
        "images/imagem16.jpeg", "images/imagem19.jpeg", "images/imagem26.jpeg",
        "images/imagem10.jpeg", "images/imagem15.jpeg", "images/imagem20.jpeg",
        "images/imagem25.jpeg", "images/imagem11.jpeg", "images/imagem14.jpeg",
        "images/imagem21.jpeg", "images/imagem24.jpeg", "images/imagem12.jpeg",
        "images/imagem13.jpeg", "images/imagem22.jpeg", "images/imagem23.jpeg"
    ];

    const slider = document.getElementById("slider");

    // Carregar todas as imagens primeiro
    const loadImages = imagePaths.map(path => {
        return new Promise((resolve) => {
            convertImageToBase64(path, function (base64Image) {
                let imgElement = document.createElement("img");
                imgElement.src = base64Image;
                slider.appendChild(imgElement);
                resolve();
            });
        });
    });

    // Quando todas as imagens estiverem carregadas, inicialize o slider
    Promise.all(loadImages).then(() => {
        $('.slider').slick({
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000
        });
    });

    // Restante do seu código para as cartinhas
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const cardsContainer = document.getElementById("cards-container");

    for (let i = 1; i <= 30; i++) {
        const releaseDate = new Date(startDate);
        releaseDate.setDate(startDate.getDate() + i - 1);

        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");

        const text = document.createElement("p");
        text.innerText = `${i}`;
        text.dataset.message = mensagens[i - 1]; // Armazena a mensagem correspondente

        const coverDiv = document.createElement("div");
        coverDiv.classList.add("cover");

        // Verifica se é o dia 27/04
        const isSpecialDay = releaseDate.getDate() === 27 && releaseDate.getMonth() === 3;

        if (today < releaseDate) {
            coverDiv.classList.add("disabled");
            coverDiv.innerHTML = `<p>Disponível em ${releaseDate.toLocaleDateString()}</p>`;
        } else {
            coverDiv.innerHTML = isSpecialDay
    ? `<div class="special-content">
         <p>Clique para revelar</p>
         <button class="heart-button">
             <svg height="32" width="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                 <path d="M0 0H24V24H0z" fill="none"></path>
                 <path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"></path>
             </svg>
         </button>
       </div>`
    : `<p>Clique para revelar</p>`;
        }



        coverDiv.addEventListener("click", function () {
            if (today < releaseDate) {
                // Fecha qualquer pop-up existente antes de mostrar um novo
                const existingPopup = document.getElementById('error-popup');
                if (existingPopup) {
                    existingPopup.style.display = 'none';
                    if (outsideClickHandler) {
                        document.removeEventListener('click', outsideClickHandler);
                        outsideClickHandler = null;
                    }
                }
                showError(`Esta cartinha só poderá ser aberta em ${releaseDate.toLocaleDateString()}`);
            } else {
                this.classList.toggle('open');
                text.innerText = this.classList.contains('open')
                    ? text.dataset.message
                    : `Cartinha ${i}`;
            }
        });

        if (isSpecialDay && !(today < releaseDate)) {
            const heartButton = coverDiv.querySelector('.heart-button');
            heartButton.addEventListener('click', function (e) {
                e.stopPropagation();
                text.innerText = text.dataset.message; // Mostra a mensagem especial
            });
        }

        bookDiv.appendChild(text);
        bookDiv.appendChild(coverDiv);
        cardsContainer.appendChild(bookDiv);
    }
});

function convertImageToBase64(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
        let reader = new FileReader();
        reader.readAsDataURL(xhr.response);
        reader.onloadend = function () {
            callback(reader.result);
        };
    };
    xhr.send();
}


