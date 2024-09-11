const { faker } = require('@faker-js/faker');

const getBasicApplication = () => Object.freeze({
  id: faker.string.uuid(),
  name: `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} ${faker.commerce.product()}`,
  keys: {
    publicKey: `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`,
  },
});

exports.getBasicApplication = getBasicApplication;
