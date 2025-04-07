const aappii = '/api/raldfurniture';
const token = localStorage.getItem("token");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

window.onload = function() {
    fetchCategories();
}

const toggleIcon = document.querySelector('.toggle-icon');
const buttonContainer = document.querySelector('.bd-product__filter-style.furniture-trendy__tab.nav.nav-tabs.index-tabBtns-container');

toggleIcon.addEventListener('click', () => {
  buttonContainer.classList.toggle('hidden');
});

async function applyStyles() {
    const header = $0;
  
    await setElementStyles(header, {
      'transition': 'all 0.8s ease',
      'justify-content': 'flex-end',
      'gap': '20px',
    });
  
    // Modify active button border
    const buttonContainer = header.querySelector('.bd-product__filter-style.furniture-trendy__tab.nav.nav-tabs.index-tabBtns-container');
    if (buttonContainer) {
      const buttons = buttonContainer.querySelectorAll('.nav-link');
      buttons.forEach(async button => {
        await setElementStyles(button, {
          'display': 'inline-block',
          'margin-right': '20px',
        });
      });
    }
  }
  
  applyStyles();


function fetchCategories(){
    fetch(`${aappii}/categories/parents`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        fetchCategoriesAndProducts(data);
    })
    .catch(err => console.error("Error fetching categories: ", err));
}

