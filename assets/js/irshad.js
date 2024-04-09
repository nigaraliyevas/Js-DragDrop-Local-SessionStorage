"use strict";
const products = document.querySelectorAll(".product");
const shopBtns = document.querySelectorAll(".shop-btn");
const shoppingTab = document.querySelector(".shopping-tab");
const continueBtn = document.querySelector(".continue-btn");
let basketProducts = [];
products.forEach((product) => {
  let previousMonth = null;
  const months = product.querySelectorAll(".product-month");
  months.forEach((month) => {
    month.addEventListener("click", function () {
      if (previousMonth) previousMonth.classList.remove("choosen");
      const dataId = this.getAttribute("data-id");
      const dataPrice = this.getAttribute("data-price");
      const id = document.getElementById(dataPrice);

      const productPrice = id.querySelector(".product-price").innerText;
      const monthlyPrice = id.querySelector(".product-monthly-price");

      const total = (parseFloat(productPrice).toFixed(2) / dataId).toFixed(2);
      monthlyPrice.innerText = total + "AZN";

      this.classList.add("choosen");
      previousMonth = this;
    });
  });
});

let clickCount = 1;
let lastClickedShopBtn = null;

if (localStorage.getItem("basket") === null) {
  localStorage.setItem("basket", JSON.stringify([]));
} else {
  basketProducts = JSON.parse(localStorage.getItem("basket"));
}
shopBtns.forEach((btn) => {
  btn.addEventListener("click", function (ev) {
    let productBtn = [];
    if (this === lastClickedShopBtn) return;
    shoppingTab.classList.remove("d-none");
    clickCount++;
    btn.classList.remove("btn-success");
    const basketIcon = document.createElement("i");
    basketIcon.className = "fa-solid fa-cart-shopping";
    btn.classList.add("btn-warning");
    btn.innerHTML = "Səbətə əlavə edildi ";
    this.appendChild(basketIcon);
    lastClickedShopBtn = this;
    ev.preventDefault();
    productBtn.push(btn);

    const findProduct = this.closest(".product");
    const productId = findProduct
      .querySelector(".product-body")
      .getAttribute("id");

    const existProduct = basketProducts.find((p) => p.id == productId);
    if (existProduct) {
      existProduct.count++;

      const shopProducts = document.querySelectorAll(
        ".shop-products .shop-product"
      );

      shopProducts.forEach((product) => {
        if (product.getAttribute("id") === productId) {
          product.querySelector(".shop-product__counter input").value =
            existProduct.count;
        }
      });
    } else {
      const product = {
        id: productId,
        img: findProduct.querySelector(".product-img").getAttribute("src"),
        category: findProduct.querySelector(".product-category").innerHTML,
        name: findProduct.querySelector(".product-name").innerHTML,
        price: findProduct.querySelector(".product-price").innerHTML,
        count: 1,
      };
      basketProducts.push(product);
      appendProducts();
    }
    localStorage.setItem("basket", JSON.stringify(basketProducts));
    calcBasketCount();
  });
});

const shopProducts = document.querySelector(".shop-products");
function appendProducts() {
  shopProducts.innerHTML = "";
  basketProducts.forEach((product) => {
    shopProducts.innerHTML += `<div class="shop-product" id="${product.id}">
    <div class="shop-product__img">
      <img src="${product.img}" alt="">
      </div>
      <div class="shop-product__content">
        <p class="shop-product__category">${product.category}</p>
        <p class="shop-product__name">${product.name}</p>
      </div>
      <div class="shop-product__total">
        <p class="product-product__price">${product.price} AZN</p>
      </div>
      <div class="shop-product__counter">
        <button class="counter-minus">-</button>
        <input type="number" value="${product.count}" min="1" max="10" class="shop-product__count" />
        <button class="counter-plus">+</button>
      </div>
      <div class="shop-product__settings">
        <button class="shop-product__remove">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
  </div>
    `;
  });
  removeProducts();
  increaseCount();
  decreaseCount();
}

appendProducts();

continueBtn.addEventListener("click", function (ev) {
  ev.preventDefault();
  shoppingTab.classList.add("d-none");
});

//basket count
function calcBasketCount() {
  const countBasket = document.querySelector(".count");
  let length = 0;
  for (let i = 0; i < basketProducts.length; i++) {
    length += basketProducts[i].count;
  }
  countBasket.innerText = length;
}

//like
const hearts = document.querySelectorAll(".phone-head-icons i:first-child");
hearts.forEach((heart) => {
  heart.addEventListener("click", function () {
    if (heart.classList.contains("fa-regular")) {
      heart.classList.remove("fa-regular");
      heart.classList.add("fa-solid");
      heart.style.color = "#ff0000";
    } else {
      heart.classList.remove("fa-solid");
      heart.classList.add("fa-regular");
      heart.style.color = "";
    }
  });
});

//close shopping tab
const closeTab = document.querySelector(".remove-icon");
closeTab.addEventListener("click", function () {
  shoppingTab.classList.add("d-none");
});

function removeProducts() {
  const productRemoveButtons = document.querySelectorAll(
    ".shop-product__remove"
  );
  productRemoveButtons.forEach((removeButton, btnIndex) => {
    removeButton.addEventListener("click", function () {
      basketProducts = basketProducts.filter((product, i) => i !== btnIndex);
      updateAllData();
      appendProducts();
    });
  });
}

function updateAllData() {
  localStorage.setItem("basket", JSON.stringify(basketProducts));
  calcBasketCount();
}
function increaseCount() {
  const plusBtn = document.querySelectorAll(".counter-plus");
  plusBtn.forEach((plus, index) => {
    plus.addEventListener("click", function () {
      basketProducts[index].count++;

      const productElement = document.getElementById(
        `#${basketProducts[index].id}`
      );
      calcBasketCount();
      appendProducts();
      updateAllData();
    });
  });
}
function decreaseCount() {
  const minusBtn = document.querySelectorAll(".counter-minus");
  minusBtn.forEach((minus, index) => {
    minus.addEventListener("click", function () {
      if (basketProducts[index] && basketProducts[index].count > 0) {
        basketProducts[index].count--;
        const productElement = document.getElementById(
          `#${basketProducts[index]}`
        );
        // const productElement = document.getElementById(
        //   basketProducts[index].id
        // );
        // const productCountInput = productElement.querySelector(
        //   ".shop-product__count"
        // );

        // productCountInput.value = basketProducts[index].count;
      }
      if (basketProducts[index].count === 0) {
        basketProducts[index].id.classList.add("d-none");
        basketProducts = basketProducts.filter(
          (pr) => pr.id !== basketProducts[index].id
        );
        updateAllData();
        appendProducts();
      }
      calcBasketCount();
      updateAllData();
      appendProducts();
    });
  });
}
calcBasketCount();
