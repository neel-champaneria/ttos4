import SingleOrderItem from "../src/components/orderComponents/singleOrderItem";
import { Money } from "./../src/utils/money";
import SingleOrder from "./../src/components/orderComponents/singleOrder";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderByQRService } from "../src/services/OrderingService";
import { Spinner } from "react-bootstrap";
import { useRouter } from "next/router";

const OrderPage = () => {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const qrInfo = useSelector((state) => state.QrReducer);
  const [responseStatus, setResponseStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [itemsArrayForCalculation, setItemsArrayForCalculation] = useState([]);

  const [lastAPICallComplete, setLastAPICallComplete] = useState(false);

  useEffect(async () => {
    setLoading(true);
    const response = await getOrderByQRService(qrInfo.qrId);
    if (response.status) {
      setOrder(response.jsonData.orders[0]);
      // const itemsFromRes = response.jsonData.orders[0].orderItems;
      setLastAPICallComplete(true);
    } else {
      if (response.error.qrExpire) {
        router.replace("./qr-expired");
      } else {
        router.replace("./something-wrong");
      }
      setErrorMsg("Something Went Wrong");
    }
    setLoading(false);
  }, []);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  function IntervalAPICall() {
    useInterval(async () => {
      if (lastAPICallComplete) {
        setLastAPICallComplete(false);
        const response = await getOrderByQRService(qrInfo.qrId);
        if (response.status) {
          setOrder(response.jsonData.orders[0]);
          setLastAPICallComplete(true);
        } else {
          if (response.error.qrExpire) {
            router.replace("./qr-expired");
          } else {
            router.replace("./something-wrong");
          }
        }
      }
    }, 10000);
  }

  return (
    <>
      {IntervalAPICall()}
      {loading ? (
        <>
          <div className="container d-flex justify-content-center align-items-center vh-100">
            <Spinner animation="border" variant="secondary" />
          </div>
        </>
      ) : (
        <>
          <div className="mb-2">
            <div className="text-center text-white table_strip">
              TABLE {qrInfo.tableName}
            </div>
          </div>
          <div className="order_quantity">
            <div className="container p0">
              <div className="d-flex p-cart mt10 mb20">
                <h1 className="cart_title mr-auto">My Orders</h1>
              </div>
            </div>
            <div className="order_quantity">
              {order && <SingleOrder order={order} />}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderPage;
