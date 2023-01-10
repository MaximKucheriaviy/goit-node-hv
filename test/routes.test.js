const {describe, expect, test} = require('@jest/globals');
const validator = require('../validation/validation')

describe('login', () => {
    beforeAll(() => {
        console.log("this is before all");
    })
    test('validation check', () => {
        const result = validator.userDataSchema.validate({
            email: "maxim-k@i.ua",
            password: "123212321"
        })
        expect(result.error).toBeUndefined();
    })
    test('validation check', () => {
        const result = validator.userDataSchema.validate({
            email: "maxim-k@i.ua",
        })
        expect(result.error).not.toBeUndefined();
    })
})
