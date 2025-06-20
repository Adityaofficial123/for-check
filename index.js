// 1. Imports
import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getDatabase, ref, push, onValue, remove
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
// ✅ Register service worker first
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js")
      .then(reg => console.log("✅ Service Worker registered:", reg))
      .catch(err => console.error("❌ Service Worker failed:", err));
  });
}
document.addEventListener("DOMContentLoaded", () => {


  const installBtn = document.getElementById("installBtn"); // desktop
  const mobileInstallBtn = document.getElementById("mobileInstallBtn"); // mobile
  const popup = document.getElementById("customInstallPrompt");
  const installNowBtn = document.getElementById("installNowBtn");
  const dismissBtn = document.getElementById("dismissInstallBtn");

  let deferredPrompt = null;

  const isAppInstalled = () =>
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  if (isAppInstalled()) {
    if (installBtn) installBtn.style.display = "none";
    if (mobileInstallBtn) mobileInstallBtn.style.display = "none";
    return;
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const shownBefore = localStorage.getItem("installPromptShown");
    if (!shownBefore && popup) {
      popup.style.display = "block";
      localStorage.setItem("installPromptShown", "true");
    }

    // Show buttons
    if (installBtn) installBtn.style.display = "inline-flex";
    if (mobileInstallBtn) mobileInstallBtn.style.display = "inline-flex";
window.addEventListener("appinstalled", () => {
  console.log("✅ App was installed");
  if (installBtn) installBtn.style.display = "none";
  if (mobileInstallBtn) mobileInstallBtn.style.display = "none";

document.getElementById('marketNavbarSearchbar')?.classList.add('shrinked');
document.getElementById('marketNavbarSearchbar')?.classList.remove('shrinked');


});

    const handleInstall = (btn) => {
      btn.addEventListener("click", () => {
        if (!deferredPrompt) {
          alert("⚠️ Install prompt not available.");
          return;
        }
        if (popup) popup.style.display = "none";
        btn.style.display = "none";
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choice) => {
          console.log(choice.outcome === 'accepted' ? '✅ Installed' : '❌ Dismissed');
          deferredPrompt = null;
        });
      });
    };

    // Assign install handler
    if (installBtn) handleInstall(installBtn);
    if (mobileInstallBtn) handleInstall(mobileInstallBtn);

    installNowBtn.addEventListener("click", () => {
      popup.style.display = "none";
      if (!deferredPrompt) {
        alert("⚠️ Install prompt not available.");
        return;
      }
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice) => {
        deferredPrompt = null;
      });
    });

    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => {
        popup.style.display = "none";
      });
    }
  });
});



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
// ✅ Use only this ONE auth state listener (merge all logic here)
let currentUser = null;
const loginBtn = document.getElementById('navbarLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
onAuthStateChanged(auth, user => {


  currentUser = user;
  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }

  const userEmailSpan = document.getElementById('userEmail');

  const trayLoginBtn = document.getElementById('trayLoginBtn');
  const trayLogoutBtn = document.getElementById('trayLogoutBtn');
  const trayUserEmail = document.getElementById('trayUserEmail');

  const mobileInstallBtn = document.getElementById('mobileInstallBtn');

  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block'; // ✅ Show logout everywhere
    if (userEmailSpan) {
      userEmailSpan.style.display = 'inline-block';
      userEmailSpan.textContent = `Your ID is - ${user.email}`;
    }

    if (trayLoginBtn) trayLoginBtn.style.display = 'none';
    if (trayLogoutBtn) trayLogoutBtn.style.display = 'block';
    if (trayUserEmail) trayUserEmail.textContent = user.email;

    // ✅ Show logoutBtn even in mobile layout
    if (window.innerWidth <= 480 && logoutBtn) {
      logoutBtn.style.display = 'inline-block';
    }

  } else {
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (userEmailSpan) userEmailSpan.style.display = 'none';

    if (trayLoginBtn) trayLoginBtn.style.display = 'block';
    if (trayLogoutBtn) trayLogoutBtn.style.display = 'none';
    if (trayUserEmail) trayUserEmail.textContent = 'Not logged in';

    if (mobileInstallBtn) mobileInstallBtn.style.display = 'none';
  }
});


