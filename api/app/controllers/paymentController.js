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

    // Verificar que el estado sea aprobado
    if (status && status !== "approved") {
      return res.redirect("https://localhost:4200/failure");
    }

    const cart_id = parseInt(external_reference, 10);

    // Obtener los items del carrito antes de vaciarlo
    const cartItems = await CartItemsModel.getByCartId(cart_id);
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error("El carrito está vacío o no tiene items válidos.");
    }

    // Obtener el user_id
    const user_id = userData.user_id;

    // Calcular el total de la orden, asegurando que 'price' sea un número
    const total = cartItems.reduce((sum, item) => {
      let price = item.product_price;

      // Asegurarse de que 'price' sea un número
      if (typeof price === "string") {
        price = parseFloat(price); // Convertirlo si es una cadena de texto
      }

      if (isNaN(price)) {
        throw new Error(
          `El precio del item con id ${item.product_id} no es válido.`
        );
      }

      return sum + item.quantity * price; // Calcular el total
    }, 0);

    console.log("Va a crear la order");
    // Crear la orden
    const orderId = await OrderModel.create({
      user_id,
      total,
      status: "pagado",
    });

    // Crear los items de la orden
    for (const item of cartItems) {
      // Validación adicional para asegurarse de que los datos del item estén completos
      if (
        !item.product_id ||
        !item.quantity ||
        item.product_price === undefined
      ) {
        console.error("Datos inválidos para el item del carrito:", item);
        throw new Error(
          "Los datos del carrito están incompletos o son inválidos."
        );
      }

      // Asegurarse de que 'price' sea un número
      let price = item.product_price;
      if (typeof price === "string") {
        price = parseFloat(price); // Convertirlo si es una cadena de texto
      }
      if (isNaN(price)) {
        console.error("Precio no válido para el item del carrito:", item);
        throw new Error("El precio del producto no es válido.");
      }

      // Verificar que la cantidad sea válida (número positivo)
      if (item.quantity <= 0 || isNaN(item.quantity)) {
        console.error("Cantidad no válida para el item del carrito:", item);
        throw new Error("La cantidad del producto no es válida.");
      }

      console.log("Va a crear el item");

      await OrderItemModel.create({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: price,
      });
    }

    // Vaciar el carrito después de crear la orden y los items
    const result = await CartItemsModel.clearCart(cart_id);
    if (result) {
    } else {
      console.warn(`No se encontró el carrito con ID ${cart_id} para vaciar.`);
    }

    // Redirigir al frontend
    return res.redirect("http://localhost:4200/success");
  } catch (error) {
    console.error("Error al procesar el éxito del pago:", error);
    return res.redirect("http://localhost:4200/failure");
  }
};

export { createPayment, paymentSuccess };
