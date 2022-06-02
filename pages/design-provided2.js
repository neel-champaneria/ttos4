import { useDispatch, useSelector } from "react-redux";
import { RE_CALCULATE_ORDER_PRICE } from "../src/constants/index";
import {
  decreaseQuantityFromCartAction,
  increaseQuantityFromCartAction,
  removeItemFromCartAction,
} from "../src/actions/OrderingCartAction";
import { useEffect, useState } from "react";
import SingleItemCart from "../src/components/cartComponent/singleCartItem";
import { useRouter } from "next/router";
import { Money } from "../src/utils/money";
import {
  ToastContainer,
  Toast,
  Spinner,
  Button,
  Navbar,
  Form,
} from "react-bootstrap";
import Link from "next/link";
import { checkOutTTOSAction } from "../src/actions/OrderingCartAction";

const CartPage = () => {
  const dispatch = useDispatch();

  const router = useRouter();

  const qrInfo = useSelector((state) => state.QrReducer);

  const orderingCart = useSelector((state) => state.orderingCartReducer);
  const promotions = useSelector((state) => state.appReducer?.promotions);
  const storeConfig = useSelector((state) => state.appReducer?.storeConfig);
  const taxConfig = useSelector((state) => state.appReducer?.taxConfig);
  const paymentConfig = useSelector((state) => state.appReducer?.paymentMethod);
  const user = useSelector((store) => store.userReducer);

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [qtyInCart, setQtyInCart] = useState(0);

  const [gotoUserInfoPage, setGotoUserInfoPage] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch({ type: RE_CALCULATE_ORDER_PRICE });
  }, [promotions, storeConfig, taxConfig, paymentConfig]);

  useEffect(() => {
    if (orderingCart) {
      if (
        orderingCart.customerName &&
        orderingCart.customerPhone &&
        orderingCart.customerEmail
      ) {
        setGotoUserInfoPage(false);
      } else {
        setGotoUserInfoPage(true);
      }
    }
  }, [orderingCart]);

  const onPlaceOrder = async () => {
    if (gotoUserInfoPage) {
      router.push("/userInfoForOrder");
    } else {
      setLoading(true);
      const {
        customerName,
        customerPhone,
        customerEmail,
        orderItems,
        subTotal,
        discount,
        total,
        totalTax,
      } = orderingCart;
      const data = {
        customerName,
        customerPhone,
        customerEmail,
        orderItems,
        subTotal,
        discount,
        total,
        totalTax,
        tableNr: qrInfo.tableId,
        paymentMethod: "COD",
      };
      const response = await dispatch(checkOutTTOSAction(data));
      console.log("chekout function created =>=> ", response);
      if (response.status) {
        router.replace("/orderPlacedSuccessfully");
        setLoading(false);
      } else {
        setLoading(false);
        setShowErrorToast(true);
      }
    }
  };

  useEffect(() => {
    if (router.isReady) {
      if (router.query?.failed === "true") {
        setShowErrorToast(true);
      }
    }
    calculateQty();
  }, [router, orderingCart]);

  const calculateQty = () => {
    if (orderingCart.orderItems.length > 0) {
      let tempQty = 0;
      const { orderItems } = orderingCart;
      for (let i = 0; i < orderItems.length; i++) {
        tempQty += orderItems[i].qty;
      }
      setQtyInCart(tempQty);
    } else {
      setQtyInCart(0);
    }
  };

  return (
    <>
      {/* Table Number */}
      <div className="mb-2">
        <div className="text-center text-white table_strip">TABLE 2</div>
      </div>
      <div className="container p0">
        <div className="d-flex p-cart mt10 mb20">
          <h1 className="cart_title mr-auto">Your Cart (2)</h1>
          <img src="/bag.svg" alt="cart" />
        </div>
      </div>

      {orderingCart.orderItems.map((item, itemIndex) => {
        return (
          <div
            className="row justify-content-md-center pb-2 mb-5"
            key={itemIndex}
          >
            <div className="col-7">
              {item.name} Pizza - topped with Chef&lsquo;s special sauce
            </div>
            <div className="col-3 d-flex">
              <div className="p-d-flex quantity-increase-decrease-container mr-auto">
                <Button
                  className="btn right-border-radius left_quantity h-46"
                  variant="danger"
                >
                  <i className="fa fa-minus"></i>
                </Button>

                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  className="input p-text-center p-ml-1 p-mr-1 h-46"
                  autoComplete="off"
                  required
                />

                <Button
                  className="btn left-border-radius right_quantity h-46"
                  variant="danger"
                >
                  <i className="fa fa-plus"></i>
                </Button>
              </div>
            </div>
            <div className="col-2">
              <p className="medium_para ">$15.00 {item.priceSum}</p>
            </div>
          </div>
        );
      })}
      <div className="cart_quantity">
        <div className="bg-white border-gray p-block container-fluid">
          <div className="row justify-content-md-center">
            <div className="col-6">
              <h2 className="medium_para mb10">
                Pizza - topped with Chef&lsquo;s special sauce
              </h2>
              <p className="medium_para mb0 pb0 red_font">Customise</p>
            </div>
            <div className="col-4 d-flex">
              <div className="p-d-flex quantity-increase-decrease-container mr-auto">
                <Button
                  className="btn right-border-radius left_quantity h-30 red_bg"
                  variant="danger"
                >
                  <i className="fa fa-minus"></i>
                </Button>

                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  className="input p-text-center p-ml-1 p-mr-1 red_text"
                  autoComplete="off"
                  required
                />

                <Button
                  className="btn left-border-radius right_quantity h-30 red_bg"
                  variant="danger"
                >
                  <i className="fa fa-plus"></i>
                </Button>
              </div>
            </div>
            <div className="col-2">
              <p className="medium_para font_semibold mt8">$15.00</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-block container-fluid">
          <div className="row justify-content-md-center">
            <div className="col-6">
              <h2 className="medium_para mb10">
                Pizza - topped with Chef&lsquo;s special sauce
              </h2>
              <p className="medium_para mb0 pb0 red_font">Customise</p>
            </div>
            <div className="col-4 d-flex">
              <div className="p-d-flex quantity-increase-decrease-container mr-auto">
                <Button
                  className="btn right-border-radius left_quantity h-30 red_bg"
                  variant="danger"
                >
                  <i className="fa fa-minus"></i>
                </Button>

                <input
                  type="number"
                  pInputText
                  id="quantity"
                  name="quantity"
                  className="input p-text-center p-ml-1 p-mr-1 red_text"
                  autoComplete="off"
                  required
                />

                <Button
                  className="btn left-border-radius right_quantity h-30 red_bg"
                  variant="danger"
                >
                  <i className="fa fa-plus"></i>
                </Button>
              </div>
            </div>
            <div className="col-2">
              <p className="medium_para font_semibold mt8">$15.00</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom_block order_block mt80">
        <div className="bg-white p_bottom">
          <div className="d-flex mb4">
            <p className="medium_para mr-auto mb0">Sub Total:</p>
            <p className="medium_para mb0">$31.00</p>
          </div>
          <div className="d-flex mb10">
            <p className="medium_para mr-auto mb0">Tax:</p>
            <p className="medium_para mb0">$31.00</p>
          </div>
          <div className="d-flex">
            <p className="medium_font font-bold mr-auto mb0">Total:</p>
            <p className="medium_font font-bold mb0">$36.00</p>
          </div>
          <button className="btn red-btn w100 mt15 medium_sizebtn">
            CONFIRM ORDER
          </button>
        </div>
      </div>

      <div className="thankyou_cart text-center">
        <div className="top_thank">
          <img src="/thankyou.png" className="mb30" />
          <h1 className="font-bold">Thankyou</h1>
          <p className="title-font font-bold mb20">for your order</p>
          <p className="medium_para bg-green text-center">
            Your order is now being processed.
          </p>
          <p className="medium_para mb70">
            Pay at the counter after finishing your delicious meal.
          </p>
        </div>
        <img src="/big-eatery.png" className="mb30" />

        <button className="btn red-btn w100 big_btn">MY ORDERS</button>
        <p className="item_title mt15 font-bold">Back To Home</p>
      </div>

      <div className="empty_cart thankyou_cart text-center h-80 mt95">
        <div className="top_thank">
          <img src="/bigcart.svg" className="mb40" />
          <p className="big_font red_font font-bold mb10">Your cart is empty</p>
          <h4 className="grey_text">
            Looks like you haven&lsquo;t made your choice yet
          </h4>
        </div>
        <button className="btn red-btn big_btn bottom_btn">ORDER FOOD</button>
      </div>
      <div className="cart_quantity">
        <div className="container p0">
          <div className="d-flex p-cart mt10 mb20">
            <h1 className="cart_title mr-auto">My Orders</h1>
          </div>
        </div>
        <div className="order_quantity">
          <div className="bg-white border-gray p-block container-fluid">
            <div className="row justify-content-md-center">
              <div className="col-6">
                <h2 className="medium_para mb10">
                  Pizza - topped with Chef&lsquo;s special sauce
                </h2>
                <button className="reorder_btn">Reorder</button>
              </div>

              <div className="col-4 offset-2 text-right">
                <p className="medium_para font_semibold mt8">$15.00</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-gray p-block container-fluid">
            <div className="row justify-content-md-center">
              <div className="col-6">
                <h2 className="medium_para mb10">
                  Pizza - topped with Chef&lsquo;s special sauce
                </h2>
                <button className="reorder_btn">Reorder</button>
              </div>

              <div className="col-4 offset-2 text-right">
                <p className="medium_para font_semibold mt8">$15.00</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom_block mb60">
          <div className="bg-white p_reorder_bottom">
            <div className="d-flex mb4">
              <p className="medium_para mr-auto mb0">Sub Total:</p>
              <p className="medium_para mb0">$31.00</p>
            </div>
            <div className="d-flex mb10">
              <p className="medium_para mr-auto mb0">Tax:</p>
              <p className="medium_para mb0">$31.00</p>
            </div>
            <div className="d-flex">
              <p className="medium_font font-bold mr-auto mb0">Total:</p>
              <p className="medium_font font-bold mb0">$36.00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="user_login text-center pt31pl34">
        <div className="header">
          <Navbar>
            <Navbar.Brand>
              <Link href="/">
                <img
                  src="/prev.svg"
                  alt="previous"
                  className="cursor-pointer"
                />
              </Link>
              <h1 className="menu_title ml10">Back</h1>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                <Form.Select
                  aria-label="Default select example"
                  className="transparent-select"
                >
                  <option>English</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>
        </div>
        <img src="/big-eatery.png" className="mb40 h-130 mt30" />
        <div className="login_content mt54 mb25">
          <p className="big_font red_font font-bold mb10">Reset Password</p>
          <h4 className="grey_text">
            Enter email associated with your account and we&lsquo;ll send
            recovery link.
          </h4>
        </div>
        <div className="form_content">
          <div className="d-flex mb15">
            <div className="mr-auto w-50">
              <Form.Control
                type="text"
                id="first_name"
                aria-describedby="numberHelpBlock"
                placeholder="First Name"
                className="h50"
              />
            </div>
            <div className="ml20 w-50">
              <Form.Control
                type="text"
                id="last_name"
                aria-describedby="numberHelpBlock"
                placeholder="Last Name"
                className="h50"
              />
            </div>
          </div>
          <Form.Control
            type="number"
            id="number"
            aria-describedby="numberHelpBlock"
            placeholder="Phone Number"
            className="mb15 h50"
          />
          <Form.Control
            type="email"
            id="email"
            aria-describedby="emailHelpBlock"
            placeholder="Password"
            className="mb5 h50"
          />
          <p className="medium_para text-right forgot_text">
            Forgot Password ?
          </p>
          <button className="btn red-btn w-100 text-capitalize ptb17 mt40">
            Order
          </button>
        </div>
        <div className="second_login">
          <div className="separator mt15">
            <h2 className="mb0 half-opacity">or Login With</h2>
          </div>
          <div className="login_icons mt20 mb15">
            <ul className="d-flex">
              <li className="grey_logo mr-auto">
                <img src="/google.svg" />
              </li>
              <li className="blue_logo mr-auto ml12">
                <img src="/facebook-logo.svg" />
              </li>
              <li className="grey_logo ml12">
                <img src="/mobile-logo.svg" />
              </li>
            </ul>
          </div>
          <p className="font_thirteen dark_text">
            Don&lsquo;t have an account?{" "}
            <a className="red_font text-underline"> Sign Up </a>
          </p>
        </div>
        <div className="poweredby_content">
          <p className="powered-font text-uppercase">
            POWERED BY : <img src="/powered.png" />
          </p>
        </div>
      </div>
    </>
  );
};

export default CartPage;
