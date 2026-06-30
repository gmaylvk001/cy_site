'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { jsPDF } from "jspdf";
import { ToastContainer, toast } from 'react-toastify';
import { FaPhoneAlt,  FaStore  } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { IoWalletSharp } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlineLocalShipping, MdDeliveryDining, MdContacts } from "react-icons/md";

const OrderDetails = () => {
  const params = useParams();
  const orderId = params?.orderId;
  const [isUpdating, setIsUpdating] = useState(false);
 
  // FOR ORDER HISTORY
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");

  const [order, setOrder] = useState(null);
  const paymentStatus = (order?.payment_status || "pending").toLowerCase();
  const orderProductsSubtotal = order?.order_details?.reduce(
    (sum, item) => sum + Number(item.product_price || 0) * Number(item.quantity || 0),
    0
  ) || 0;
  const orderShippingCost = Math.max(0, Number(order?.order_amount || 0) - orderProductsSubtotal);

  const formatCurrency = (value) =>
    `Rs. ${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString("en-IN") : "N/A";

  const getImageDataUrl = async (src) => {
    const response = await fetch(src);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const generateInvoice = async () => {
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const rightEdge = pageWidth - margin;
      let y = 16;

      const drawHeader = async () => {
        try {
          const logo = await getImageDataUrl("/assets/images/cw-logo.png");
          doc.addImage(logo, "PNG", margin, y, 34, 17);
        } catch (error) {
          console.error("Logo load failed:", error);
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(128, 128, 0);
        doc.text("Cycle World", margin + 40, y + 8);
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text("Invoice", rightEdge, y + 8, { align: "right" });
        doc.text(`Order #${order.order_number || orderId}`, rightEdge, y + 14, { align: "right" });

        y += 25;
        doc.setDrawColor(128, 128, 0);
        doc.setLineWidth(0.5);
        doc.line(margin, y, rightEdge, y);
        y += 9;
      };

      const sectionTitle = (title) => {
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, y, pageWidth - margin * 2, 8, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(45, 45, 45);
        doc.text(title, margin + 3, y + 5.5);
        y += 12;
      };

      const detailRow = (label, value, x, rowY) => {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(70, 70, 70);
        doc.text(label, x, rowY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(35, 35, 35);
        doc.text(String(value || "N/A"), x + 28, rowY);
      };

      const ensureSpace = (neededHeight) => {
        if (y + neededHeight <= pageHeight - margin) return;
        doc.addPage();
        y = margin;
      };

      await drawHeader();

      sectionTitle("Customer Details");
      detailRow("Name:", order.order_username, margin, y);
      detailRow("Phone:", order.order_phonenumber, margin + 92, y);
      y += 7;
      detailRow("Email:", order.email_address, margin, y);
      detailRow("Store:", order.order_details?.[0]?.store_id, margin + 92, y);
      y += 7;

      doc.setFont("helvetica", "bold");
      doc.text("Address:", margin, y);
      doc.setFont("helvetica", "normal");
      const addressLines = doc.splitTextToSize(order.order_deliveryaddress || "N/A", pageWidth - margin * 2 - 28);
      doc.text(addressLines, margin + 28, y);
      y += Math.max(8, addressLines.length * 5 + 4);

      sectionTitle("Order Details");
      detailRow("Order No:", order.order_number || orderId, margin, y);
      detailRow("Date:", formatDate(order.createdAt), margin + 92, y);
      y += 7;
      detailRow("Payment:", order.payment_method || "N/A", margin, y);
      detailRow("Status:", paymentStatusLabel[paymentStatus] || "Pending", margin + 92, y);
      y += 7;
      detailRow("Delivery:", order.delivery_type || "N/A", margin, y);
      detailRow("Shipping:", orderShippingCost > 0 ? formatCurrency(orderShippingCost) : "Free Shipping", margin + 92, y);
      y += 12;

      sectionTitle("Ordered Products");

      const columns = [
        { title: "Product", x: margin, width: 68 },
        { title: "Model", x: margin + 70, width: 34 },
        { title: "Qty", x: margin + 107, width: 14, align: "center" },
        { title: "Unit Price", x: margin + 125, width: 28, align: "right" },
        { title: "Total", x: margin + 158, width: 24, align: "right" },
      ];

      const drawTableHeader = () => {
        doc.setFillColor(128, 128, 0);
        doc.rect(margin, y, pageWidth - margin * 2, 8, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        columns.forEach((column) => {
          const textX = column.align === "right" ? column.x + column.width : column.align === "center" ? column.x + column.width / 2 : column.x + 2;
          doc.text(column.title, textX, y + 5.5, { align: column.align || "left" });
        });
        y += 8;
      };

      drawTableHeader();

      doc.setTextColor(35, 35, 35);
      doc.setFont("helvetica", "normal");

      order.order_details?.forEach((item) => {
        const unitPrice = Number(item.product_price || 0);
        const quantity = Number(item.quantity || 0);
        const total = unitPrice * quantity;
        const productLabel = `${item.product_name || "N/A"}${item.item_code ? ` - (${String(item.item_code).replace(/^ITEM/, "")})` : ""}`;
        const productLines = doc.splitTextToSize(productLabel, columns[0].width - 3);
        const modelLines = doc.splitTextToSize(item.model || "N/A", columns[1].width - 3);
        const rowHeight = Math.max(productLines.length, modelLines.length, 1) * 5 + 5;

        ensureSpace(rowHeight + 18);
        if (y === margin) drawTableHeader();

        doc.setDrawColor(230, 230, 230);
        doc.line(margin, y, rightEdge, y);
        doc.setFontSize(8);
        doc.text(productLines, columns[0].x + 2, y + 5);
        doc.text(modelLines, columns[1].x + 2, y + 5);
        doc.text(String(quantity), columns[2].x + columns[2].width / 2, y + 5, { align: "center" });
        doc.text(formatCurrency(unitPrice), columns[3].x + columns[3].width, y + 5, { align: "right" });
        doc.text(formatCurrency(total), columns[4].x + columns[4].width, y + 5, { align: "right" });
        y += rowHeight;
      });

      y += 4;
      ensureSpace(24);
      const subTotal = orderProductsSubtotal;
      const shippingCost = Math.max(0, Number(order.order_amount || 0) - subTotal);
      const totalsX = rightEdge - 58;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Sub-Total:", totalsX, y, { align: "right" });
      doc.text(formatCurrency(subTotal), rightEdge, y, { align: "right" });
      y += 7;
      doc.text("Shipping:", totalsX, y, { align: "right" });
      doc.text(formatCurrency(shippingCost), rightEdge, y, { align: "right" });
      y += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Total:", totalsX, y, { align: "right" });
      doc.text(formatCurrency(order.order_amount || subTotal), rightEdge, y, { align: "right" });

      doc.save(`invoice-${order.order_number || orderId}.pdf`);
    } catch (error) {
      console.error("Invoice generation failed:", error);
      toast.error("Failed to generate invoice");
    }
  };

  const paymentStatusStyles = {
    paid: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    failed: "bg-red-100 text-red-700 border-red-200",
  };

  const paymentStatusLabel = {
    paid: "Paid",
    pending: "Pending",
    failed: "Failed",
  };

  // const orderr = {
  //   history: [
  //     {
  //       date: '2025-07-22T12:00:00Z',
  //       comment: 'Order placed by user',
  //       status: 'Pending',
  //       customer_notified: true,
  //     },
  //     {
  //       date: '2025-07-23T08:30:00Z',
  //       comment: 'Order packed and ready to ship',
  //       status: 'Processing',
  //       customer_notified: false,
  //     },
  //     {
  //       date: '2025-07-23T14:00:00Z',
  //       comment: 'Order shipped via BlueDart',
  //       status: 'Shipped',
  //       customer_notified: true,
  //     },
  //   ],
  // };

