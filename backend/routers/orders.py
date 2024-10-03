from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.category import Category
from models.menu_create import Menu
from models.option import Option
from models.orders import CreateOrders, Createupdate, OrdersFood, ResponseOrders
from deps import get_session

router = APIRouter(tags=["Orders"])

@router.post("/orders/", response_model=ResponseOrders)
def create_order(order: CreateOrders, db: Session = Depends(get_session)):
    # Fetch the menu details
    menu = db.query(Menu).filter(Menu.menu_id == order.menu_id).first()
    if not menu:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu not found")

    # Fetch the category details
    category = db.query(Category).filter(Category.category_id == order.category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    # Initialize lists for options names
    option_names = []
    total_price = float(menu.price) * order.qty  # Start with the menu price multiplied by qty

    # Check if option_ids are provided
    if order.option_ids:
        for option_id in order.option_ids:
            option = db.query(Option).filter(Option.Option_id == option_id).first()
            if not option:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Option {option_id} not found")

            # Add the option name to the list
            option_names.append(option.option_name)

            # Ensure option.price is treated as a float
            total_price += float(option.price) * order.qty  # Add the price of each option multiplied by qty

    # Determine the status_order based on status_menu and options
    status_order = "available" if menu.status_menu == "available" and all(
        option.status_option == "available" for option in db.query(Option).filter(Option.Option_id.in_(order.option_ids)).all()
    ) else "unavailable"

    # Create the OrdersFood entry using the fetched names and details
    db_order = OrdersFood(
        menu_id=order.menu_id,
        name_menu=menu.name,
        image=menu.image,
        Option_id=','.join(map(str, order.option_ids)) if order.option_ids else None,
        option_name=','.join(option_names) if option_names else '',  # Store as a string
        category_id=order.category_id,
        category_name=category.category_name,
        price=float(menu.price),  # Ensure this is a float
        qty=order.qty,
        remark=order.remark,
        total_price=total_price,  # Store as float
        status_option='available',
        status_menu=menu.status_menu,
        status_order=status_order,
        status_working="inprogress"  # Default status for a new order
    )

    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    return ResponseOrders(
        orders_id=db_order.orders_id,
        name_menu=db_order.name_menu,
        qty=db_order.qty,
        image=db_order.image,
        option_name=db_order.option_name_list,  
        category_name=db_order.category_name,
        price=db_order.price,
        remark=db_order.remark,
        total_price=db_order.total_price,  
        status_option=db_order.status_option,
        status_menu=db_order.status_menu,
        status_order=db_order.status_order,
        status_working=db_order.status_working
    )


# Get Order by ID (GET)
@router.get("/orders/{order_id}", response_model=ResponseOrders)
def get_order_by_id(order_id: int, db: Session = Depends(get_session)):
    db_order = db.query(OrdersFood).filter(OrdersFood.orders_id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return ResponseOrders(
        orders_id=db_order.orders_id,
        name_menu=db_order.name_menu,
        qty=db_order.qty,
        image=db_order.image,
        option_name=db_order.option_name_list,  # Use the property for option names
        category_name=db_order.category_name,
        price=db_order.price,
        remark=db_order.remark,
        total_price=db_order.total_price,  # Already a float
        status_option=db_order.status_option,
        status_menu=db_order.status_menu,
        status_order=db_order.status_order,
        status_working=db_order.status_working
    )

# Get All Orders (GET)
@router.get("/orders/", response_model=List[ResponseOrders])
def get_all_orders(db: Session = Depends(get_session)):
    orders = db.query(OrdersFood).all()
    return [
        ResponseOrders(
            orders_id=order.orders_id,
            name_menu=order.name_menu,
            qty=order.qty,
            image=order.image,
            option_name=order.option_name_list,  # Use the property for option names
            category_name=order.category_name,
            price=order.price,
            remark=order.remark,
            total_price=order.total_price,  # Already a float
            status_option=order.status_option,
            status_menu=order.status_menu,
            status_order=order.status_order,
            status_working=order.status_working
        )
        for order in orders
    ]

# Delete Order by ID (DELETE)
@router.delete("/orders/{order_id}", response_model=ResponseOrders)
def delete_order(order_id: int, db: Session = Depends(get_session)):
    db_order = db.query(OrdersFood).filter(OrdersFood.orders_id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    db.delete(db_order)
    db.commit()
    return ResponseOrders(
        orders_id=db_order.orders_id,
        name_menu=db_order.name_menu,
        qty=db_order.qty,
        image=db_order.image,
        option_name=db_order.option_name_list,  # Use the property for option names
        category_name=db_order.category_name,
        price=db_order.price,
        remark=db_order.remark,
        total_price=db_order.total_price,  # Already a float
        status_option=db_order.status_option,
        status_menu=db_order.status_menu,
        status_order=db_order.status_order,
        status_working=db_order.status_working
    )

# Update Order by ID (PUT)
@router.put("/orders/{order_id}", response_model=ResponseOrders)
def update_order(order_id: int, updated_order: Createupdate, db: Session = Depends(get_session)):
    # Fetch the existing order from the database
    db_order = db.query(OrdersFood).filter(OrdersFood.orders_id == order_id).first()
    
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    # Only update the remark and status_working fields
    db_order.remark = updated_order.remark
    db_order.status_working = updated_order.status_working

    # Commit the changes and refresh the order object
    db.commit()
    db.refresh(db_order)

    # Return the updated order information
    return ResponseOrders(
        orders_id=db_order.orders_id,
        name_menu=db_order.name_menu,
        qty=db_order.qty,
        image=db_order.image,
        option_name=db_order.option_name_list,  # Use the property for option names
        category_name=db_order.category_name,
        price=db_order.price,
        remark=db_order.remark,
        total_price=db_order.total_price,  # Already a float
        status_option=db_order.status_option,
        status_menu=db_order.status_menu,
        status_order=db_order.status_order,
        status_working=db_order.status_working
    )
