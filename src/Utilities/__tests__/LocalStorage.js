import {getNameFromLocalStorage, setToLocalStorage} from '../LocalStorage';
import MockAsyncStorage from 'mock-async-storage'

const mock = () => {
    console.log("mock implementstaion");
    const mockImpl = new MockAsyncStorage();
    jest.mock('AsyncStorage', () => mockImpl);
};

mock();

it('should test Mock Async Storage', async () => {
    await setToLocalStorage('Anjali', '8333960577');
    const value = await getNameFromLocalStorage('Anjali');
    console.log(value);
    expect(value).toBe('8333960577');
});

it('should tests mock async storage set and get functionality', async () => {
    await setToLocalStorage('Harika', 1234567890);
    const value = await getNameFromLocalStorage('Harika');
    console.log(value);
    expect(value).toBe(1234567890);
});