async function fetchCategoriesAndProducts(categories) {
    try {
        const tabsBtns = document.querySelector(".index-tabBtns-container");
        const productTabs = document.querySelector(".index-tabProducts-container");

        tabsBtns.innerHTML = "";
        productTabs.innerHTML = "";

        categories.forEach((category, index) => {
            const isActive = index === 0 ? "active" : "";
            const fadeClass = index === 0 ? "active show" : " ";

            // Add Category Tab
            tabsBtns.innerHTML += `
                <button class="nav-link ${isActive}" id="${category.name}-tab" data-bs-toggle="tab" 
                    data-bs-target="#${category._id}" type="button" role="tab" aria-selected="${index === 0}" style="text-transform: capitalize;">
                    ${category.name}
                </button>
            `;

            // Create Product Tab (Initially Empty)
            productTabs.innerHTML += `
                <div class="tab-pane fade ${fadeClass}" id="${category._id}" role="tabpanel" aria-labelledby="${category._id}-tab">
                    <div class="row g-4" id="products-${category._id}">Loading...</div>
                </div>
            `;

            // Fetch products for each category
            fetchProducts(category._id);
        });

    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Step 3: Fetch products for a category and populate its tab
async function fetchProducts(categoryId) {
    try {
        const response = await fetch(`${aappii}/products?categories=${categoryId}`);
        const products = await response.json();

        const productsContainer = document.getElementById(`products-${categoryId}`);
        productsContainer.innerHTML = "";

        if (products.length === 0) {
            productsContainer.innerHTML = "<p>No products found.</p>";
            return;
        }

        products.forEach(product => {
            productsContainer.innerHTML += `
                <div class="col-xxl-3 col-lg-3 col-md-4 col-sm-6 col-6">
                    <div class="product-item furniture__product">
                        <!--<div class="product-badge">
                            <span class="product-trending">
                            ${product.originalprice > product.price ? `${Math.round(((product.originalprice - product.price) / product.originalprice) * 100)}% Off`: "New"}
                            </span>
                        </div>-->
                        <div class="product-thumb theme-bg-2">
                            <a href="#!"><img src="${product.image}" alt=""></a>
                            <div class="product-action-item">
                                <button type="button" class="product-action-btn index-add-cart" data-id="${product._id}" data-price="${product.price}">
                                    <svg width="20" height="22" viewBox="0 0 20 22" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                        d="M13.0768 10.1416C13.0768 11.9228 11.648 13.3666 9.88542 13.3666C8.1228 13.3666 6.69401 11.9228 6.69401 10.1416M1.375 5.84163H18.3958M1.375 5.84163V12.2916C1.375 19.1359 2.57494 20.3541 9.88542 20.3541C17.1959 20.3541 18.3958 19.1359 18.3958 12.2916V5.84163M1.375 5.84163L2.91454 2.73011C3.27495 2.00173 4.01165 1.54163 4.81754 1.54163H14.9533C15.7592 1.54163 16.4959 2.00173 16.8563 2.73011L18.3958 5.84163"
                                        stroke="white" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    </svg>
                                    <span class="product-tooltip" >Add to Cart</span>
                                </button>
                                <button type="button" class="product-action-btn" data-bs-toggle="modal" data-bs-target="#producQuickViewModal" data-product-id="${product._id}">

                        <svg width="26" height="18" viewBox="0 0 26 18" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.092 4.55026C10.5878 4.55026 8.55683 6.58125 8.55683 9.08541C8.55683 11.5896 10.5878 13.6206 13.092 13.6206C15.5961 13.6206 17.6271 11.5903 17.6271 9.08541C17.6271 6.5805 15.5969 4.55026 13.092 4.55026ZM13.092 12.1089C11.4246 12.1089 10.0338 10.7196 10.0338 9.05216C10.0338 7.38473 11.3898 6.02872 13.0572 6.02872C14.7246 6.02872 16.0807 7.38473 16.0807 9.05216C16.0807 10.7196 14.7594 12.1089 13.092 12.1089ZM25.0965 8.8768C25.0875 8.839 25.092 8.79819 25.0807 8.76115C25.0761 8.74528 25.0655 8.73621 25.0603 8.7226C25.0519 8.70144 25.0542 8.67574 25.0429 8.65533C22.8441 3.62131 18.1064 0.724854 13.0572 0.724854C8.00807 0.724854 3.17511 3.61677 0.975559 8.65079C0.966488 8.67196 0.968 8.69388 0.959686 8.71806C0.954395 8.73318 0.943812 8.74074 0.938521 8.7551C0.927184 8.7929 0.931719 8.83296 0.92416 8.8715C0.910555 8.93953 0.897705 9.00605 0.897705 9.07483C0.897705 9.14361 0.910555 9.20862 0.92416 9.2774C0.931719 9.31519 0.926428 9.35677 0.938521 9.39229C0.943057 9.40968 0.954395 9.41648 0.959686 9.4316C0.967244 9.45201 0.965732 9.4777 0.975559 9.49887C3.17511 14.5314 7.96121 17.381 13.0104 17.381C18.0595 17.381 22.8448 14.5374 25.0436 9.5034C25.055 9.48148 25.0527 9.45956 25.061 9.43538C25.0663 9.42253 25.0761 9.4127 25.0807 9.39758C25.092 9.36055 25.089 9.32049 25.0965 9.28118C25.1101 9.21315 25.1222 9.14739 25.1222 9.0771C25.1222 9.01058 25.1094 8.94482 25.0958 8.87604L25.0965 8.8768ZM13.0104 15.8692C8.72841 15.8692 4.51298 13.6123 2.44193 9.07407C4.49333 4.55177 8.76469 2.23582 13.0572 2.23582C17.349 2.23582 21.5251 4.55404 23.5773 9.07861C21.5266 13.6002 17.3036 15.8692 13.0104 15.8692Z"
                                fill="white" />
                        </svg>
                        <span class="product-tooltip">Quick View</span>
                    </button>
                                <button type="button" class="product-action-btn">

                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M19.2041 2.63262C18.6402 1.97669 17.932 1.44916 17.1305 1.08804C16.329 0.726918 15.4541 0.54119 14.569 0.544237C13.0545 0.500151 11.58 1.01577 10.4489 1.98501C9.31782 1.01577 7.84334 0.500151 6.32883 0.544237C5.44368 0.54119 4.56885 0.726918 3.76735 1.08804C2.96585 1.44916 2.25764 1.97669 1.69374 2.63262C0.712132 3.77732 -0.314799 5.84986 0.366045 9.22751C1.45272 14.6213 9.60121 19.0476 9.94523 19.2288C10.0986 19.311 10.2713 19.3541 10.4469 19.3541C10.6224 19.3541 10.7951 19.311 10.9485 19.2288C11.2946 19.0436 19.4431 14.6173 20.5277 9.22751C21.2126 5.84986 20.1857 3.77732 19.2041 2.63262ZM18.5099 8.85122C17.7415 12.6646 12.1567 16.2116 10.4489 17.2196C8.04279 15.8234 3.09251 12.318 2.39312 8.85122C1.86472 6.23109 2.5878 4.70912 3.28821 3.89317C3.65861 3.46353 4.12333 3.11801 4.64903 2.88141C5.17473 2.64481 5.74838 2.52299 6.32883 2.52468C6.94879 2.47998 7.57022 2.59049 8.13253 2.84542C8.69484 3.10036 9.17884 3.49102 9.53734 3.97932C9.62575 4.13571 9.75616 4.26645 9.915 4.3579C10.0738 4.44936 10.2553 4.49819 10.4404 4.4993C10.6256 4.50041 10.8076 4.45377 10.9676 4.36423C11.1276 4.27469 11.2598 4.14553 11.3502 3.99022C11.708 3.49811 12.193 3.10414 12.7575 2.84715C13.3219 2.59016 13.9463 2.47902 14.569 2.52468C15.1507 2.52196 15.7257 2.64329 16.2527 2.87993C16.7798 3.11656 17.2456 3.46262 17.6168 3.89317C18.3152 4.70912 19.0383 6.23109 18.5099 8.85122Z"
                                fill="white" />
                        </svg>
                        <span class="product-tooltip">Add To Wishlist</span>
                    </button>
                            </div>
                        </div>
                        <div class="product-content">
                            <h4 class="product-title"><a href="#!" style="text-transform: capitalize;">${product.name}</a></h4>
                            <div class="user-rating mb-1">
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                            </div>
                            <div class="product-price">
                                <span class="product-new-price">ksh ${product.price}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error(`Error fetching products for category ${categoryId}:`, error);
    }
}

//updating modal
document.addEventListener("click", async (event) => {
    if (event.target.closest(".product-action-btn") && event.target.closest(".product-action-btn").hasAttribute("data-product-id")) {
        const productId = event.target.closest(".product-action-btn").getAttribute("data-product-id");

        try {
            // Fetch the product details
            const response = await fetch(`${aappii}/products/${productId}`);
            const product = await response.json();

            // Update modal content
            document.querySelector(".product__details-title").innerText = product.name;
            document.querySelector(".new-price").innerText = `ksh${product.price}`;
            document.querySelector(".old-price").innerText = product.originalprice ? `ksh${product.originalprice}` : "";
            document.querySelector(".product__details-content p").innerText = product.description;
            document.querySelector(".sku a").innerText = product._id || "N/A";
            document.querySelector(".categories a").innerText = product.category.name || "N/A";
            document.querySelector(".sizes a").innerText = product.sizes || "N/A";

            const mainImageElement = document.querySelector(".product__details-thumb-big img");
            mainImageElement.src = product.image || "assets/imgs/default-product.png";

            const galleryContainer = document.querySelector(".product__details-thumb-tab");
            const galleryContent = document.querySelector("#productthumbcontent");

            if (product.gallery && product.gallery.length > 0) {
                galleryContainer.style.display = "block";
                document.querySelector(".nav-tabs").innerHTML = "";
                galleryContent.innerHTML = ""; 
                
                let firstImageActive = true;

                product.gallery.forEach((image, index) => {
                    document.querySelector(".nav-tabs").innerHTML += `
                        <button class="nav-link ${firstImageActive ? "active" : ""}" 
                            id="img-${index + 1}-tab" data-bs-toggle="tab" 
                            data-bs-target="#img-${index + 1}" type="button" role="tab"
                            aria-controls="img-${index + 1}" aria-selected="${firstImageActive}">
                            <img src="${image}" alt="product-sm-thumb">
                        </button>
                    `;

                    galleryContent.innerHTML += `
                        <div class="tab-pane fade ${firstImageActive ? "show active" : ""}" 
                            id="img-${index + 1}" role="tabpanel" 
                            aria-labelledby="img-${index + 1}-tab">
                            <div class="product__details-thumb-big w-img">
                                <img src="${image}" alt="">
                            </div>
                        </div>
                    `;

                    firstImageActive = false;
                });
            } else {
                galleryContainer.style.display = "none";
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    }
});


const container = document.querySelector('.index-contmain-container');
container.addEventListener("click", function (event) {
    if (event.target.classList.contains('index-add-cart')) {
        if(!token){
            Swal.fire({
                title: "Information",
                text: "Please log in to shop",
                icon: "info",
                confirmButtonText: "Ok!"
            });
            
            event.preventDefault();
            return;
        }
        else if(token){
            const productId = event.target.getAttribute('data-id');
            const productPrice = event.target.getAttribute('data-price');
            event.preventDefault();
            addToCart(productId, productPrice);
        }
    }
})


function addToCart(productId, productPrice) {
    let positionthisproductincart = cart.findIndex(cart => cart.product_id === productId);
    if(cart.length <= 0){
        cart = [{
            product_id: productId,
            quantity: 1,
            price: productPrice
        }]
        Swal.fire({
            title: "Information",
            text: "Added to cart",
            icon: "info",
            confirmButtonText: "Ok"
        });
        
    }else if(positionthisproductincart < 0){
        cart.push({
            product_id: productId,
            quantity: 1,
            price: productPrice
        })
        Swal.fire({
            title: "Information",
            text: "Added to cart",
            icon: "info",
            confirmButtonText: "Ok"
        });
    }else{
        Swal.fire({
            title: "Information",
            text: "Already in cart",
            icon: "info",
            confirmButtonText: "Ok"
        });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}


document.querySelector(".account-log-out").addEventListener("click", () => {
    const token = localStorage.getItem("token")
    if(!token){
        return;
    }
    else if(token){
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, log me out!"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                location.reload();
            }
        });
    }
});


//featured products
fetchFeaturedProducts();
async function fetchFeaturedProducts() {
    try {
        const response = await fetch(`${aappii}/products/get/featured/10`);
        
        if (!response.ok) {
            console.error(`Server responded with status: ${response.status}`);
            return;
        }
        const data = await response.json();
        console.log(data);
        renderFeaturedProducts(data);
    } catch (err) {
        console.error('Failed to fetch featured products:', err);
    }
}

const featuredcontainer = document.querySelector(".featured-products-container");
renderFeaturedProducts = (data) => {
    
    featuredcontainer.innerHTML = "";
    data.forEach((product) => {
        featuredcontainer.innerHTML += `
        <div class="swiper-slide">
            <div class="product-item furniture__product">
                <div class="product-thumb theme-bg-2">
                    <a href="product-details.html"><img src="${product.image}"
                alt=""></a>
                    <div class="product-action-item">
                        <button type="button" class="product-action-btn index-add-cart" data-id="${product._id}" data-price="${product.price}">
                <svg width="20" height="22" viewBox="0 0 20 22" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                    d="M13.0768 10.1416C13.0768 11.9228 11.648 13.3666 9.88542 13.3666C8.1228 13.3666 6.69401 11.9228 6.69401 10.1416M1.375 5.84163H18.3958M1.375 5.84163V12.2916C1.375 19.1359 2.57494 20.3541 9.88542 20.3541C17.1959 20.3541 18.3958 19.1359 18.3958 12.2916V5.84163M1.375 5.84163L2.91454 2.73011C3.27495 2.00173 4.01165 1.54163 4.81754 1.54163H14.9533C15.7592 1.54163 16.4959 2.00173 16.8563 2.73011L18.3958 5.84163"
                    stroke="white" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <span class="product-tooltip">Add to Cart</span>
                </button>
                        <button type="button" class="product-action-btn" data-bs-toggle="modal" data-bs-target="#producQuickViewModal" data-product-id="${product._id}">

                <svg width="26" height="18" viewBox="0 0 26 18" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                    d="M13.092 4.55026C10.5878 4.55026 8.55683 6.58125 8.55683 9.08541C8.55683 11.5896 10.5878 13.6206 13.092 13.6206C15.5961 13.6206 17.6271 11.5903 17.6271 9.08541C17.6271 6.5805 15.5969 4.55026 13.092 4.55026ZM13.092 12.1089C11.4246 12.1089 10.0338 10.7196 10.0338 9.05216C10.0338 7.38473 11.3898 6.02872 13.0572 6.02872C14.7246 6.02872 16.0807 7.38473 16.0807 9.05216C16.0807 10.7196 14.7594 12.1089 13.092 12.1089ZM25.0965 8.8768C25.0875 8.839 25.092 8.79819 25.0807 8.76115C25.0761 8.74528 25.0655 8.73621 25.0603 8.7226C25.0519 8.70144 25.0542 8.67574 25.0429 8.65533C22.8441 3.62131 18.1064 0.724854 13.0572 0.724854C8.00807 0.724854 3.17511 3.61677 0.975559 8.65079C0.966488 8.67196 0.968 8.69388 0.959686 8.71806C0.954395 8.73318 0.943812 8.74074 0.938521 8.7551C0.927184 8.7929 0.931719 8.83296 0.92416 8.8715C0.910555 8.93953 0.897705 9.00605 0.897705 9.07483C0.897705 9.14361 0.910555 9.20862 0.92416 9.2774C0.931719 9.31519 0.926428 9.35677 0.938521 9.39229C0.943057 9.40968 0.954395 9.41648 0.959686 9.4316C0.967244 9.45201 0.965732 9.4777 0.975559 9.49887C3.17511 14.5314 7.96121 17.381 13.0104 17.381C18.0595 17.381 22.8448 14.5374 25.0436 9.5034C25.055 9.48148 25.0527 9.45956 25.061 9.43538C25.0663 9.42253 25.0761 9.4127 25.0807 9.39758C25.092 9.36055 25.089 9.32049 25.0965 9.28118C25.1101 9.21315 25.1222 9.14739 25.1222 9.0771C25.1222 9.01058 25.1094 8.94482 25.0958 8.87604L25.0965 8.8768ZM13.0104 15.8692C8.72841 15.8692 4.51298 13.6123 2.44193 9.07407C4.49333 4.55177 8.76469 2.23582 13.0572 2.23582C17.349 2.23582 21.5251 4.55404 23.5773 9.07861C21.5266 13.6002 17.3036 15.8692 13.0104 15.8692Z"
                    fill="white" />
                </svg>
                <span class="product-tooltip">Quick View</span>
            </button>
                        <button type="button" class="product-action-btn">

                <svg width="21" height="20" viewBox="0 0 21 20" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                    d="M19.2041 2.63262C18.6402 1.97669 17.932 1.44916 17.1305 1.08804C16.329 0.726918 15.4541 0.54119 14.569 0.544237C13.0545 0.500151 11.58 1.01577 10.4489 1.98501C9.31782 1.01577 7.84334 0.500151 6.32883 0.544237C5.44368 0.54119 4.56885 0.726918 3.76735 1.08804C2.96585 1.44916 2.25764 1.97669 1.69374 2.63262C0.712132 3.77732 -0.314799 5.84986 0.366045 9.22751C1.45272 14.6213 9.60121 19.0476 9.94523 19.2288C10.0986 19.311 10.2713 19.3541 10.4469 19.3541C10.6224 19.3541 10.7951 19.311 10.9485 19.2288C11.2946 19.0436 19.4431 14.6173 20.5277 9.22751C21.2126 5.84986 20.1857 3.77732 19.2041 2.63262ZM18.5099 8.85122C17.7415 12.6646 12.1567 16.2116 10.4489 17.2196C8.04279 15.8234 3.09251 12.318 2.39312 8.85122C1.86472 6.23109 2.5878 4.70912 3.28821 3.89317C3.65861 3.46353 4.12333 3.11801 4.64903 2.88141C5.17473 2.64481 5.74838 2.52299 6.32883 2.52468C6.94879 2.47998 7.57022 2.59049 8.13253 2.84542C8.69484 3.10036 9.17884 3.49102 9.53734 3.97932C9.62575 4.13571 9.75616 4.26645 9.915 4.3579C10.0738 4.44936 10.2553 4.49819 10.4404 4.4993C10.6256 4.50041 10.8076 4.45377 10.9676 4.36423C11.1276 4.27469 11.2598 4.14553 11.3502 3.99022C11.708 3.49811 12.193 3.10414 12.7575 2.84715C13.3219 2.59016 13.9463 2.47902 14.569 2.52468C15.1507 2.52196 15.7257 2.64329 16.2527 2.87993C16.7798 3.11656 17.2456 3.46262 17.6168 3.89317C18.3152 4.70912 19.0383 6.23109 18.5099 8.85122Z"
                    fill="white" />
                </svg>
                <span class="product-tooltip">Add To Wishlist</span>
            </button>
                    </div>
                </div>
                <div class="product-content">
                    <h4 class="product-title"><a href="product-details.html">${product.name}</a></h4>
                    <div class="user-rating">
                        <i class="fal fa-star"></i>
                        <i class="fal fa-star"></i>
                        <i class="fal fa-star"></i>
                        <i class="fal fa-star"></i>
                        <i class="fal fa-star"></i>
                    </div>
                    <div class="product-price">
                        <span class="product-new-price">ksh ${product.price}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
}
featuredcontainer.addEventListener("click", function (event) {
    if (event.target.classList.contains('index-add-cart')) {
        if(!token){
            Swal.fire({
                title: "Information",
                text: "Please log in to shop",
                icon: "info",
                confirmButtonText: "Ok!"
            });
            
            event.preventDefault();
            return;
        }
        else if(token){
            const productId = event.target.getAttribute('data-id');
            const productPrice = event.target.getAttribute('data-price');
            event.preventDefault();
            addToCart(productId, productPrice);
        }
    }
})