import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

const ERP_SYSTEM_INSTRUCTION = `You are the Inventory & Operations Assistant for a professional Inventory Management System (Made by Raju Singh).
Your role is to assist warehouse supervisors, inventory clerks, and operations managers with:
- Items Management (SKU structuring, units of measure, reorder points)
- Godown Management (warehouse capacity planning, multi-location organization)
- Stock Management & Stock Transfers (inward receipts, outward dispatch, inter-godown challans)
- Opening Stock & Monthly Reports (period reconciliation, valuation summaries)
- Contractors & Manufacturing workflows (job work orders, raw material consumption, finished goods output)
- Godown Rent & Deposit tracking and User Access Governance.

Guidelines:
- Keep answers concise, practical, and structured with clear bullet points when helpful.
- Never invent fake database records; clarify that live records come from the connected Supabase database.
- Maintain a calm, professional, minimal tone.`;

interface ChatTurn {
  role: 'user' | 'model';
  text: string;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history = [], mode = 'general' } = req.body as {
        message?: string;
        history?: ChatTurn[];
        mode?: 'general' | 'fast';
      };

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Message is required.' });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        res.status(503).json({
          error:
            'Gemini API key is not configured yet. Please check Settings > Secrets to attach your API key.',
        });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const selectedModel =
        mode === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash';

      const formattedHistory = Array.isArray(history)
        ? history
            .filter(
              (turn) =>
                turn &&
                (turn.role === 'user' || turn.role === 'model') &&
                typeof turn.text === 'string' &&
                turn.text.trim().length > 0
            )
            .map((turn) => ({
              role: turn.role,
              parts: [{ text: turn.text }],
            }))
        : [];

      const chat = ai.chats.create({
        model: selectedModel,
        history: formattedHistory,
        config: {
          systemInstruction: ERP_SYSTEM_INSTRUCTION,
        },
      });

      const response = await chat.sendMessage({
        message: message.trim(),
      });

      res.json({
        reply: response.text ?? 'No response generated.',
        model: selectedModel,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to process chat request.';
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Inventory Management System server listening on port ${PORT}`);
  });
}

startServer();
