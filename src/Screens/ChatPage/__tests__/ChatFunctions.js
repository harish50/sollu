import React from 'react';
import {getMessageRenderingStyles, getTime, sendMessageAndSetLastActiveTime} from "../ChatFunctions";

describe('ChatFunctions getTime testing', () => {

    it('should return null for null', () => {
        expect(getTime(0)).toBe(null);
    });

    it('should return value for defined props', function () {
        expect(getTime(true)).toBeDefined();
    });

    it('should return formatted time for current time',() =>{
        let minutes = '' + new Date().getMinutes();
        if (minutes.length < 2) minutes = '0' + minutes;
        let hours = '' + new Date().getHours();
        if (hours.length < 2) hours = '0' + hours;
        let time = hours + ":" + minutes;
        expect(getTime({messages:"hello", createdAt: new Date()})).toBe(time);
    });
});

describe('getMessageRenderingStyles testing', ()=>{

    it('should return false for null',()=>{
        expect(getMessageRenderingStyles(null,null)).toBe(false);
    });

    it('should return true if contains participants and item', function () {
        expect(getMessageRenderingStyles(true,true)).toBeDefined();
    });

    it('should return item if proper participants and item are given', function () {
        let participants={sender: 1234567890, receiver:1234567890}, item={_id:1};
        expect(getMessageRenderingStyles(participants,item)).toBeDefined()
    });
});

describe('sendMessageAndSetLastActiveTime functionality testing',()=>{
    it('should return false for null', function () {
        expect(sendMessageAndSetLastActiveTime(null,"abc")).toBe(null);
    });
});
