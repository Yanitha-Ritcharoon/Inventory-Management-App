// define class for inventory item
class Product {
  constructor(name, description, quantity, price) {
  this._id = null;
  this.name = name;
  this.description = description;
  this.quantity = quantity;
  this.price = price;
  }
}

// send HTTP request - URL will point to the API
class Inventory {
  // static variable to hold URL for API
  static url = 'https://63fff9fe63e89b0913a541f5.mockapi.io/products';

  // static method to get all products
  static getAllProduct() {
    return $.get(this.url);
  }
  // static method to get a product with a specified ID
  static getProduct(id) {
    return $.get(this.url + `/${id}`);
  }
  // static method to create a new product
  static createProduct(product) {
    return $.post(this.url, product);
  }
  // static method to update an existing product
  static updateProduct(product) {
    return $.ajax({
      url: this.url + `/${product._id}`,
      dataType: 'json',
      data: JSON.stringify(product),
      contentType: 'application/json',
      type: 'PUT'
    });
  }
  // static method to delete a product with a specified ID
  static deleteProduct(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: 'DELETE'
    });
  }
}

// DOM manager class
class DOMManager {
  // static method to get all products and render them to the DOM
  static getAllProduct() {
    Inventory.getAllProduct().then(products => {
      this.products = products;
      this.render(products);
  });
}
  // static method to create a new product and render it to the DOM
  static createProduct() {
    const name = $('#itemName').val();
    const description = $('#itemDescription').val();
    const quantity = $('#itemQuantity').val();
    const price = $('#itemPrice').val();
    console.log(name, description, quantity, price);
    // create new product and add it to the inventory
    Inventory.createProduct(new Product(name, description, quantity, price))
    .then(() => {
      // get all products and render them to the DOM
      return Inventory.getAllProduct();
    })
    .then((products) => {
      this.render(products);
      // clear input fields
      $('#itemName').val('');
      $('#itemDescription').val('');
      $('#itemQuantity').val('');
      $('#itemPrice').val('');
    });
  }
  // static method to delete a product with a specified ID and render the updated inventory to the DOM
  static deleteProduct(id) {
     Inventory.deleteProduct(id).then(() => {
      return Inventory.getAllProduct();
     }).then((products) => {
      this.render(products);
     });
  }
  // static method to render products to the DOM
  static render(products) {
    $('#inventoryTableBody').empty();
    for (let product of products) {
      $('#inventoryTableBody').prepend(
        `
        <tr id="${product._id}">
          <td>${product.name}</td>
          <td>${product.description}</td>
          <td>${product.quantity}</td>
          <td>${product.price}</td>
          <td>
            <button class="btn btn-danger" onclick="DOMManager.deleteProduct('${product._id}')">Delete</button>
          </td>
        <tr>
        `
      )
    }
  }
}

// event listener for creating a new product 
$('#create-new-product').click((event) => {
  event.preventDefault();
  DOMManager.createProduct($('#itemName').val(), $('#itemDescription').val(), $('#itemQuantity').val(), $('#itemPrice').val());
});

DOMManager.getAllProduct();


