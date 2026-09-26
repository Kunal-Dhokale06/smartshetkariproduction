import { Request, Response } from 'express';
import { askGeminiAgronomist } from '../services/gemini-chat.service';
import { AppResponse } from '../utils/apiResponse';

export class AiController {
  /**
   * Ask SmartShetkari AI Assistant powered by Google Gemini
   * POST /api/v1/ai/chat
   */
  static async chat(req: Request, res: Response): Promise<Response> {
    try {
      const { message, language = 'mr', context } = req.body;

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return AppResponse.error(req, res, 'Question / message is required', 400);
      }

      const answer = await askGeminiAgronomist(message.trim(), language, context);

      return AppResponse.success(req, res, {
        answer,
        query: message.trim(),
        language,
        timestamp: new Date().toISOString(),
      }, 'AI response generated successfully');
    } catch (error: any) {
      console.error('[AiController] Error:', error);
      return AppResponse.error(req, res, 'Failed to process AI query', 500, error?.message);
    }
  }
}