// Desktop Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  signOut(auth);
});

// Tray Logout
document.getElementById('trayLogoutBtn')?.addEventListener('click', () => {
  signOut(auth);
});

// 3. Track current user globally

// tray
// Mobile Tray JavaScript
document.addEventListener('DOMContentLoaded', function () {
  const tray = document.getElementById('mobileTray');
  const closeTrayBtn = document.getElementById('closeTrayBtn');
  const trayCartBtn = document.getElementById('trayCartBtn');
  const trayAdminBtn = document.getElementById('trayAdminBtn');
  const trayLoginBtn = document.getElementById('trayLoginBtn');
  const trayLogoutBtn = document.getElementById('trayLogoutBtn');

  // Open tray
  document.querySelector('.market-navbar__hamburger').addEventListener('click', function () {
    tray.classList.add('open');
  });

  // Close tray
  closeTrayBtn.addEventListener('click', function () {
    tray.classList.remove('open');
  });

  // Cart button
  trayCartBtn.onclick = function () {
    window.location.href = 'cart.html';
  };

  // Admin button
  trayAdminBtn.onclick = function () {
    document.getElementById('adminLoginModal').style.display = 'block';
    tray.classList.remove('open');
  };

  // Login/Logout buttons
  trayLoginBtn.onclick = function () {
    document.getElementById('loginModal').style.display = 'block';
    tray.classList.remove('open');
  };

  trayLogoutBtn.onclick = () => {
    signOut(auth);
    tray.classList.remove('open');
  };
});

// 4. Login / Logout UI
document.getElementById('navbarLoginBtn').onclick = () =>
  document.getElementById('loginModal').style.display = 'block';
document.getElementById('logoutBtn').onclick = () => signOut(auth);

// 5. reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  size: 'invisible',
  callback: () => { }
});

// 6. Admin login
// const adminCreds = { username: "adminuser", password: " " };
// let isAdmin = false;
// document.getElementById("adminLoginBtn").onclick = () =>
//   document.getElementById("adminLoginModal").style.display = "block";
// document.getElementById("adminLoginSubmit").onclick = () => {
//   const u = document.getElementById("adminUsername").value;
//   const p = document.getElementById("adminPassword").value;
//   if (u === adminCreds.username && p === adminCreds.password) {
//     alert("✅ Admin logged in!"); isAdmin = true;
//     document.getElementById("adminLoginModal").style.display = "none";
//     displayProducts();
//   } else alert("❌ Invalid admin credentials.");
// };

// 7. Auth UI Logic (register/login/google)
document.getElementById('registerBtn').onclick = () => {
  const e = document.getElementById('authEmail').value,
    p = document.getElementById('authPassword').value;
  createUserWithEmailAndPassword(auth, e, p)
    .then(uc => sendEmailVerification(uc.user).then(() => {
      alert("✅ Verification sent, please check email.");
      document.getElementById('loginModal').style.display = 'none';
      signOut(auth);
    }))
    .catch(err => alert("❌ Registration failed: " + err.message));
};

document.getElementById('loginBtn').onclick = () => {
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      if (user.emailVerified) {
        document.getElementById('loginModal').style.display = 'none';

        document.getElementById('navbarLoginBtn').style.display = 'none';  // ✅ hides login button immediately

      } else {
        alert("❌ Please verify your email.");
        signOut(auth);
      }
    })
    .catch(err => alert("❌ Login failed: " + err.message));
};


document.getElementById('googleLoginBtn').onclick = () => {
  const prov = new GoogleAuthProvider();
  signInWithPopup(auth, prov)
    .then(() => { alert("✅ Google Sign-In successful!"); document.getElementById('loginModal').style.display = 'none'; })
    .catch(err => alert("❌ Google Sign-In failed: " + err.message));
};

// 8. SELL FORM SUBMISSION

const form = document.getElementById('sellForm');
const spinner = document.getElementById('loading-spinner');
const cloudName = 'dobzp321s';
const uploadPreset = 'your_upload_preset';

