let basketProducts = [];

if (localStorage.getItem("basket") !== null) {
  basketProducts = JSON.parse(localStorage.getItem("basket"));
}

function appendProducts() {
  const shopProducts = document.querySelector(".shop-products");
  shopProducts.innerHTML = "";
  basketProducts.forEach((product) => {
    shopProducts.innerHTML += `
      <div class="shop-product" id="${product.id}">
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
          <input type="number" value="${product.count}" max="10" class="shop-product__count" />
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
  decreaseCount();
  increaseCount();
  calcTotal();
}

appendProducts();

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

function decreaseCount() {
  const minusBtn = document.querySelectorAll(".counter-minus");
  minusBtn.forEach((minus, index) => {
    minus.addEventListener("click", function () {
      if (basketProducts[index] && basketProducts[index].count > 0) {
        basketProducts[index].count--;

        const productElement = document.getElementById(
          basketProducts[index].id
        );
        const productCountInput = productElement.querySelector(
          ".shop-product__count"
        );

        productCountInput.value = basketProducts[index].count;

        if (basketProducts[index].count === 0) {
          productElement.classList.add("d-none");
          minus.disabled = true;
          basketProducts = basketProducts.filter(
            (pr) => pr.id !== basketProducts[index].id
          );
          updateAllData();
          appendProducts();
        }
      }
      calcTotal();
      calcBasketCount();
    });
  });
}

function increaseCount() {
  const plusBtn = document.querySelectorAll(".counter-plus");
  plusBtn.forEach((plus, index) => {
    plus.addEventListener("click", function () {
      basketProducts[index].count++;

      const productElement = document.getElementById(basketProducts[index].id);
      const productCountInput = productElement.querySelector(
        ".shop-product__count"
      );
      productCountInput.value = basketProducts[index].count;

      productElement.classList.remove("d-none");
      calcTotal();
      calcBasketCount();
      appendProducts();
      updateAllData();
    });
  });
}

function calcBasketCount() {
  const countBasket = document.querySelector(".count");
  let length = 0;
  for (let i = 0; i < basketProducts.length; i++) {
    length += basketProducts[i].count;
  }
  countBasket.innerText = length;
}

function calcTotal() {
  const total = document.querySelector(".total");
  let result = 0;
  for (let i = 0; i < basketProducts.length; i++) {
    result += basketProducts[i].count * parseFloat(basketProducts[i].price);
  }
  total.innerHTML = result.toFixed(2) + " AZN";
}

const orderButton = document.querySelector(".order");
orderButton.addEventListener("click", function () {
  const total = document.querySelector(".total").innerHTML;
  if (parseInt(total) <= 0) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Səbət boşdur!",
      showConfirmButton: false,
      timer: 3000,
    });
    return;
  }
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Sifarişiniz qeydə alındı!",
    showConfirmButton: false,
    timer: 3000,
  });
});

// Link to Home
const total = document.querySelector(".total").innerHTML;
if (parseInt(total) <= 0) {
  const basketSide = document.querySelector(".basket-side");
  const linkToHome = document.createElement("a");
  linkToHome.setAttribute("href", "../irshad.html");
  linkToHome.innerHTML = "Səbət boşdur, əsas səhifəyə qayıdın...";
  linkToHome.classList.add("link-home", "m-4");
  console.log(basketSide.firstChild.nextSibling.remove());
  basketSide.append(linkToHome);
}
calcBasketCount();
