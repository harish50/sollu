import 'jsdom-global/register';
import React from 'react';
import {isValid} from '../../Screens/LoginPage/PhoneNumber';

describe("isValid test", () => {

    it("should return false for zero",() => {
        expect(isValid(0)).toBe(false);
    });

    it("should return true for 10 digit number",() => {
        expect(isValid('8333960577')).toBe(true);
    });

    it("should return false for length not equal to 10",() => {
        expect(isValid('234567890123456789')).toBe(false);
    });
});