const sellerName = document.getElementById('sellerName').value.trim();
const sellerMobile = document.getElementById('sellerMobile').value.trim();
form.addEventListener('submit', async e => {
  e.preventDefault();

  if (!currentUser) {
    alert("Please log in to submit your product.");
    document.getElementById('loginModal').style.display = 'block';
    return;
  }

  spinner.style.display = 'block';

  const imageFile = document.getElementById("imageFile").files[0];
  if (!imageFile) {
    alert("Please select an image file.");
    spinner.style.display = 'none';
    return;
  }

  const fd = new FormData();
  fd.append('file', imageFile);
  fd.append('upload_preset', uploadPreset);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: fd
    });

    const data = await res.json();
    if (!data.secure_url) throw new Error('Cloudinary upload failed');

    const productImageUrl = data.secure_url; // This is the product image URL

    const orig = parseFloat(document.getElementById('productPrice').value);
    const disp = (orig * 1.025).toFixed(2);

    // Prepare objects
    const product = {
      product_name: document.getElementById('productName').value,
      category: document.getElementById('productCategory').value,
      price: disp,
      description: document.getElementById('productDescription').value,
      image_url: productImageUrl,
      seller_name: document.getElementById('sellerName').value,
      seller_mobile: document.getElementById('sellerMobile').value,
      submitted_by: currentUser.email
    };

    const seller = {
      seller_name: document.getElementById('sellerName').value,
      seller_mobile: document.getElementById('sellerMobile').value,
      submitted_by: currentUser.email
    };
    // Demo products
    if (product.isDemo) {
      card.querySelector('.price').innerHTML = `<del>₹${product.originalPrice}</del> <strong style="color:#388e3c;">₹0</strong>`;

      const demoLabel = document.createElement("div");
      demoLabel.className = "demo-label";
      demoLabel.innerHTML = "🧪 Demo Product – No Payment Required<br><span>Use Pay ID: <strong>pay_12345678</strong></span>";
      card.appendChild(demoLabel);
    }

    // 1. Store product details and get key
    const productRef = await push(ref(db, 'products'), product);
    const productKey = productRef.key;

    // 2. Store seller info (linked by product key)
    await push(ref(db, 'sellers'), { ...seller, product_key: productKey });



    // 4. Store buyer payment confirmation (empty at first, to be filled later)
    await push(ref(db, 'buyer_payments'), { product_key: productKey, status: "pending" });

    // 5. (Optional) Store in Google Sheet as before
    fetch('https://script.google.com/macros/s/AKfycbyVVpD3hZEWHmcgUtzcuLykXxYkLhe8q6QOqbo9bd_5tYr--aZdsn7IWWe56keR0TXC/exec', {
      method: 'POST',
      body: JSON.stringify(product),
      headers: { 'Content-Type': 'application/json' }
    });

    spinner.style.display = 'none';

    const fee = (orig * 1.05).toFixed(2);

    const modalHtml = `
  <div id="paymentPromptModal" class="modal" style="display:block;position:fixed;z-index:9999;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.5);">
    <div style="background:white;padding:20px;margin:auto;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:90%;max-width:500px;text-align:center;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.3);">
      <span id="closePaymentModal" style="position:absolute;top:10px;right:20px;cursor:pointer;font-size:24px">&times;</span>
      <h2>Complete Your Listing</h2>
       <p>Please pay ₹${fee} to list your product.</p>
      <img src="payment.jpg" alt="UPI QR" style="max-width:250px;margin:20px 0;"/>
      <p>UPI ID: <b>dipaktaywade3@okaxis</b></p>
      <form id="paymentProofForm">
        <input type="text" id="upiRef" placeholder="Enter UPI Reference ID" required style="width:90%;padding:10px;margin:10px 0;border-radius:6px;border:1px solid #ccc;"/>
        <p style="margin:10px 0;font-weight:bold;">Send proof screenshot</p>
        <input type="file" id="upiScreenshot" accept="image/*" required style="margin:10px 0;"/>
       <!-- Add this to your HTML -->
<style>
  button[type="submit"]:hover {
    background: #45a049; /* Slightly darker green */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add shadow effect */
    transition: background 0.3s, box-shadow 0.3s; /* Smooth transition */
  }
</style>

<!-- Button -->
<button type="submit" style="padding:10px 20px;background:#4CAF50;color:white;border:none;border-radius:6px;">Confirm Payment</button>
      </form>
    </div>
  </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);


    // Add listeners only after modal is added:
    const closeBtn = document.getElementById('closePaymentModal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const modal = document.getElementById('paymentPromptModal');
        if (modal) modal.remove();
      });
    }

    const paymentProofForm = document.getElementById('paymentProofForm');
    if (paymentProofForm) {
      paymentProofForm.addEventListener('submit', async event => {
        event.preventDefault();

        const upiRef = document.getElementById('upiRef').value.trim();
        const screenshotFile = document.getElementById('upiScreenshot').files[0];

        if (!upiRef || !screenshotFile) {
          alert("Please enter UPI Reference ID and upload screenshot.");
          return;
        }

        const spinner = document.getElementById('spinner');
        if (spinner) spinner.style.display = 'block';

        try {
          // Upload screenshot to Cloudinary
          const fd = new FormData();
          fd.append('file', screenshotFile);
          fd.append('upload_preset', uploadPreset);

          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: fd
          });

          const data = await res.json();
          if (!data.secure_url) throw new Error('Cloudinary upload failed');

          // ✅ JS code to send proper ISO-format IST time
          const paymentData = {
            product_key: productKey,
            user_email: currentUser.email,
            upi_ref: upiRef,
            screenshot_url: data.secure_url,
            timestamp: new Date().toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }).replace(' ', 'T'), // ✅ IST in ISO format
            status: "submitted",
            seller_name: document.getElementById('sellerName').value,
            seller_mobile: document.getElementById('sellerMobile').value
          };

          // 1. ✅ Save payment info to Firebase
          await push(ref(db, 'seller_payments'), paymentData);
          console.log("✅ Payment saved to Firebase!");


          try {
            // 🔽 Fetch full product info using productKey
            const productSnap = await get(ref(db, 'products/' + productKey));
            if (!productSnap.exists()) {
              alert("❌ Product not found in Firebase.");
              return;
            }

            const productData = productSnap.val();
            const sellerName = productData.seller_name || "Not Provided";
            const sellerMobile = productData.seller_mobile || "Not Provided";
            const productName = productData.product_name || "Unknown";
            const productImage = productData.image_url || "";
            const sellerEmail = currentUser.email;

            const response = await fetch('https://script.google.com/macros/s/AKfycby2Ntc0F-RYlHPS06hm0pzknoLvv_x5P4amj9HbNfeTyhs6MgVaheJcj6BpRigT-8uCHA/exec', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                seller_name: sellerName,
                seller_mobile: sellerMobile,
                seller_email: sellerEmail,
                product_name: productName,
                product_image: productImage,
                upi_ref: upiRef,
                confirmation_screenshot: data.secure_url,
                timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
              })
            });

            if (!response.ok) throw new Error("Google Sheet submission failed");
            const result = await response.json();
            console.log("✅ Google Sheet Success:", result);
          } catch (error) {
            console.error("❌ Google Sheet Error:", error);
            // alert("⚠️ Google Sheet submission failed. Please try again.");
          }

          alert("✅ Payment proof submitted ");
          document.getElementById('paymentPromptModal').remove();
          paymentProofForm.reset();
        } catch (err) {
          console.error("❌ Error submitting payment proof:", err);
          alert("❌ Error: " + err.message);
        } finally {
          if (spinner) spinner.style.display = 'none';
        }
      });
    }

    alert("✅ Product submitted successfully! Please complete the payment to list your product.");
    form.reset();
  } catch (err) {
    console.error("❌ Error submitting product:", err);
    alert("❌ Error: " + err.message);
  } finally {
    spinner.style.display = 'none';
  }
});

// --- FILTER & SORT LOGIC ---
const filterBtn = document.getElementById('filterBtn');
const filterDropdown = document.getElementById('filterDropdown');
const applyFilterBtn = document.getElementById('applyFilterBtn');
const sortSelect = document.getElementById('sortSelect');
let activeFilters = { categories: [], minPrice: null, maxPrice: null };
let activeSort = 'recent';

filterBtn.addEventListener('click', () => {
  filterDropdown.style.display = filterDropdown.style.display === 'block' ? 'none' : 'block';
});
document.addEventListener('click', (e) => {
  if (!filterDropdown.contains(e.target) && e.target !== filterBtn) {
    filterDropdown.style.display = 'none';
  }
});
applyFilterBtn.addEventListener('click', () => {
  const checked = Array.from(document.querySelectorAll('.filter-category:checked')).map(cb => cb.value);
  const minPrice = parseFloat(document.getElementById('minPrice').value) || null;
  const maxPrice = parseFloat(document.getElementById('maxPrice').value) || null;
  activeFilters = { categories: checked, minPrice, maxPrice };
  displayProducts(document.getElementById('searchInput').value.trim());
  filterDropdown.style.display = 'none';
});
sortSelect.addEventListener('change', () => {
  activeSort = sortSelect.value;
  displayProducts(document.getElementById('searchInput').value.trim());
});

// 9. FETCH & DISPLAY PRODUCTS (CATEGORY-WISE HORIZONTAL SCROLL FOR MOBILE)
function displayProducts(query = '') {
  const shopSection = document.getElementById('shopSection');
  const loadingSpinner = document.getElementById('product-loading-spinner');
  shopSection.innerHTML = '';
  if (loadingSpinner) loadingSpinner.style.display = 'block';
  onValue(ref(db, 'products'), snap => {
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    const products = [];
    snap.forEach(child => {
      const prod = child.val();
      prod.key = child.key;
      products.push(prod);
    });

    let filtered = products;
    if (query) {
      filtered = filtered.filter(p =>
        p.product_name?.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter(p => activeFilters.categories.includes(p.category));
    }

    if (activeFilters.minPrice !== null) {
      filtered = filtered.filter(p => parseFloat(p.price) >= activeFilters.minPrice);
    }
    if (activeFilters.maxPrice !== null) {
      filtered = filtered.filter(p => parseFloat(p.price) <= activeFilters.maxPrice);
    }

    if (activeSort === 'low') {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (activeSort === 'high') {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (activeSort === 'az') {
      filtered.sort((a, b) => (a.product_name || '').localeCompare(b.product_name || ''));
    } else if (activeSort === 'za') {
      filtered.sort((a, b) => (b.product_name || '').localeCompare(a.product_name || ''));
    } else if (activeSort === 'recent') {
      filtered.sort((a, b) => (b.key || '').localeCompare(a.key || ''));
    }
    // Group by category
    const categories = {};
    filtered.forEach(p => {
      if (!categories[p.category]) categories[p.category] = [];
      categories[p.category].push(p);
    });
    // For each category, create a section
    Object.keys(categories).forEach(cat => {
      const section = document.createElement('div');
      section.className = 'category-section';
      // Category title
      const title = document.createElement('div');
      title.className = 'category-title';
      title.textContent = cat;
      section.appendChild(title);
      // Horizontal scroll row
      const row = document.createElement('div');
      row.className = 'category-scroll-row';
      // Only render unique product names per category
      const seenNames = new Set();
      categories[cat].forEach(prod => {
        if (seenNames.has(prod.product_name)) return;
        seenNames.add(prod.product_name);
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
            <img class="product-image" src="${prod.image_url || 'image.png'}" alt="${prod.product_name}">
            <h3>${prod.product_name || ''}</h3>
            <p>${prod.description || ''}</p>
            <p><b>Price:</b> ₹${prod.price || '0.00'}</p>
            <p><b>Category:</b> ${prod.category || ''}</p>
          `;
        // Add click handler to proceed to payment page
        card.style.cursor = 'pointer';
       card.addEventListener('click', () => {
  const selected = {
    id: prod.key, // 🔑 ensure this gets passed
    product_name: prod.product_name,
    price: prod.price,
    description: prod.description,
    image_url: prod.image_url,
    category: prod.category
  };

  localStorage.setItem('selectedProduct', JSON.stringify(selected));
  window.location.href = 'payment.html';
});

        row.appendChild(card);
      });
      section.appendChild(row);
      shopSection.appendChild(section);
    });
  });
}
document.getElementById('categoryFilter').addEventListener('change', () => displayProducts(document.getElementById('searchInput').value.trim()));
document.getElementById('searchInput').addEventListener('input', e => displayProducts(e.target.value.trim()));
displayProducts();

