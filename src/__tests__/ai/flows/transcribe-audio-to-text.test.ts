/**
 * @jest-environment node
 */
import { transcribeAudioToText } from '@/ai/flows/transcribe-audio-to-text';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Mock the entire genkit module to control the AI behavior
jest.mock('@/ai/genkit', () => ({
  ai: {
    definePrompt: jest.fn(),
    defineFlow: jest.fn((_, implementation) => implementation), // Immediately return the implementation
  },
}));

describe('transcribeAudioToText Flow', () => {
  const mockAudioDataUri = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhIAAAAAAAAAA=';
  const mockTranscription = 'This is a test transcription.';

  beforeEach(() => {
    // Before each test, we set up our mocks to behave as we expect.

    // 1. Mock the `definePrompt` function. We need it to return a function
    //    that simulates the AI prompt call.
    const mockPrompt = jest.fn().mockResolvedValue({
      output: { transcription: mockTranscription },
    });
    
    // Cast the mocked ai object to be able to set its implementation
    (ai.definePrompt as jest.Mock).mockReturnValue(mockPrompt);

    // 2. Mock `defineFlow`. We just need it to return the flow's implementation function
    //    so we can test it directly. The mock in jest.mock() already does this.
  });

  afterEach(() => {
    // Clear all mocks after each test to ensure a clean slate for the next test.
    jest.clearAllMocks();
  });

  it('should return a transcription for valid audio input', async () => {
    // Call the flow function with test input
    const result = await transcribeAudioToText({
      audioDataUri: mockAudioDataUri,
      language: 'en-US',
    });

    // Assert that the result matches our mock transcription
    expect(result.transcription).toBe(mockTranscription);
  });

  it('should call the underlying AI prompt with the correct media and language', async () => {
     const mockPromptFn = jest.fn().mockResolvedValue({
      output: { transcription: mockTranscription },
    });
    (ai.definePrompt as jest.Mock).mockReturnValue(mockPromptFn);
    
    const input = {
      audioDataUri: mockAudioDataUri,
      language: 'en-US',
    };
    
    // Call the flow
    await transcribeAudioToText(input);

    // Verify that the prompt function created by `definePrompt` was called with our input.
    // This confirms that our flow is correctly passing the data to the Genkit layer.
    expect(mockPromptFn).toHaveBeenCalledWith(input);
  });

  it('should handle cases where language is not provided', async () => {
    const mockPromptFn = jest.fn().mockResolvedValue({
      output: { transcription: mockTranscription },
    });
    (ai.definePrompt as jest.Mock).mockReturnValue(mockPromptFn);
    
    const input = {
      audioDataUri: mockAudioDataUri,
    };

    await transcribeAudioToText(input);

    // We check that the prompt is still called correctly, even without a language.
    expect(mockPromptFn).toHaveBeenCalledWith(input);
  });
});
