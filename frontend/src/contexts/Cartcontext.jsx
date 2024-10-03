import React, { createContext, useState, useContext } from 'react';

// Create the CartContext
export const CartContext = createContext();

// Create a custom hook to use the CartContext
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // New state for total price

  const updateTotalPrice = () => {
    const total = cartItems.reduce(
      (acc, item) =>
        acc +
        (parseFloat(item.price) * item.qty) + // Assuming item.price is available
        item.options.reduce((optAcc, option) => optAcc + parseFloat(option.price) * item.qty, 0),
      0
    ).toFixed(2);
    
    setTotalPrice(total);
  };

  const addToCart = (newItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id);

      if (existingItem) {
        // If the item already exists, update the quantity
        return prevItems.map((item) =>
          item.id === newItem.id
            ? {
                ...item,
                qty: item.qty + newItem.qty, // Update quantity
                option_ids: Array.from(new Set([...item.option_ids, ...newItem.option_ids])), // Merge option_ids
                options: [
                  ...item.options,
                  ...newItem.options.filter(option => 
                    !item.options.some(existingOption => existingOption.Option_id === option.Option_id)
                  ),
                ],
              }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevItems, {
          menu_id: newItem.menu_id,
          menu_name: newItem.menu_name,
          image: newItem.image,
          qty: newItem.qty,
          option_ids: newItem.option_ids,
          category_id: newItem.category_id,
          remark: newItem.remark,
          options: newItem.options,
          note: newItem.note,
          id: newItem.id,
          price: newItem.totalPrice,
        }];
      }
    });
    
    updateTotalPrice(); // Update total price after adding item
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== itemId);
      return newItems; // Return updated cart
    });
    updateTotalPrice(); // Update total price after removing item
  };

  const updateItemQuantity = (itemId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, qty: quantity } : item
      )
    );
    updateTotalPrice(); // Update total price after quantity change
  };

  const clearCart = () => {
    setCartItems([]);
    setTotalPrice(0); // Reset total price when clearing cart
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice, // Expose total price
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};