const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const faqList = document.getElementById('faq-list');

const faqs = [
  ["🛒 How to list a product?", "Go to the Sell section, fill in your product info, and submit. You’ll be asked to pay a listing fee. After verification, your product goes live."],
  ["💳 How to confirm payment?", "After you list your product, a popup asks for UPI payment. Submit your UPI ID and screenshot. Our team verifies it manually."],
  ["🤝 Is it possible to negotiate the listing fee?", "Yes, if your listing fee exceeds ₹1000, you may professionally discuss a revised amount with the admin."],
  ["🛒 How can I buy a product?", "Click any product > Buy Now > enter your details and complete UPI payment. We’ll process your order once verified."],
  ["📏 Where to enter UPI Reference ID?", "After payment, a popup appears asking for the UPI reference. Paste it there and click submit."],
  ["🖼️ How to upload payment screenshot?", "When the modal appears after payment, click the Upload Screenshot button and submit the image."],
  ["📬 Can I edit product after listing?", "Currently, edits are not supported. Please delete and re-list with changes. If you need help, contact us at 📞 8766880183 or 📧 campusmart111@gmail.com."],
  ["📤 What if payment fails?", "Retry your payment. If money was deducted, contact us with the reference ID & screenshot."],
  ["☎️ Contact support?", "Email: campusmart111@gmail.com or call us at 8766880183. We’re here to assist you anytime!"]
];

