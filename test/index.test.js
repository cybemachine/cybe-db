const DB = require('../dist/index').default;
const { expect } = require('chai');

it('import check', () => {
    expect(DB).to.be.a('function');
})