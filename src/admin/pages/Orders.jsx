import React, { useEffect, useState } from "react";
import { initialOrders } from "../data/orders";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";
import axiosClient from "../../api/axiosClient";
import ProductCard from "../components/ProductCard";
import almondsImg from "../../assets/almonds.png";
import cashewsImg from "../../assets/cashews.png";
import walnutsImg from "../../assets/walnuts.png";
import { io as ioClient } from "socket.io-client";

// ✅ API base strictly from env
const API_BASE = import.meta.env.VITE_API_URL;

const Orders = () => {
  const [orders, setOrders] = useState(() => {
    const stored = getFromLocalStorage("orders", null);
    if (stored && Array.isArray(stored) && stored.length) return stored;
    return initialOrders;
  });
  const [query, setQuery] = useState("");

  useEffect(() => saveToLocalStorage("orders", orders), [orders]);

  // 🔌 Realtime: listen for new orders from backend
  useEffect(() => {
    if (!API_BASE) {
      console.warn("Socket disabled: VITE_API_URL not set");
      return;
    }

    // Socket connects to backend ROOT, not /api
    const socket = ioClient(API_BASE, {
      transports: ["websocket"],
    });

    socket.on("newOrder", (o) => {
      if (!o || typeof o !== "object") return;
      const items = (o.items || []).map((it) => ({
        name: (it.product && it.product.name) || it.name || "Product",
        qty: it.quantity || it.qty || 1,
        image: (it.product && it.product.image) || it.image || "",
      }));

      const addr =
        typeof o.address === "string"
          ? o.address
          : o.address
          ? Object.values(o.address).filter(Boolean).join(", ")
          : "";

      const getCustomerName = (order) => {
        if (order.address && order.address.name) return order.address.name;
        if (order.user) {
          const name = order.user.username || order.user.name || "";
          if (name && name.toLowerCase() !== "user") return name;
          if (order.user.email) return order.user.email.split("@")[0];
        }
        if (order.customer) return order.customer;
        if (order.email) return (order.email || "").split("@")[0];
        return "User";
      };

      const mapped = {
        id: o._id || o.id,
        customer: getCustomerName(o),
        email: (o.user && o.user.email) || o.email || "",
        date: new Date(
          o.createdAt || o.date || Date.now()
        ).toLocaleDateString(),
        total: o.totalAmount || o.total || 0,
        status: o.status || "Pending",
        paymentMode:
          o.paymentMethod === "RAZORPAY"
            ? "Prepaid"
            : o.paymentMethod || o.paymentMode || "Prepaid",
        address: addr,
        items,
      };

      setOrders((prev) => {
        if (prev.some((p) => p.id === mapped.id)) return prev;
        return [mapped, ...prev];
      });
    });

    return () => socket.disconnect();
  }, []);

  // 📦 Fetch orders from backend (admin)
  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      try {
        const { data } = await axiosClient.get("/admin/orders");
        if (!mounted) return;

        const mapped = (Array.isArray(data) ? data : []).map((o) => {
          const items = (o.items || []).map((it) => ({
            name: (it.product && it.product.name) || it.name || "Product",
            qty: it.quantity || it.qty || 1,
            image: (it.product && it.product.image) || it.image || "",
          }));

          const addr =
            typeof o.address === "string"
              ? o.address
              : o.address
              ? Object.values(o.address).filter(Boolean).join(", ")
              : "";

          const getCustomerName = (order) => {
            if (order.address && order.address.name) return order.address.name;
            if (order.user) {
              const name = order.user.username || order.user.name || "";
              if (name && name.toLowerCase() !== "user") return name;
              if (order.user.email) return order.user.email.split("@")[0];
            }
            if (order.customer) return order.customer;
            if (order.email) return (order.email || "").split("@")[0];
            return "User";
          };

          return {
            id: o._id || o.id,
            customer: getCustomerName(o),
            email: (o.user && o.user.email) || o.email || "",
            date: new Date(
              o.createdAt || o.date || Date.now()
            ).toLocaleDateString(),
            total: o.totalAmount || o.total || 0,
            status: o.status || "Pending",
            paymentMode:
              o.paymentMethod === "RAZORPAY"
                ? "Prepaid"
                : o.paymentMethod || o.paymentMode || "Prepaid",
            address: addr,
            items,
          };
        });

        if (mapped.length > 0) setOrders(mapped);
      } catch {
        // fallback to local/demo orders
      }
    };

    fetchOrders();
    return () => (mounted = false);
  }, []);

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(query.toLowerCase()) ||
      o.customer.toLowerCase().includes(query.toLowerCase())
  );

  const changeStatus = (id, status) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <div className="container-fluid">
      {/* UI BELOW IS UNCHANGED */}
      {/* Your UI code stays exactly the same */}
      {/* ... */}
    </div>
  );
};

export default Orders;
