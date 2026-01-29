/**
 * Translation Service for io.net Translate Agent
 * Handles LLM-based translation using the io.net API
 */

export interface TranslationRequest {
    text: string;
}

export interface TranslationResponse {
    success: boolean;
    translatedText?: string;
    error?: string;
}

export interface IONetWorkflowResponse {
    result?: string;
    error?: string;
}

/**
 * Translation Service Class
 */
export class TranslationService {
    private apiKey: string;
    private apiUrl: string;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('IO_API_KEY is required for TranslationService');
        }
        this.apiKey = apiKey;
        this.apiUrl = 'https://api.intelligence.io.solutions/api/v1/workflows/run';
    }

    /**
     * Translate text to English using io.net Translate Agent
     * @param request - Translation request containing text
     * @returns Promise with translation result
     */
    async translate(request: TranslationRequest): Promise<TranslationResponse> {
        try {
            const payload = {
                objective: `Translate the following text to English. Return ONLY the translated text, nothing else. No explanations, no formatting, no arrows.\n\nText: ${request.text}`,
                agent_names: ['translation_agent'],
                args: {
                    type: 'translate_text',
                    target_language: 'English',
                },
            };

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                return {
                    success: false,
                    error: `Translation API error: ${response.status} - ${errorText}`,
                };
            }

            const data: IONetWorkflowResponse = await response.json();

            if (data.error) {
                return {
                    success: false,
                    error: data.error,
                };
            }

            
            let translatedText = data.result || '';
          

            return {
                success: true,
                translatedText: translatedText,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown translation error',
            };
        }
    }
}

/**
 * Create a singleton instance of the translation service
 */
let translationServiceInstance: TranslationService | null = null;

export function getTranslationService(): TranslationService {
    if (!translationServiceInstance) {
        const apiKey = process.env.IO_API_KEY;
        if (!apiKey) {
            throw new Error('IO_API_KEY environment variable is not set');
        }
        translationServiceInstance = new TranslationService(apiKey);
    }
    return translationServiceInstance;
}
