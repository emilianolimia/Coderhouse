const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); // Asegúrate de que la ruta sea correcta
const User = require('../src/models/userModel'); // Asegúrate de que la ruta sea correcta

chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;

describe('Sessions Router', () => {
    before(async () => {
        // Setup initial data or configuration if necessary
    });

    after(async () => {
        // Cleanup data if necessary
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/sessions/register')
            .send({
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User'
            });
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('user');
    });

    it('should not register a user with an existing email', async () => {
        await User.create({ email: 'test@example.com', password: 'password123', name: 'Test User' });
        const res = await request(app)
            .post('/api/sessions/register')
            .send({
                email: 'test@example.com',
                password: 'password123',
                name: 'Another User'
            });
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error');
    });

    it('should log in an existing user', async () => {
        await User.create({ email: 'test@example.com', password: 'password123', name: 'Test User' });
        const res = await request(app)
            .post('/api/sessions/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
    });
});