const addHistory = async () => {
  if (!status || !comment) {
    toast.error("Please select a status and add a comment");
    return;
  }

  setIsUpdating(true);
  try {
    const res = await fetch(`/api/allorders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        comment,
        customer_notified: true,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Failed to update history:", data);
      toast.error("Failed to update history");
    } else {
      console.log("✅ History updated", data);
      setOrder(data);
      setStatus("");
      setComment("");
      toast.success("History updated successfully!");
    }
  } catch (err) {
    console.error("❌ Network error:", err);
    toast.error("Network error occurred");
  } finally {
    setIsUpdating(false);
  }
};
  useEffect(() => {
    if (orderId) {
      fetch(`/api/allorders/${orderId}`)
        .then(res => res.json())
        .then(data => setOrder(data))
        .catch(err => console.error("Fetch error:", err));
    }
  }, [orderId]);

  if (!order) return <p className="text-center mt-10">Loading...</p>;
  // console.log('Order:', order);


  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto bg-white">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-700">Orders</h2>
      <ToastContainer />

      {/* Top Grid */}
      <div className="grid grid-cols-3 gap-6">
  {/* Order Details */}
  <div className="bg-white shadow rounded overflow-hidden">
    <table className="w-full text-sm text-gray-700">
      <thead>
        <tr className="bg-gray-100 border-b">
          <th className="p-2 text-left" colSpan={4}>Order Details</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b">
          <td className="p-2 flex items-center gap-2 font-semibold text-gray-700">
            <IoWalletSharp className="bg-green-400 text-white p-1 rounded-md w-6 h-6" />
            Payment:
          </td>
          <td className="p-2">
            <div className="flex flex-col gap-2">
              <span>{order.payment_method || "N/A"}</span>
              <span
                className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                  paymentStatusStyles[paymentStatus] || paymentStatusStyles.pending
                }`}
              >
                {paymentStatusLabel[paymentStatus] || "Pending"}
              </span>
            </div>
          </td>
        </tr>
        <tr className="border-b">
          <td className="p-2 flex items-center gap-2 font-semibold text-gray-700">
            <MdDateRange className="bg-green-400 text-white p-1 rounded-md w-6 h-6" />
            Date: </td>
          <td className="p-2 ">{new Date(order.createdAt).toLocaleDateString()}</td>
        </tr>
       
        <tr className="border-b">
          <td className="p-2 flex items-center gap-2 font-semibold text-gray-700">
            <MdDeliveryDining className="bg-green-400 text-white p-1 rounded-md w-6 h-6" />
            Pickup:</td>
          <td className="p-2">
            {order.delivery_type === "store_pickup" ? (
              <span className="py-0.5 text-white px-2 bg-green-400 rounded">{order.delivery_type}</span>
            ):(
              order.delivery_type
            )}
            
          </td>
        </tr>
        <tr>
          <td className="p-2 flex items-center gap-2 font-semibold text-gray-700">
            <MdOutlineLocalShipping className="bg-green-400 text-white p-1 rounded-md w-6 h-6" />
            Shipping:</td>
          <td className="p-2">{orderShippingCost > 0 ? `Rs. ${orderShippingCost.toLocaleString("en-IN")}` : "Free Shipping"}</td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* Customer Details */}
  <div className="bg-white shadow rounded overflow-hidden">
    <table className="w-full text-sm text-gray-700">
      <thead>
        <tr className="bg-gray-100 border-b">
          <th className="p-2 text-left" colSpan={2}>Customer Details</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b">
          <td className="p-2 flex items-center gap-2 font-semibold text-gray-700">
            <MdContacts className="bg-green-400 text-white p-1 rounded-md w-6 h-6" />
            Name:</td>
          <td className="p-2">{order.order_username}</td>
        </tr>
        <tr className="border-b">
          <td className="p-2 flex items-center gap-2 font-semibold text-gray-700">
            <FaPhoneAlt className="bg-green-400 text-white p-1 rounded-md w-6 h-6" />
            Phone:</td>
          <td className="p-2">{order.order_phonenumber}</td>
        </tr>
        <tr className="border-b"> 
          <td className="p-2 flex items-center gap-2 font-semibold text-gray-700">
            <FaStore className="bg-green-400 text-white p-1 rounded-md w-6 h-6" />
            store:</td>
         <td className="p-2">{order.order_details?.[0]?.store_id}</td>

        </tr>
        <tr>
          <td className="p-2 flex items-center gap-2 font-semibold text-gray-700">
            <IoMdMail className="bg-green-400 text-white p-1 rounded-md w-6 h-6" />
            email:</td>
          <td className="p-2">{order.email_address}</td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* Options / Invoice */}
  <div className="bg-white shadow rounded overflow-hidden">
    <table className="w-full text-sm text-gray-700">
      <thead>
        <tr className="bg-gray-100 border-b">
          <th className="p-2 text-left" colSpan={2}>Options</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b">
          <td className="p-2" colSpan={2}>
            <textarea
              className="w-full border rounded p-2 text-sm"
              placeholder="Note: Maximum 150 characters allowed"
              maxLength={150}
              rows={3}
            />
          </td>
        </tr>
        <tr>
          <td className="p-2" colSpan={2}>
            <button
              onClick={generateInvoice}
              className="bg-green-400 text-white px-4 py-2 rounded text-sm hover:bg-red-600 w-full"
            >
              Generate Invoice
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


      {/* Order Info */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold text-gray-600 border-b pb-2">Order #{order.order_number}</h3>
        {/* Address */}
        <div className="mt-4">
  <table className="w-full border text-sm text-gray-700">
    <thead>
      <tr className="bg-gray-100 border-b">
        <th className="p-2 text-left">Delivery Address</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="p-2">{order.order_deliveryaddress}</td>
      </tr>
    </tbody>
  </table>
</div>



        {/* Product Table */}
        <div className="mt-4">
          <table className="w-full border text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">Model</th>
                <th className="p-2 text-center">Qty</th>
                <th className="p-2 text-right">Unit Price</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
 {order.order_details?.map((item, i) => (
  <tr key={i} className="border-b">
    <td className="p-2">
  {item.slug ? (
    <a 
      href={`/product/${item.slug}`} 
      className="text-blue-600 hover:underline"
    >
      {item.product_name} - ({item.item_code.replace(/^ITEM/, "")})
    </a>
  ) : (
    <span>
      {item.product_name} - ({item.item_code.replace(/^ITEM/, "")})
    </span>
  )}
</td>

    <td className="p-2">{item.model}</td>
    <td className="p-2 text-center">{item.quantity}</td>
    <td className="p-2 text-right">₹{Number(item.quantity * item.product_price).toLocaleString("en-IN")}</td>
    <td className="p-2 text-right">₹{Number(item.quantity * item.product_price).toLocaleString("en-IN")}</td>
  </tr>
))}
  <tr className="font-semibold">
    <td colSpan="4" className="p-2 text-right">Sub-Total:</td>
    {/* <td className="p-2 text-right">₹{order.sub_total}</td> */}
    <td className="p-2 text-right">Rs. {orderProductsSubtotal.toLocaleString("en-IN")}</td>
  </tr>
  <tr>
    <td colSpan="4" className="p-2 text-right">Shipping:</td>
    {/* <td className="p-2 text-right">₹{order.shipping_fee}</td> */}
     <td className="p-2 text-right">Rs. {orderShippingCost.toLocaleString("en-IN")}</td>
  </tr>
  <tr className="font-bold bg-gray-100">
    <td colSpan="4" className="p-2 text-right">Total:</td>
    <td className="p-2 text-right">₹{Number(order.order_amount).toLocaleString("en-IN")}</td>
  </tr>
</tbody>

          </table>
        </div>


        {/* Order History */}
<div className="bg-white p-4 shadow rounded mt-6">
  <h3 className="font-semibold text-gray-600 border-b pb-2">Order History</h3>

  {/* Order History Table */}
  <table className="w-full text-sm mt-3 border text-gray-700">
    <thead>
      <tr className="bg-gray-100 border-b">
        <th className="p-2">Date Added</th>
        <th className="p-2">Comment</th>
        <th className="p-2">Status</th>
        <th className="p-2 text-center">Customer Notified</th>
      </tr>
    </thead>
    <tbody>
      {order.order_history?.map((entry, i) => (
        <tr key={i} className="border-b">
          <td className="p-2">{new Date(entry.date).toLocaleDateString()}</td>
          <td className="p-2">{entry.comment}</td>
          <td className="p-2">{entry.status}</td>
          <td className="p-2 text-center">
            {entry.customer_notified ? "Yes" : "No"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Add Order History Form */}
  <div className="mt-6">
    <h4 className="font-semibold text-gray-600 border-b pb-2">
      Add Order History
    </h4>

    {/* Order Status Dropdown */}
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Order Status
      </label>
     <select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
>
  <option>Choose</option>
  <option value="Cancelled">Cancelled</option>
  <option value="Shipped">Shipped</option>
  <option value="Accepted">Accepted</option>
</select>
    </div>

    {/* Comment Box */}
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Comment
      </label>
      <textarea
  value={comment}
  onChange={(e) => setComment(e.target.value)}
  className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
  rows={3}
  placeholder="Enter comment here..."
></textarea>
    </div>

    {/* Add History Button */}
    <div className="mt-4">
      <button
  onClick={addHistory}
  disabled={isUpdating}
  className="bg-green-400 text-white px-4 py-2 rounded text-sm hover:bg-red-600 disabled:bg-gray-400"
>
  {isUpdating ? "Adding..." : "+ Add History"}
</button>
    </div>
  </div>
</div>
</div>
</div>
  );
};

export default OrderDetails;

