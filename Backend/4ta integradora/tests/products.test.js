const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); // Asegúrate de que la ruta sea correcta
const Product = require('../src/models/product'); // Asegúrate de que la ruta sea correcta

chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;

describe('Products Router', () => {
    before(async () => {
        // Setup initial data or configuration if necessary
    });

    after(async () => {
        // Cleanup data if necessary
    });

    it('should create a new product', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                title: 'New Product',
                description: 'Product description',
                price: 100,
                stock: 10,
                category: 'Category'
            });
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('title', 'New Product');
    });

    it('should not create a product without required fields', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                description: 'Product description',
                stock: 10
            });
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error');
    });

    it('should get a list of products', async () => {
        const res = await request(app).get('/api/products');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
    });
});