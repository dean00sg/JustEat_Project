// src/assets/historydata.js

const HistoryData = [
    {
      id: 1,
      name: 'Margherita Pizza',
      image: 'https://cdn.shopify.com/s/files/1/0274/9503/9079/files/20220211142754-margherita-9920_5a73220e-4a1a-4d33-b38f-26e98e3cd986.jpg',
      price: 9.99,
      quantity: 2,
      status: 'Complete',
      options: [
        { name: 'Extra Cheese', price: 1.5 },
        { name: 'Olives', price: 0.5 }
      ]
    },
    {
      id: 2,
      name: 'Pepperoni Pizza',
      image: 'https://www.simplyrecipes.com/thmb/KE6iMblr3R2Db6oE8HdyVsFSj2A=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__09__easy-pepperoni-pizza-lead-3-1024x682-583b275444104ef189d693a64df625da.jpg',
      price: 12.99,
      quantity: 1,
      status: 'In progress',
      options: [
        { name: 'Spicy', price: 0.75 },
        { name: 'No Onion', price: 0 }
      ]
    },
    {
      id: 3,
      name: 'Cheeseburger',
      image: 'https://www.sargento.com/assets/Uploads/Recipe/Image/burger_0.jpg',
      price: 8.99,
      quantity: 3,
      status: 'Cancel',
      options: [
        { name: 'No Pickles', price: 0 },
        { name: 'Extra Bacon', price: 1.0 }
      ],
      note: 'Out of stock'
    }
  ];
  
  export default HistoryData;
  