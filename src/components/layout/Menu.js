import Link from "next/link";
import Nav from "react-bootstrap/Nav";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import CartInfoComponent from "../menuComponents/CartInfoComponent";
import { useEffect, useState } from "react";

const Menu = () => {
  const router = useRouter();
  const orderingCart = useSelector((state) => state.orderingCartReducer);
  const [indexOpen, setIndexOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [showCartBlock, setShowCartBlock] = useState(false);
  const [qtyInCart, setQtyInCart] = useState(0);

  const pathWithCartBlock = ["/", "/category/[categoryId]"];

  useEffect(() => {
    const homeLink = document.getElementById("home_nav_link");
    const cartLink = document.getElementById("cart_nav_link");
    const orderLink = document.getElementById("order_nav_link");
    if (router.isReady) {
      if (router.route == "/" || router.route == "/category/[categoryId]") {
        setShowCartBlock(true);
      } else {
        setShowCartBlock(false);
      }

      if (router.route == "/") {
        homeLink.classList.add("active");
        cartLink.classList.remove("active");
        orderLink.classList.remove("active");
        setIndexOpen(true);
        setCartOpen(false);
        setOrderOpen(false);
      } else if (router.route == "/cart") {
        homeLink.classList.remove("active");
        cartLink.classList.add("active");
        orderLink.classList.remove("active");
        setIndexOpen(false);
        setCartOpen(true);
        setOrderOpen(false);
      } else if (router.route == "/order") {
        homeLink.classList.remove("active");
        cartLink.classList.remove("active");
        orderLink.classList.add("active");
        setIndexOpen(false);
        setCartOpen(false);
        setOrderOpen(true);
      } else {
        homeLink.classList.remove("active");
        cartLink.classList.remove("active");
        orderLink.classList.remove("active");
        setIndexOpen(false);
        setCartOpen(false);
        setOrderOpen(false);
      }
    }
  }, [router]);

  useEffect(() => {
    const __next_div = document.getElementById("__next");
    if (orderingCart.orderItems.length > 0) {
      __next_div.style.paddingBottom = "180px";
      let tempQty = 0;
      const { orderItems } = orderingCart;
      for (let i = 0; i < orderItems.length; i++) {
        tempQty += orderItems[i].qty;
      }
      setQtyInCart(tempQty);
    } else {
      __next_div.style.paddingBottom = "30px";
    }
  }, [orderingCart]);

  return (
    <>
      {/* 
            Check if cart has any items.
            If Items are there in cart then render the red block which shows number of items in cart, amount to pay, link to cart.
        */}
      {showCartBlock && orderingCart.orderItems.length > 0 ? (
        <CartInfoComponent
          numOfQty={qtyInCart}
          total={orderingCart.total}
          subTotal={orderingCart.subTotal}
        />
      ) : null}

      {/* Bottom Navigation Bar */}
      <Nav variant="pills" className="d-flex justify-content-center main-menu">
        <Nav.Item className="mr-auto">
          <Link href="/" passHref>
            <Nav.Link id="home_nav_link">
              <img src="/home.svg" alt="home" />

              <span className="ml10">Home</span>
            </Nav.Link>
          </Link>
        </Nav.Item>
        <Nav.Item className="mr-auto">
          <Link href="/cart" passHref>
            <Nav.Link id="cart_nav_link">
              {cartOpen ? (
                <>
                  <img src="/bag-active.svg" alt="home" />
                </>
              ) : (
                <img src="/bag.svg" alt="home" />
              )}
              <span className="ml10">Cart</span>
            </Nav.Link>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link href="/order" passHref>
            <Nav.Link id="order_nav_link">
              {orderOpen ? (
                <img src="/order-active.svg" alt="home" />
              ) : (
                <img src="/order.svg" alt="home" />
              )}
              <span className="ml10">Order</span>
            </Nav.Link>
          </Link>
        </Nav.Item>
      </Nav>
    </>
  );
};

export default Menu;
