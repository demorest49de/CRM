export const calculateTotal = ($) => {
  const totalPriceOfItems = $.header.querySelector('.card-sum__price-value');
  const totalPricesCount = $.tbody.querySelectorAll('.list-product__table-td[data-total-price]');
  let count = 0;
  totalPricesCount.forEach(item => {

    count += +(item.getAttribute('data-total-price'));
  });
  totalPriceOfItems.textContent = count;
};