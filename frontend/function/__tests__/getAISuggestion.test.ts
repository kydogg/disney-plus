import { InvocationContext } from '@azure/functions';

// Mock OpenAI before importing the function
const mockCreate = jest.fn();
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: (...args: any[]) => mockCreate(...args),
      },
    },
  }));
});

import { getAISuggestionYoutube } from '../src/functions/getAISuggestion';

describe('getAISuggestionYoutube', () => {
  let mockContext: InvocationContext;

  beforeEach(() => {
    // Mock InvocationContext
    mockContext = {
      log: jest.fn(),
      error: jest.fn(),
    } as any;

    // Reset mocks
    jest.clearAllMocks();
  });

  it('returns AI suggestions for valid term', async () => {
    const mockRequest = {
      url: 'http://test.com/api/getaisuggestion?term=star%20wars',
      query: {
        get: jest.fn((key: string) => (key === 'term' ? 'star wars' : null)),
      },
    } as any;

    const mockCompletion = {
      choices: [
        {
          message: {
            content: 'Based on your love for Star Wars, here are some suggestions:\n1. Star Trek\n2. Guardians of the Galaxy\n3. Interstellar',
          },
        },
      ],
    };

    mockCreate.mockResolvedValue(mockCompletion);

    const result = await getAISuggestionYoutube(mockRequest, mockContext);

    expect(result.status).toBe(200);
    expect(result.body).toContain('Star Trek');
    expect(result.body).toContain('Guardians of the Galaxy');
    expect(mockContext.log).toHaveBeenCalledWith(
      'Requesting AI suggestions for term: star wars'
    );
  });

  it('returns 400 when term parameter is missing', async () => {
    const mockRequest = {
      url: 'http://test.com/api/getaisuggestion',
      query: {
        get: jest.fn(() => null),
      },
    } as any;

    const result = await getAISuggestionYoutube(mockRequest, mockContext);

    expect(result.status).toBe(400);
    expect(result.body).toBe("Please provide a 'term' query parameter");
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('returns 400 when term is empty string', async () => {
    const mockRequest = {
      url: 'http://test.com/api/getaisuggestion?term=',
      query: {
        get: jest.fn((key: string) => (key === 'term' ? '' : null)),
      },
    } as any;

    const result = await getAISuggestionYoutube(mockRequest, mockContext);

    expect(result.status).toBe(400);
    expect(result.body).toBe("Please provide a 'term' query parameter");
  });

  it('handles OpenAI API errors gracefully', async () => {
    const mockRequest = {
      url: 'http://test.com/api/getaisuggestion?term=avengers',
      query: {
        get: jest.fn((key: string) => (key === 'term' ? 'avengers' : null)),
      },
    } as any;

    const mockError = new Error('OpenAI API rate limit exceeded');
    mockCreate.mockRejectedValue(mockError);

    const result = await getAISuggestionYoutube(mockRequest, mockContext);

    expect(result.status).toBe(500);
    expect(result.body).toContain('OpenAI API rate limit exceeded');
    expect(mockContext.error).toHaveBeenCalledWith('ERROR >>>>', mockError);
  });

  it('logs the AI response', async () => {
    const mockRequest = {
      url: 'http://test.com/api/getaisuggestion?term=comedy',
      query: {
        get: jest.fn((key: string) => (key === 'term' ? 'comedy' : null)),
      },
    } as any;

    const mockSuggestion = 'Here are some great comedies:\n1. The Hangover\n2. Superbad\n3. Step Brothers';
    const mockCompletion = {
      choices: [
        {
          message: {
            content: mockSuggestion,
          },
        },
      ],
    };

    mockCreate.mockResolvedValue(mockCompletion);

    await getAISuggestionYoutube(mockRequest, mockContext);

    expect(mockContext.log).toHaveBeenCalledWith(
      `AI Response received: ${mockSuggestion}`
    );
  });

  it('calls OpenAI with correct parameters', async () => {
    const mockRequest = {
      url: 'http://test.com/api/getaisuggestion?term=action',
      query: {
        get: jest.fn((key: string) => (key === 'term' ? 'action' : null)),
      },
    } as any;

    const mockCompletion = {
      choices: [{ message: { content: 'Test suggestions' } }],
    };

    mockCreate.mockResolvedValue(mockCompletion);

    await getAISuggestionYoutube(mockRequest, mockContext);

    expect(mockCreate).toHaveBeenCalledWith({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: expect.stringContaining('digital video assistant'),
        },
        {
          role: 'user',
          content: 'I like: action',
        },
      ],
    });
  });

  it('sets correct content-type header', async () => {
    const mockRequest = {
      url: 'http://test.com/api/getaisuggestion?term=drama',
      query: {
        get: jest.fn((key: string) => (key === 'term' ? 'drama' : null)),
      },
    } as any;

    const mockCompletion = {
      choices: [{ message: { content: 'Drama suggestions' } }],
    };

    mockCreate.mockResolvedValue(mockCompletion);

    const result = await getAISuggestionYoutube(mockRequest, mockContext);

    expect(result.headers).toEqual({
      'Content-Type': 'text/plain',
    });
  });

  it('returns "No suggestion" when OpenAI returns empty content', async () => {
    const mockRequest = {
      url: 'http://test.com/api/getaisuggestion?term=test',
      query: {
        get: jest.fn((key: string) => (key === 'term' ? 'test' : null)),
      },
    } as any;

    const mockCompletion = {
      choices: [{ message: { content: null } }],
    };

    mockCreate.mockResolvedValue(mockCompletion);

    const result = await getAISuggestionYoutube(mockRequest, mockContext);

    expect(result.body).toBe('No suggestion');
  });
});
