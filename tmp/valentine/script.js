function moveNoBox() {
    // Calcola una posizione casuale nello schermo
    const randomX = Math.random() * (window.innerWidth - 200);  // 200 è la larghezza della casella
    const randomY = Math.random() * (window.innerHeight - 50);  // 50 è l'altezza della casella

    // Applica la trasformazione per spostare la casella in quella posizione
    document.getElementById("no").style.transform = `translate(${randomX}px, ${randomY}px)`;
}

function celebrateYes() {
    // Creare cuoricini in modo casuale e aggiungerli al body
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement("div");
        heart.className = "heart";
        document.body.appendChild(heart);

        // Impostare posizione iniziale casuale del cuoricino
        const randomX = Math.random() * window.innerWidth;
        const randomY = Math.random() * window.innerHeight;
        heart.style.left = `${randomX}px`;
        heart.style.top = `${randomY}px`;

        // Rimuovere il cuoricino dopo l'animazione di caduta
        heart.addEventListener("animationend", function() {
            heart.remove();
        });
    }

    // Nascondere le scelte dopo la celebrazione
    document.querySelector('.choices').style.visibility = 'hidden';
}