faqs.forEach((faq, index) => {
  const wrapper = document.createElement('div');
  const btn = document.createElement('button');
  btn.classList.add('faq-button');
  btn.innerText = faq[0];
  const answer = document.createElement('div');
  answer.classList.add('faq-answer');
  answer.innerText = faq[1];
  btn.onclick = () => {
    const allAnswers = document.querySelectorAll('.faq-answer');
    allAnswers.forEach(a => a.style.display = 'none');
    answer.style.display = 'block';
  };
  wrapper.appendChild(btn);
  wrapper.appendChild(answer);
  faqList.appendChild(wrapper);
});
chatToggle.onclick = () => {
  chatWindow.classList.toggle('active');
};
chatClose.onclick = () => {
  chatWindow.classList.remove('active');
};
document.addEventListener('click', (e) => {
  if (!document.getElementById('modern-chatbot').contains(e.target) && chatWindow.classList.contains('active')) {
    chatWindow.classList.remove('active');
  }
});


// HEADLINES TO CYCLE THROUGH
const headlines = [
  "🎉 <strong>0 Listing Fees</strong> for a Limited Time! Upload Free for 1 Week!",
  "🚀 Join Now – Post Products Without Paying!",
  "🔥 One Week Free Listing! Boost Your Visibility",
  "💸 No Payment Required – Explore Seller Features",
  "📢 Demo Week: Create Listings Absolutely Free!"
];

let currentHeadline = 0;
const headlineEl = document.getElementById("headlineText");

setInterval(() => {
  currentHeadline = (currentHeadline + 1) % headlines.length;
  headlineEl.style.opacity = 0;
  setTimeout(() => {
    headlineEl.innerHTML = headlines[currentHeadline];
    headlineEl.style.opacity = 1;
  }, 400);
}, 4000);


// ✅ UNIVERSAL COUNTDOWN TIMER (Fixed for all users)
const countdown = document.getElementById("countdownTimer");
// Set your universal offer end date here 👇
const offerEndDate = new Date("2025-06-24T00:00:00").getTime();
function updateCountdown() {
  const now = new Date().getTime();
  const distance = offerEndDate - now;

  if (distance <= 0) {
    countdown.innerHTML = "🎉 Offer Ended!";
    return;
  }
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((distance % (1000 * 60)) / 1000);

  countdown.innerHTML = `⏳ ${days}d ${hrs}h ${mins}m ${secs}s left`;
}
updateCountdown();
setInterval(updateCountdown, 1000);

