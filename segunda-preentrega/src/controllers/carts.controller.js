import cartModel from "../models/cart.model.js";
import ticketModel from "../models/ticket.model.js";
import { productsModel } from "../models/products.model.js";
export const getCart = async (req, res) => {
  try {
    const cardId = req.params.cid;
    const cart = await cartModel.findOne({ _id: cardId });
    if (cart) return res.status(200).send(cart);
    else return res.status(404).send("Carrito no existe");
  } catch (e) {
    res.status(500).send(e);
  }
};

/*export const createCart = async (req, res) => {
  try {
    res.status(201).json({ message: "Carrito creado correctamente" });
  } catch (e) {
    res.status(500).send(e);
  }
};*/

export const createCart = async (req, res) => {
  try {
    console.log("↪ Entró a createCart");
    const newCart = await cartModel.create({ products: [] });
    console.log("🛒 Carrito creado:", newCart);
    res
      .status(201)
      .send({ message: "Carrito creado correctamente", cart: newCart });
  } catch (e) {
    console.error("❌ Error al crear carrito:", e.message);
    res.status(500).send({ error: e.message });
  }
};

export const insertProductCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    const cart = await cartModel.findOne({ _id: cartId });

    if (cart) {
      const indice = cart.products.findIndex((prod) => prod._id == productId);

      if (indice != -1) cart.products[indice].quantity = quantity;
      //Si el producto existe, modifico la cantidad
      else cart.products.push({ id_prod: productId, quantity: quantity });

      await cartModel.findByIdAndUpdate(cartId, cart);
      return res.status(200).send("Carrito actualizado correctamente");
    } else {
      return res.status(404).send("Carrito no existe");
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

export const deleteProductCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cart = await cartModel.findOne({ _id: cartId });

    if (cart) {
      const indice = cart.products.findIndex((prod) => prod.id == productId);

      if (indice != -1) {
        cart.products.splice(indice, 1);
        cart.save();
        return res.status(200).send("Producto eliminado correctamente");
      } else {
        return res.status(404).send("Producto no existe");
      }
    } else {
      return res.status(404).send("Carrito no existe");
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

export const deleteCart = async (req, res) => {
  try {
    const cardId = req.params.cid;
    const cart = await cartModel.findOne({ _id: cardId });
    if (cart) {
      cart.products = [];
      cart.save();
      return res
        .status(200)
        .send("Todos los productos del carrito han sido eliminados");
    } else {
      return res.status(404).send("Carrito no existe");
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

export const checkOut = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartModel.findById(cartId);
    const prodSinStock = [];
    //( "cart  "+cart );

    if (cart) {
      //verifico que todos los prod tienen stock suficiente
      for (const prod of cart.products) {
        let producto = await productsModel.findById(prod.id_prod);
        if (!producto) {
          return res
            .status(404)
            .json({ message: `Producto con ID ${prod._id} no encontrado` });
        }
        if (producto.stock - prod.quantity < 0) {
          prodSinStock.push(producto._id);
        }
      }

      if (prodSinStock.length === 0) {
        let totalAmount = 0;

        //Descuentyo el stock de cada prod y calculo el total

        for (const prod of cart.products) {
          const producto = await productsModel.findById(prod.id_prod);
          if (producto) {
            producto.stock -= prod.quantity;
            totalAmount += producto.price * prod.quantity;
            await producto.save();
          }
        }
        const newTicket = await ticketModel.create({
          code: crypto.randomUUID(),
          purchaser: req.user.email,
          amount: totalAmount,
          products: cart.products,
        });

        await cartModel.findByIdAndUpdate(cartId, { products: [] });
        res.status(200).send(newTicket);
      } else {
        //saco los prod sin stock del carrito
        prodSinStock.forEach((productId) => {
          let indice = cart.products.findIndex((prod) => prod.id == productId);
          if (indice !== -1) {
            cart.products.splice(indice, 1);
          }
        });
        await cartModel.findByIdAndUpdate(cartId, {
          products: cart.products,
        });
        res.status(400).send(prodSinStock);
      }
    } else {
      res.status(404).send("carrito no existe");
    }
  } catch (e) {
    res.status(500).send(e);
  }
};
