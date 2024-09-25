class MenuItem {
    constructor(menuName, menuImage, price, available, category, options) {
      this.menuName = menuName; // Name of the menu item
      this.menuImage = menuImage; // Image file name or URL
      this.price = price; // Price of the menu item
      this.available = available; // Boolean indicating availability
      this.category = category; // Selected category
      this.options = options; // Array of options (each option is an object with name and price)
    }
  }
  
  export default MenuItem;
  