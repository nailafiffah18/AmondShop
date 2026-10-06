/* ==================================================
   AMONSHOP - SCRIPT.JS
================================================== */

// ===============================
// DATA GAME
// ===============================

const gameData = {
    mobileLegends: {
        name: "Mobile Legends",
        currency: "Diamond",
        icon: "assets/ml-lgo.jpg",

        products: [
            { amount: 10, price: 3000 },
            { amount: 28, price: 8000 },
            { amount: 59, price: 16000 },
            { amount: 85, price: 23000 },
            { amount: 170, price: 45000 },
            { amount: 296, price: 75000 }
        ]
    },

    roblox: {
        name: "Roblox",
        currency: "Robux",
        icon: "assets/logo-roblox.png",

        products: [
            { amount: 80, price: 15000 },
            { amount: 160, price: 29000 },
            { amount: 240, price: 42000 },
            { amount: 400, price: 69000 },
            { amount: 800, price: 129000 },
            { amount: 1700, price: 249000 }
        ]
    }
};


// ===============================
// VARIABEL
// ===============================

let selectedGame = "mobileLegends";
let selectedProduct = null;
let selectedPayment = null;


// ===============================
// FORMAT RUPIAH
// ===============================

function formatRupiah(number) {
    return "Rp" + number.toLocaleString("id-ID");
}


// ===============================
// SCROLL KE PILIH GAME
// ===============================

