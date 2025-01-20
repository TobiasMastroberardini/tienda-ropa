import mercadopago from "mercadopago";
import CartItemsModel from "../models/cartItemModel.js";
import cartModel from "../models/cartModel.js";
import OrderItemModel from "../models/orderItemModel.js";
import OrderModel from "../models/orderModel.js";

const userData = {};

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

const createPayment = async (req, res) => {
  try {
    const { user_id } = req.body;

    userData.user_id = user_id;

    // Obtener el ID del carrito
    const cartData = await cartModel.getCartIdByuserId(user_id);
    if (!cartData) {
      return res.status(404).json({ message: "Carrito no encontrado." });
    }

    const cart_id = cartData.id;

    // Obtener los items del carrito basado en cart_id
    const cartItems = await CartItemsModel.getByCartId(cart_id);

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío." });
    }

    // Preparar los items para Mercado Pago
    const items = cartItems.map((item) => ({
      title: item.name,
      quantity: item.quantity,
      currency_id: "ARS",
      unit_price: parseFloat(item.product_price),
    }));

    const preference = {
      items: items,
      back_urls: {
        success: "http://localhost:3000/api/payments/success",
        failure: "http://localhost:4200/failure",
      },
      auto_return: "approved",
      external_reference: String(cart_id), // Convertir a string
    };

    // Crear preferencia de pago
    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    res.status(500).send("Error al crear la preferencia");
  }
};

const paymentSuccess = async (req, res) => {
  try {
    const { external_reference, status } = req.query;

    console.log("Datos recibidos:", { external_reference, status });

    // Verificar que el estado sea aprobado
    if (status && status !== "approved") {
      console.warn("Estado de pago no aprobado:", status);
      return res.redirect("https://localhost:4200/failure");
    }

    const cart_id = parseInt(external_reference, 10);
    console.log("ID del carrito obtenido:", cart_id);

    // Obtener los items del carrito antes de vaciarlo
    const cartItems = await CartItemsModel.getByCartId(cart_id);
    console.log("Items del carrito obtenidos:", cartItems);

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      console.error("El carrito está vacío o no tiene items válidos.");
      throw new Error("El carrito está vacío o no tiene items válidos.");
    }

    const user_id = userData.user_id;
    console.log("ID del usuario obtenido:", user_id);

    // Calcular el total de la orden
    const total = cartItems.reduce((sum, item) => {
      let price = item.product_price;

      if (typeof price === "string") {
        price = parseFloat(price);
      }

      if (isNaN(price)) {
        console.error(`Precio inválido en item:`, item);
        throw new Error(
          `El precio del item con id ${item.product_id} no es válido.`
        );
      }

      return sum + item.quantity * price;
    }, 0);

    console.log("Total calculado para la orden:", total);

    // Crear la orden
    console.log("Creando la orden...");
    const order = await OrderModel.create({
      user_id,
      total,
      status: "pagado",
    });
    console.log("Orden creada con ID:", order);

    // Crear los items de la orden
    for (const item of cartItems) {
      console.log("Procesando item del carrito:", item);

      await OrderItemModel.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product_price,
      });

      console.log("Item insertado en la orden:", item);
    }

    // Vaciar el carrito
    console.log("Vaciando el carrito...");
    const result = await CartItemsModel.clearCart(cart_id);
    if (result) {
      console.log("Carrito vaciado correctamente.");
    } else {
      console.warn(`No se encontró el carrito con ID ${cart_id} para vaciar.`);
    }

    return res.redirect("http://localhost:4200/success");
  } catch (error) {
    console.error("Error al procesar el éxito del pago:", error);
    return res.redirect("http://localhost:4200/failure");
  }
};

export { createPayment, paymentSuccess };
