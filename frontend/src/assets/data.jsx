const foodItems = [
    // Pizza
    { id: 1, name: 'Margherita Pizza', category: 'Pizza', price: 9.99, image: 'https://cdn.shopify.com/s/files/1/0274/9503/9079/files/20220211142754-margherita-9920_5a73220e-4a1a-4d33-b38f-26e98e3cd986.jpg?v=1723650067', description: 'Classic Margherita pizza with tomatoes and mozzarella.', stock: 25, options: [
        { id: 1, name: 'Extra Cheese', price: 1.50 },
        { id: 2, name: 'Olives', price: 1.00 },
        { id: 3, name: 'Mushrooms', price: 1.25 }
    ]},
    { id: 2, name: 'Pepperoni Pizza', category: 'Pizza', price: 12.99, image: 'https://www.simplyrecipes.com/thmb/KE6iMblr3R2Db6oE8HdyVsFSj2A=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__09__easy-pepperoni-pizza-lead-3-1024x682-583b275444104ef189d693a64df625da.jpg', description: 'Spicy pepperoni pizza with extra cheese.', stock: 20, options: [
        { id: 4, name: 'Extra Pepperoni', price: 2.00 },
        { id: 5, name: 'Garlic', price: 1.00 },
        { id: 6, name: 'Red Peppers', price: 1.50 }
    ]},
    { id: 3, name: 'BBQ Chicken Pizza', category: 'Pizza', price: 13.49, image: 'https://www.allrecipes.com/thmb/qZ7LKGV1_RYDCgYGSgfMn40nmks=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-24878-bbq-chicken-pizza-beauty-4x3-39cd80585ad04941914dca4bd82eae3d.jpg', description: 'BBQ sauce, chicken, onions, and cilantro.', stock: 15, options: [
        { id: 7, name: 'BBQ Sauce', price: 1.00 },
        { id: 8, name: 'Caramelized Onions', price: 1.50 },
        { id: 9, name: 'Chicken Strips', price: 2.50 }
    ]},
    { id: 4, name: 'Vegetarian Pizza', category: 'Pizza', price: 11.49, image: 'https://cdn.loveandlemons.com/wp-content/uploads/2023/02/vegetarian-pizza.jpg', description: 'Loaded with fresh vegetables and cheese.', stock: 18, options: [
        { id: 10, name: 'Artichokes', price: 1.50 },
        { id: 11, name: 'Sun-Dried Tomatoes', price: 1.25 },
        { id: 12, name: 'Spinach', price: 1.00 }
    ]},
  
    // Burgers
    { id: 5, name: 'Cheeseburger', category: 'Burgers', price: 8.99, image: 'https://www.sargento.com/assets/Uploads/Recipe/Image/burger_0.jpg', description: 'Juicy cheeseburger with lettuce and tomato.', stock: 30, options: [
        { id: 13, name: 'Extra Cheese', price: 1.00 },
        { id: 14, name: 'Bacon', price: 1.50 },
        { id: 15, name: 'Avocado', price: 1.25 }
    ]},
    { id: 6, name: 'Bacon Burger', category: 'Burgers', price: 10.49, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6isLhEmC0563sFX3Y-9kJbzDf6PfhPCE7lg&s', description: 'Bacon, cheese, and BBQ sauce.', stock: 22, options: [
        { id: 16, name: 'BBQ Sauce', price: 1.00 },
        { id: 17, name: 'Extra Bacon', price: 1.50 },
        { id: 18, name: 'Onions', price: 1.00 }
    ]},
    { id: 7, name: 'Mushroom Swiss Burger', category: 'Burgers', price: 9.99, image: 'https://groundbeefrecipes.com/wp-content/uploads/mushroom-swiss-burgers.jpg', description: 'Sautéed mushrooms and Swiss cheese.', stock: 28, options: [
        { id: 19, name: 'Extra Mushrooms', price: 1.50 },
        { id: 20, name: 'Swiss Cheese', price: 1.00 },
        { id: 21, name: 'Garlic Aioli', price: 1.25 }
    ]},
    { id: 8, name: 'Veggie Burger', category: 'Burgers', price: 9.49, image: 'https://www.noracooks.com/wp-content/uploads/2023/04/veggie-burgers-1-2.jpg', description: 'Grilled veggie patty with avocado.', stock: 25, options: [
        { id: 22, name: 'Avocado', price: 1.25 },
        { id: 23, name: 'Lettuce', price: 0.75 },
        { id: 24, name: 'Tomato', price: 0.75 }
    ]},
  
    // Chicken
    { id: 9, name: 'Grilled Chicken', category: 'Chicken', price: 11.99, image: 'https://static.toiimg.com/thumb/53222760.cms?imgsize=312586&width=800&height=800', description: 'Tender grilled chicken with a side of vegetables.', stock: 17, options: [
        { id: 25, name: 'BBQ Sauce', price: 1.00 },
        { id: 26, name: 'Lemon Herb', price: 1.25 },
        { id: 27, name: 'Garlic Butter', price: 1.50 }
    ]},
    { id: 10, name: 'Fried Chicken', category: 'Chicken', price: 12.99, image: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2012/11/2/0/DV1510H_fried-chicken-recipe-10_s4x3.jpg.rend.hgtvcom.1280.1280.suffix/1568222255998.webp', description: 'Crispy fried chicken served with mashed potatoes.', stock: 14, options: [
        { id: 28, name: 'Honey Glaze', price: 1.00 },
        { id: 29, name: 'Spicy Seasoning', price: 1.50 },
        { id: 30, name: 'Garlic Parmesan', price: 1.25 }
    ]},
    { id: 11, name: 'Chicken Alfredo', category: 'Chicken', price: 13.49, image: 'https://insanelygoodrecipes.com/wp-content/uploads/2023/01/Creamy-and-Saucy-Chicken-Alfredo-Pasta-500x375.jpg', description: 'Creamy Alfredo sauce over pasta with grilled chicken.', stock: 20, options: [
        { id: 31, name: 'Extra Alfredo Sauce', price: 1.50 },
        { id: 32, name: 'Broccoli', price: 1.00 },
        { id: 33, name: 'Mushrooms', price: 1.25 }
    ]},
    { id: 12, name: 'Buffalo Wings', category: 'Chicken', price: 10.99, image: 'https://www.budgetbytes.com/wp-content/uploads/2024/01/buffalo-wings-overhead-horizontal-WR-scaled.jpg', description: 'Spicy buffalo wings with ranch dipping sauce.', stock: 22, options: [
        { id: 34, name: 'Extra Hot Sauce', price: 1.00 },
        { id: 35, name: 'Celery Sticks', price: 1.00 },
        { id: 36, name: 'Blue Cheese Dressing', price: 1.25 }
    ]},
  
    // Salads
    { id: 13, name: 'Caesar Salad', category: 'Salads', price: 7.99, image: 'https://itsavegworldafterall.com/wp-content/uploads/2023/04/Avocado-Caesar-Salad-1.jpg', description: 'Crisp romaine lettuce with Caesar dressing and croutons.', stock: 30, options: [
        { id: 37, name: 'Extra Croutons', price: 0.75 },
        { id: 38, name: 'Grilled Chicken', price: 2.00 },
        { id: 39, name: 'Parmesan Cheese', price: 1.00 }
    ]},
    { id: 14, name: 'Greek Salad', category: 'Salads', price: 8.49, image: 'https://www.thechunkychef.com/wp-content/uploads/2021/07/Greek-Salad-Recipe-feat.jpg', description: 'Tomatoes, cucumbers, olives, and feta cheese.', stock: 27, options: [
        { id: 40, name: 'Extra Feta Cheese', price: 1.00 },
        { id: 41, name: 'Red Onion', price: 0.75 },
        { id: 42, name: 'Olives', price: 0.75 }
    ]},
    { id: 15, name: 'Cobb Salad', category: 'Salads', price: 9.99, image: 'https://www.erinliveswhole.com/wp-content/uploads/2021/07/chicken-cobb-salad-3.jpg', description: 'Mixed greens with grilled chicken, bacon, and eggs.', stock: 22, options: [
        { id: 43, name: 'Extra Bacon', price: 1.50 },
        { id: 44, name: 'Avocado', price: 1.25 },
        { id: 45, name: 'Hard-Boiled Eggs', price: 1.00 }
    ]},
    { id: 16, name: 'Spinach Salad', category: 'Salads', price: 8.99, image: 'https://cdn.loveandlemons.com/wp-content/uploads/2023/11/spinach-salad.jpg', description: 'Fresh spinach with strawberries, nuts, and balsamic vinaigrette.', stock: 20, options: [
        { id: 46, name: 'Strawberries', price: 1.00 },
        { id: 47, name: 'Nuts', price: 1.25 },
        { id: 48, name: 'Balsamic Vinaigrette', price: 0.75 }
    ]},
  
    // Desserts
    { id: 17, name: 'Chocolate Cake', category: 'Desserts', price: 5.99, image: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-1043451_11-4713959.jpg', description: 'Rich and moist chocolate cake with a creamy frosting.', stock: 15, options: [
        { id: 49, name: 'Extra Frosting', price: 1.00 },
        { id: 50, name: 'Berries', price: 1.50 },
        { id: 51, name: 'Whipped Cream', price: 1.00 }
    ]},
    { id: 18, name: 'Cheesecake', category: 'Desserts', price: 6.49, image: 'https://static01.nyt.com/images/2021/11/02/dining/dg-Tall-and-Creamy-Cheesecake-copy/dg-Tall-and-Creamy-Cheesecake-superJumbo.jpg', description: 'Classic cheesecake with a graham cracker crust.', stock: 12, options: [
        { id: 52, name: 'Berry Topping', price: 1.50 },
        { id: 53, name: 'Chocolate Drizzle', price: 1.00 },
        { id: 54, name: 'Whipped Cream', price: 1.00 }
    ]},
    { id: 19, name: 'Apple Pie', category: 'Desserts', price: 4.99, image: 'https://www.ifyougiveablondeakitchen.com/wp-content/uploads/2023/04/best-apple-pie-from-scratch.jpg', description: 'Homemade apple pie with a flaky crust.', stock: 18, options: [
        { id: 55, name: 'Vanilla Ice Cream', price: 1.50 },
        { id: 56, name: 'Caramel Sauce', price: 1.00 },
        { id: 57, name: 'Whipped Cream', price: 1.00 }
    ]},
    { id: 20, name: 'Tiramisu', category: 'Desserts', price: 6.99, image: 'https://sugarpursuit.com/wp-content/uploads/2023/03/Easy-tiramisu-recipe-thumbnail.jpg', description: 'Layered coffee and mascarpone dessert.', stock: 10, options: [
        { id: 58, name: 'Chocolate Shavings', price: 1.00 },
        { id: 59, name: 'Extra Mascarpone', price: 1.25 },
        { id: 60, name: 'Espresso Drizzle', price: 1.00 }
    ]},
  
    // Drinks
    { id: 21, name: 'Coca-Cola', category: 'Drinks', price: 1.99, image: 'https://www.shutterstock.com/image-photo/poznan-pol-aug-13-2019-600nw-2458808941.jpg', description: 'Refreshing Coca-Cola soda.', stock: 50, options: [
        { id: 61, name: 'Lemon Slice', price: 0.50 },
        { id: 62, name: 'Ice', price: 0.25 },
        { id: 63, name: 'Extra Ice', price: 0.25 }
    ]},
    { id: 22, name: 'Lemonade', category: 'Drinks', price: 2.49, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ27vZzJv4lUSOuxeUwhRNCAnvw_TAs8aMZg&s', description: 'Homemade lemonade with a hint of mint.', stock: 40, options: [
        { id: 64, name: 'Mint Leaves', price: 0.50 },
        { id: 65, name: 'Lemon Slice', price: 0.25 },
        { id: 66, name: 'Extra Sweet', price: 0.50 }
    ]},
    { id: 23, name: 'Iced Tea', category: 'Drinks', price: 2.29, image: 'https://www.everydaycheapskate.com/wp-content/uploads/20240705-how-to-make-iced-tea-glass-with-ice-cubes-and-sliced-and-whole-lemons.png', description: 'Chilled iced tea with lemon.', stock: 35, options: [
        { id: 67, name: 'Lemon Slice', price: 0.25 },
        { id: 68, name: 'Peach Flavor', price: 0.50 },
        { id: 69, name: 'Sweetener', price: 0.25 }
    ]},
    { id: 24, name: 'Coffee', category: 'Drinks', price: 1.89, image: 'https://images.news18.com/ibnlive/uploads/2024/01/image-76-2024-01-c4b36ce27d9508ae9aa4b2f55a0b220f.jpg?impolicy=website&width=640&height=480', description: 'Freshly brewed coffee.', stock: 45, options: [
        { id: 70, name: 'Creamer', price: 0.25 },
        { id: 71, name: 'Sugar', price: 0.25 },
        { id: 72, name: 'Extra Shot', price: 0.50 }
    ]}
  ];
  export default foodItems;