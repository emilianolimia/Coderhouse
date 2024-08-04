const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); // Asegúrate de que la ruta sea correcta
const Cart = require('../src/models/cart'); // Asegúrate de que la ruta sea correcta

chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;

describe('Carts Router', () => {
    before(async () => {
        // Setup initial data or configuration if necessary
    });

    after(async () => {
        // Cleanup data if necessary
    });

    it('should create a new cart', async () => {
        const res = await request(app).post('/api/carts');
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('cart');
    });

    it('should add a product to the cart', async () => {
        const cart = await Cart.create({});
        const res = await request(app)
            .post(`/api/carts/${cart._id}/product/someProductId`)
            .send({ quantity: 2 });
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Producto agregado al carrito correctamente');
    });

    it('should get a cart by ID', async () => {
        const cart = await Cart.create({});
        const res = await request(app).get(`/api/carts/${cart._id}`);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('cart');
    });
});