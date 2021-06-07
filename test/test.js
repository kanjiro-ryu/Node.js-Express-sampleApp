const test = require('../mylib');
const chai = require('chai')
var expect = chai.expect;

describe('Mocha test', () => {
    describe('test1', () => {
        it('add ', () => {
            expect(test(1, 2)).to.equal(3);
            // assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});