// src/assets/cartdata.js

const CartData = [
  {
    id: 1,
    name: 'Margherita Pizza',
    image: 'https://cdn.shopify.com/s/files/1/0274/9503/9079/files/20220211142754-margherita-9920_5a73220e-4a1a-4d33-b38f-26e98e3cd986.jpg?v=1723650067',
    price: 9.99,
    quantity: 2,
    options: [
      { name: 'Extra Cheese', price: 1.50 },
      { name: 'Olives', price: 0.75 }
    ]
  },
  {
    id: 2,
    name: 'Pepperoni Pizza',
    image: 'https://www.simplyrecipes.com/thmb/KE6iMblr3R2Db6oE8HdyVsFSj2A=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__09__easy-pepperoni-pizza-lead-3-1024x682-583b275444104ef189d693a64df625da.jpg',
    price: 12.99,
    quantity: 1,
    options: [
      { name: 'Spicy', price: 1.00 },
      { name: 'No Onion', price: 0.50 }
    ]
  },
  {
    id: 3,
    name: 'Cheeseburger',
    image: 'https://www.sargento.com/assets/Uploads/Recipe/Image/burger_0.jpg',
    price: 8.99,
    quantity: 3,
    options: [
      { name: 'No Pickles', price: 0.25 },
      { name: 'Extra Bacon', price: 1.00 }
    ]
  },
  {
    id: 4,
    name: 'Chocolate Cake',
    image: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-1043451_11-4713959.jpg',
    price: 5.99,
    quantity: 2,
    options: [
      { name: 'With Extra Chocolate', price: 1.50 }
    ]
  }
];

export default CartData;