function scrollToGames() {

    const section = document.querySelector("#games");

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// ===============================
// SCROLL KE TOP UP
// ===============================

function scrollToTopup() {

    const section = document.querySelector("#topup");

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// ===============================
// KONVERSI NAMA GAME
// ===============================

function getGameKey(game) {

    if (game === "Mobile Legends") {
        return "mobileLegends";
    }

    if (game === "Roblox") {
        return "roblox";
    }

    return game;
}


// ===============================
// PILIH GAME DARI CARD
// ===============================

function selectGame(game) {

    const gameKey = getGameKey(game);

    if (!gameData[gameKey]) {
        console.error("Game tidak ditemukan:", game);
        return;
    }

    selectedGame = gameKey;
    selectedProduct = null;

    updateGameDisplay();
    renderProducts();
    updateSummary();

    // Setelah pilih game, langsung menuju form top up
    scrollToTopup();
}


// ===============================
// GANTI GAME DI FORM TOP UP
// ===============================

function changeGame(game, button = null) {

    const gameKey = getGameKey(game);

    if (!gameData[gameKey]) {
        console.error("Game tidak ditemukan:", game);
        return;
    }

    selectedGame = gameKey;
    selectedProduct = null;

    // Update tombol aktif
    document.querySelectorAll(".select-game").forEach(btn => {
        btn.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    } else {

        const selectedButton = document.querySelector(
            `[data-game="${gameKey}"]`
        );

        if (selectedButton) {
            selectedButton.classList.add("active");
        }
    }

    updateGameDisplay();
    renderProducts();
    updateSummary();
}


// ===============================
// UPDATE TAMPILAN GAME
// ===============================

function updateGameDisplay() {

    const data = gameData[selectedGame];

    if (!data) return;


    // Update gambar game
    const selectedIcon =
        document.querySelector(".selected-icon img");

    if (selectedIcon) {
        selectedIcon.src = data.icon;
        selectedIcon.alt = data.name;
    }


    // Update nama game
    const selectedGameName =
        document.querySelector(".selected-game h3");

    if (selectedGameName) {
        selectedGameName.textContent = data.name;
    }


    // Tampilkan / sembunyikan Zone ID
    const zoneArea =
        document.querySelector("#zone-area");

    if (zoneArea) {

        if (selectedGame === "mobileLegends") {
            zoneArea.style.display = "block";
        } else {
            zoneArea.style.display = "none";
        }
    }
}


// ===============================
// TAMPILKAN PRODUK
// ===============================

function renderProducts() {

    const container =
        document.querySelector(".nominal-grid");

    if (!container) return;

    container.innerHTML = "";

    const data = gameData[selectedGame];

    if (!data) return;


    data.products.forEach(product => {

        const item =
            document.createElement("div");

        item.className = "nominal-item";

        item.innerHTML = `
            <strong>
                ${product.amount} ${data.currency}
            </strong>

            <span>
                ${formatRupiah(product.price)}
            </span>
        `;


        item.addEventListener("click", () => {

            document
                .querySelectorAll(".nominal-item")
                .forEach(el => {
                    el.classList.remove("active");
                });

            item.classList.add("active");

            selectedProduct = product;

            updateSummary();
        });


        container.appendChild(item);
    });
}


// ===============================
// PILIH PEMBAYARAN
// ===============================

function selectPayment(buttonOrPayment, paymentName) {

    let payment;


    // Jika dipanggil:
    // selectPayment(this, "QRIS")
    if (typeof buttonOrPayment !== "string") {

        payment = paymentName;

    } else {

        // Jika dipanggil:
        // selectPayment("QRIS")
        payment = buttonOrPayment;
    }


    selectedPayment = payment;


    // Hapus active dari semua pembayaran
    document
        .querySelectorAll(".payment")
        .forEach(button => {
            button.classList.remove("active");
        });


    // Jika tombol diklik langsung
    if (
        typeof buttonOrPayment !== "string" &&
        buttonOrPayment
    ) {

        buttonOrPayment.classList.add("active");

    } else {

        // Cari berdasarkan data-payment
        const selectedButton =
            document.querySelector(
                `[data-payment="${payment}"]`
            );

        if (selectedButton) {
            selectedButton.classList.add("active");
        }
    }


    updateSummary();
}


// ===============================
// UPDATE ORDER SUMMARY
// ===============================

function updateSummary() {

    const data = gameData[selectedGame];

    if (!data) return;


    // Game
    const gameName =
        document.querySelector(".selected-game h3");

    if (gameName) {
        gameName.textContent = data.name;
    }


    // Produk
    const productText =
        document.querySelector(
            ".order-line:nth-of-type(1) strong"
        );

    if (productText) {

        productText.textContent =
            selectedProduct
                ? `${selectedProduct.amount} ${data.currency}`
                : "Belum dipilih";
    }


    // Payment
    const paymentText =
        document.querySelector(
            ".order-line:nth-of-type(2) strong"
        );

    if (paymentText) {

        paymentText.textContent =
            selectedPayment || "Belum dipilih";
    }


    // Total
    const total =
        document.querySelector(".order-total strong");

    if (total) {

        total.textContent =
            selectedProduct
                ? formatRupiah(selectedProduct.price)
                : "Rp0";
    }
}


// ===============================
// BELI SEKARANG
// ===============================

function buyNow() {

    const userId =
        document.querySelector("#userId")?.value.trim();

    const zoneId =
        document.querySelector("#zoneId")?.value.trim();


    // Validasi User ID
    if (!userId) {

        showNotification(
            "ID Game belum diisi.",
            "warning"
        );

        document
            .querySelector("#userId")
            ?.focus();

        return;
    }


    // Validasi Zone ID Mobile Legends
    if (
        selectedGame === "mobileLegends" &&
        !zoneId
    ) {

        showNotification(
            "Zone ID belum diisi.",
            "warning"
        );

        document
            .querySelector("#zoneId")
            ?.focus();

        return;
    }


    // Validasi nominal
    if (!selectedProduct) {

        showNotification(
            "Silakan pilih nominal terlebih dahulu.",
            "warning"
        );

        return;
    }


    // Validasi pembayaran
    if (!selectedPayment) {

        showNotification(
            "Silakan pilih metode pembayaran.",
            "warning"
        );

        return;
    }


    // Semua lengkap
    showSuccessModal(
        userId,
        zoneId
    );
}


// ===============================
// SUCCESS MODAL
// ===============================

function showSuccessModal(userId, zoneId) {

    const modal =
        document.querySelector(".success-overlay");

    if (!modal) return;

    const data = gameData[selectedGame];


    // Support ID dengan "-" maupun camelCase
    const gameElement =
        document.querySelector("#success-game") ||
        document.querySelector("#successGame");

    const userElement =
        document.querySelector("#success-user") ||
        document.querySelector("#successUserId");

    const zoneElement =
        document.querySelector("#success-zone") ||
        document.querySelector("#successZoneId");

    const productElement =
        document.querySelector("#success-product") ||
        document.querySelector("#successProduct");

    const paymentElement =
        document.querySelector("#success-payment") ||
        document.querySelector("#successPayment");

    const totalElement =
        document.querySelector("#success-total") ||
        document.querySelector("#successTotal");


    // Game
    if (gameElement) {
        gameElement.textContent = data.name;
    }


    // User ID
    if (userElement) {
        userElement.textContent = userId;
    }


    // Zone ID
    if (zoneElement) {

        zoneElement.textContent =
            selectedGame === "mobileLegends"
                ? zoneId
                : "-";
    }


    // Produk
    if (productElement) {

        productElement.textContent =
            `${selectedProduct.amount} ${data.currency}`;
    }


    // Payment
    if (paymentElement) {

        paymentElement.textContent =
            selectedPayment;
    }


    // Total
    if (totalElement) {

        totalElement.textContent =
            formatRupiah(selectedProduct.price);
    }


    // Tampilkan modal
    modal.classList.add("show");

    document.body.style.overflow = "hidden";
}


// ===============================
// TUTUP MODAL
// ===============================

function closeSuccessModal() {

    const modal =
        document.querySelector(".success-overlay");

    if (!modal) return;

    modal.classList.remove("show");

    document.body.style.overflow = "";
}


// ===============================
// NOTIFICATION
// ===============================

function showNotification(
    message,
    type = "info"
) {

    const oldNotification =
        document.querySelector(".custom-notification");

    if (oldNotification) {
        oldNotification.remove();
    }


    const notification =
        document.createElement("div");

    notification.className =
        `custom-notification ${type}`;


    let icon = "ⓘ";

    if (type === "warning") {
        icon = "!";
    }

    if (type === "success") {
        icon = "✓";
    }


    notification.innerHTML = `
        <div class="notification-icon">
            ${icon}
        </div>

        <div>
            <strong>AmondShop</strong>

            <p>
                ${message}
            </p>
        </div>

        <button
            onclick="this.parentElement.remove()"
        >
            ×
        </button>
    `;


    document.body.appendChild(notification);


    setTimeout(() => {
        notification.classList.add("show");
    }, 10);


    setTimeout(() => {

        notification.classList.remove("show");

        setTimeout(() => {

            if (notification.parentElement) {
                notification.remove();
            }

        }, 300);

    }, 3500);
}


// ===============================
// KLIK LUAR MODAL
// ===============================

document.addEventListener(
    "click",
    function(event) {

        const modal =
            document.querySelector(".success-overlay");

        if (
            modal &&
            event.target === modal
        ) {

            closeSuccessModal();
        }
    }
);


// ===============================
// ESC UNTUK TUTUP MODAL
// ===============================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {
            closeSuccessModal();
        }
    }
);


