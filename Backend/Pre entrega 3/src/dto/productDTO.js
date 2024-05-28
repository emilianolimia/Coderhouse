class ProductDTO {
    constructor(title, description, category, stock, code, price, thumbnail) {
      this.title = title;
      this.description = description;
      this.category = category;
      this.stock = stock;
      this.code = code;
      this.price = price;
      this.thumbnail = thumbnail;
    }
  }
  
  module.exports = ProductDTO;  