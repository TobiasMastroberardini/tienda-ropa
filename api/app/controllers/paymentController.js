import mercadopago from "mercadopago";
import CartItemsModel from "../models/cartItemModel.js";
import cartModel from "../models/cartModel.js";
import ProductModel from "../models/productModel.js";

mercadopago.configure({
  access_token:
    process.env.MP_ACCESS_TOKEN ||
    "APP_USR-4538150663921858-120518-9431b9a170a8ffa2d329754a9a67fa36-313525372", // Usa process.env para manejar el Access Token de forma segura
});

const createPayment = async (req, res) => {
  try {
    const { user_id } = req.body;
    console.log(user_id);

    const cartData = await cartModel.getCartIdByuserId(user_id);
    if (!cartData) {
      return res.status(404).json({ message: "Carrito no encontrado." });
    }

    const cart_id = cartData.id;
    const cartItems = await CartItemsModel.getByCartId(cart_id);

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío." });
    }

    const productIds = cartItems.map((item) => item.product_id);
    const productPrices = await ProductModel.getPricesByIds(productIds); // Asegúrate de usar await

    if (!Array.isArray(productPrices)) {
      throw new Error("No se pudieron obtener los precios de los productos.");
    }

    const priceMap = productPrices.reduce((map, product) => {
      map[product.id] = product.price;
      return map;
    }, {});

    const items = cartItems.map((item) => {
      const price = priceMap[item.product_id];
      if (!price) {
        throw new Error(
          `No se encontró el precio para el producto con ID ${item.product_id}`
        );
      }
      return {
        title: item.name,
        quantity: item.quantity,
        currency_id: "ARS",
        unit_price: parseFloat(price),
      };
    });

    const preference = {
      items,
      back_urls: {
        success: "http://localhost:4200/payment-success",
        failure: "http://localhost:4200/payment-failure",
        pending: "http://localhost:4200/payment-pending",
      },
      auto_return: "approved",
      external_reference: String(cart_id),
    };

    const response = await mercadopago.preferences.create(preference);
    return res.status(200).json({ init_point: response.body.init_point });
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    return res.status(500).send("Error al crear la preferencia");
  }
};

const paymentSuccess = async (req, res) => {
  try {
    const { external_reference, status } = req.query;

    // Verificar que el estado sea aprobado
    if (status && status !== "approved") {
      return res.redirect(
        "https://provee-6qht0e6k3-tobiasmastroberardinis-projects.vercel.app/failure"
      );
    }

    const cart_id = parseInt(external_reference, 10);

    // Obtener los items del carrito antes de vaciarlo
    const cartItems = await CartItemsModel.getByCartId(cart_id);
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error("El carrito está vacío o no tiene items válidos.");
    }

    // Obtener el user_id a partir del cart_id
    const user_id = await cartModel.getCartIdByuserId(cart_id);
    if (!user_id) {
      throw new Error("No se pudo obtener el user_id para el carrito.");
    }

    // Calcular el total de la orden, asegurando que 'price' sea un número
    const total = cartItems.reduce((sum, item) => {
      let price = item.price;

      // Asegurarse de que 'price' sea un número
      if (typeof price === "string") {
        price = parseFloat(price); // Convertirlo si es una cadena de texto
      }

      if (isNaN(price)) {
        throw new Error(
          `El precio del item con id ${item.productId} no es válido.`
        );
      }

      return sum + item.quantity * price; // Calcular el total
    }, 0);

    // Crear la orden
    const orderId = await orderModel.createOrder({
      user_id,
      total,
      estado: "pagado", // Ajustar según corresponda
      direccion_envio: "Dirección de ejemplo", // Ajustar según tu lógica
      metodo_pago: "tarjeta", // Ajustar según corresponda
    });

    // Crear los items de la orden
    for (const item of cartItems) {
      // Validación adicional para asegurarse de que los datos del item estén completos
      if (!item.product_id || !item.quantity || item.price === undefined) {
        console.error("Datos inválidos para el item del carrito:", item);
        throw new Error(
          "Los datos del carrito están incompletos o son inválidos."
        );
      }

      // Asegurarse de que 'price' sea un número
      let price = item.price;
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

      await orderModel.createOrderItem({
        order_id: orderId,
        product_id: item.product_id,
        cantidad: item.quantity,
        precio_unitario: price, // Precio formateado
      });
    }

    // Vaciar el carrito después de crear la orden y los items
    const result = await CartItemsModel.clearCart(cart_id);
    if (result) {
    } else {
      console.warn(`No se encontró el carrito con ID ${cart_id} para vaciar.`);
    }

    // Redirigir al frontend
    return res.redirect(
      "https://provee-6qht0e6k3-tobiasmastroberardinis-projects.vercel.app/success"
    );
  } catch (error) {
    console.error("Error al procesar el éxito del pago:", error);
    return res.redirect(
      "https://provee-6qht0e6k3-tobiasmastroberardinis-projects.vercel.app/failure"
    );
  }
};

export { createPayment, paymentSuccess };