// ===============================
// INISIALISASI
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // Render produk pertama
        renderProducts();

        // Update tampilan game
        updateGameDisplay();

        // Update summary
        updateSummary();


        // ===============================
        // DEFAULT GAME
        // ===============================

        const defaultGame =
            document.querySelector(
                `[data-game="mobileLegends"]`
            );

        if (defaultGame) {
            defaultGame.classList.add("active");
        }


        // ===============================
        // EVENT TOMBOL BELI
        // ===============================

        const buyButton =
            document.querySelector(".buy-button");

        if (buyButton) {

            buyButton.addEventListener(
                "click",
                buyNow
            );
        }


        // ===============================
        // TUTUP MODAL
        // ===============================

        const closeButton =
            document.querySelector(".close-modal");

        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeSuccessModal
            );
        }


        const successButton =
            document.querySelector(".success-button");

        if (successButton) {

            successButton.addEventListener(
                "click",
                closeSuccessModal
            );
        }


        // ===============================
        // TOMBOL GAME
        // ===============================

        document
            .querySelectorAll(".select-game")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function() {

                        const game =
                            this.dataset.game;

                        if (game) {
                            selectGame(game);
                        }
                    }
                );
            });


        // ===============================
        // TOMBOL PAYMENT
        // ===============================

        document
            .querySelectorAll(".payment")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function() {

                        const payment =
                            this.dataset.payment;

                        if (payment) {
                            selectPayment(payment);
                        }
                    }
                );
            });
    }
);