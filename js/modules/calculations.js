
export const calculateTotal = ($) => {
  const totalPriceOfItems = $.header.querySelector('.card-sum__price-value');
  const totalPricesCount = $.tbody.querySelectorAll('.list-product__table-td[data-total-price]');

  let count = 0;
  totalPricesCount.forEach(item => {
    count += +(item.getAttribute('data-total-price'));
  });
  totalPriceOfItems.textContent = count;
};

export const calculateFormTotal = ($) => {
  let discount = $.form.discount.value;
  if(discount < 0 || discount >= 100) discount = 0;
  const price = $.form.price.value;
  const count = $.form.quantity.value;
  const result = Math.floor(+price * +count *
      (1 - (+discount ? +discount / 100 : 0)));
  const total = $.overlay.querySelector('.add-item__total-value');
  total.textContent = result.toString();
};

export const handleDiscount = (target, $) => {
  const inputDiscount = $.form.discount;
  if (target.checked) {
    inputDiscount.removeAttribute('disabled');
    if(inputDiscount.hasAttribute('data-discount')){
      inputDiscount.value = inputDiscount.getAttribute('data-discount');
      inputDiscount.removeAttribute('data-discount');
    }
    inputDiscount.setAttribute('required', 'required');
  } else {
    inputDiscount.setAttribute('data-discount', inputDiscount.value);
    inputDiscount.setAttribute('disabled', '');
    inputDiscount.value = '';
    inputDiscount.removeAttribute('required');
  }

  calculateFormTotal($);
};
