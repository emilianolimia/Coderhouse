const faker = require('faker');

const generateMockProducts = (count = 100) => {
    const products = [];
    for (let i = 0; i < count; i++) {
        const product = {
            _id: faker.datatype.uuid(),
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.commerce.productDescription(),
            category: faker.commerce.department(),
            stock: faker.datatype.number({ min: 0, max: 100 }),
            createdAt: faker.date.past(),
            updatedAt: faker.date.recent()
        };
        products.push(product);
    }
    return products;
};

module.exports = generateMockProducts;