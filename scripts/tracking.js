import { getProduct, loadProductsFetch, products } from "../data/products.js";
import { orders, getOrder } from "../data/orders.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

async function renderPage() {
  await loadProductsFetch();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  const order = getOrder(orderId);
  const product = getProduct(productId);

  const productDetails = order.products.find(
    (product) => product.productId === productId
  );

  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
  const percentProgress =
    ((today - orderTime) / (deliveryTime - orderTime)) * 100;
  const progress = Math.round(percentProgress);

  const deliveredMessage =
    today > deliveryTime ? "Delivered on" : "Arriving on";

  const trackingHTML = `
  <div class="order-tracking">
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">${deliveredMessage} ${dayjs(
    productDetails.estimatedDeliveryTime
  ).format("dddd, MMMM D")}</div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">Quantity: ${productDetails.quantity}</div>

    <img class="product-image" src="${product.image}">

    <div class="progress-labels-container">
      <div class="progress-label ${
        progress < 50 ? "current-status" : ""
      }">Preparing</div>
      <div class="progress-label ${
        progress >= 50 && progress < 100 ? "current-status" : ""
      }">Shipped</div>
      <div class="progress-label ${
        progress >= 100 ? "current-status" : ""
      }">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${progress}%"></div>
    </div>
  </div>
  `;

  document.querySelector(".js-main").innerHTML = trackingHTML;

  //my code

  // document.querySelector(".progress-bar").style.width = `${progress}%`;

  // if (progress < 50) {
  //   document.querySelector(".js-preparing").classList.add("current-status");
  // } else if (progress < 99) {
  //   document.querySelector(".js-preparing").classList.add("current-status");
  //   document.querySelector(".js-shipped").classList.add("current-status");
  // } else if (progress >= 100) {
  //   document.querySelector(".js-preparing").classList.add("current-status");
  //   document.querySelector(".js-shipped").classList.add("current-status");
  //   document.querySelector(".js-delivered").classList.add("current-status");
  // }
}
renderPage();
