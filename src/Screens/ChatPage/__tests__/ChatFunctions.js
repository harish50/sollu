import React from 'react';
import {
    dayWiseFilteredMessages,
    getMessageRenderingStyles,
    getTime,
    sendMessageAndSetLastActiveTime
} from "../ChatFunctions";

describe('getTime functionality testing', () => {

    it('should return null for null parameters', () => {
        expect(getTime(0)).toBe(null);
    });

    it('should return value for defined props', function () {
        expect(getTime(true)).toBe(null);
    });

    it('should return formatted time for given input time', () => {
        let date = new Date(2018, 11, 24, 10, 33, 30, 0);
        expect(getTime({messages: "hello", createdAt: date})).toEqual('10:33');
    });
});

describe('getMessageRenderingStyles functionality testing', () => {

    it('should return false for null', () => {
        expect(getMessageRenderingStyles(null, null)).toBe(false);
    });

    it('should return true if parameters participants and item sent as true', function () {
        expect(getMessageRenderingStyles(true, true)).toBeDefined();
    });

    it('should return item if proper participants and item are given with item id 1', function () {
        let participants = {sender: 8333960577, receiver: 8639722752}, item = {_id: 1};
        let output = [[{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            borderBottomColor: 'rgba(92,94,94,0.5)',
            borderBottomWidth: 0.5
        },
            {
                flex: 1,
                borderBottomColor: 'rgba(92,94,94,0.5)',
                borderBottomWidth: 0.5,
                marginRight: 60,
                padding: 1,
                textAlign: 'justify',
                alignItems: 'center'
            }],
            {
                alignItems: 'center',
                paddingLeft: 10,
                marginRight: 60,
                fontFamily: 'Roboto-Regular',
                flexDirection: 'row'
            },
            8639722752];
        expect(getMessageRenderingStyles(participants, item)).toEqual(output);
    });

    it('should return item if proper participants and item are given with item id 0', function () {
        let participants = {sender: 8333960577, receiver: 8639722752}, item = {_id: 0};
        let output = [{
            alignItems: 'center',
            flexDirection: 'row',
            borderBottomColor: 'rgba(92,94,94,0.5)',
            borderBottomWidth: 0.5
        },
            {
                alignItems: 'center',
                fontSize: 24,
                color: 'black',
                fontFamily: 'Roboto-Regular',
                marginLeft: 10,
                flexDirection: 'row'
            },
            8333960577];
        expect(getMessageRenderingStyles(participants, item)).toEqual(output);
    });

    it('should return item if proper participants and item are given with item id 2', function () {
        let participants = {sender: 8333960577, receiver: 8639722752}, item = {_id: 2};
        let output = [[{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row-reverse',
            borderBottomColor: 'rgba(92,94,94,0.5)',
            borderBottomWidth: 0.5
        },
            {
                flex: 1,
                borderBottomColor: 'rgba(92,94,94,0.5)',
                borderBottomWidth: 0.5,
                marginRight: 60,
                padding: 1,
                textAlign: 'justify',
                alignItems: 'center'
            }],
            {
                alignItems: 'center',
                paddingRight: 10,
                marginLeft: 60,
                fontFamily: 'Roboto-Regular',
                flexDirection: 'row'
            },
            8333960577];
        expect(getMessageRenderingStyles(participants, item)).toEqual(output);
    });
});

describe('dayWiseFilteredMessages functionality testing', () => {
    it('should return empty if no messages', function () {
        expect(dayWiseFilteredMessages('')).toEqual([]);
    });

    // it('should return filtered array for input messages', function () {
    //     let messages = [{_id: 2, text: "Hehee", createdAt:new Date(2019, 2, 12, 10, 33, 30, 0) }, {_id: 2, text: "Hey", createdAt: new Date(2019, 2, 12, 10, 35, 30, 0)}]
    //     let output = [ { text: 'Mar 12 2019', header: true },
    //         { _id: 2, text: 'Hehee', createdAt: 2019-03-12T05:03:30.000Z },
    //     { _id: 2, text: 'Hey', createdAt: 2019-03-12T05:05:30.000Z } ]
    //     expect(dayWiseFilteredMessages(messages)).toEqual(output);
    // });
});

describe('sendMessageAndSetLastActiveTime functionality testing', () => {
    it('should return false for null', function () {
        expect(sendMessageAndSetLastActiveTime(null, "abc")).toBe(null);
    });
});
