import '@testing-library/jest-dom'

// Polyfill for TextEncoder/TextDecoder needed by Azure Functions
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
