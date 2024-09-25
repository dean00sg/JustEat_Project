export const orderStatusOptions = ['Inprogress', 'Complete', 'Cancel'];

export class OrderItem {
  constructor(name, quantity, price, image, note, options) {
    this.name = name;
    this.quantity = quantity;
    this.price = price;
    this.image = image;
    this.note = note; // Note from customer
    this.options = options; // Array of options
  }
}

export class Order {
  constructor(id, status, date, items, cancelNote = '') {
    this.id = id;
    this.status = status; // Current status of the order
    this.date = date; // Date of the order
    this.items = items; // Array of OrderItem
    this.cancelNote = cancelNote; // Reason for cancellation
  }

  // Calculate the total price for the order
  calculateTotalPrice() {
    return this.items.reduce((acc, item) => {
      const basePrice = item.price * item.quantity;
      const optionsPrice = item.options.reduce((optAcc, option) => optAcc + option.price, 0);
      return acc + basePrice + optionsPrice;
    }, 0);
  }
}