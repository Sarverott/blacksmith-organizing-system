import House from "../../models/house/class.mjs";

export const readRegistry = (context) => {
  context.house = new House(context.options.housePath);
  context.children = context.house.children();
  context.orders = context.house.orders();
};
