import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

const PlannerRequestSchema = z.object({
  targetId: z.string(),
  budget: z.number().optional().default(100),
  preferredActivity: z.string().optional()
});

router.post('/generate', (req: AuthenticatedRequest, res: Response): void => {
  const result = PlannerRequestSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid planner parameters', details: result.error.errors });
    return;
  }

  const { targetId, budget } = result.data;

  // Dynamic recommendations based on budget selection (£20, £50, £100, £250)
  let venue = "Contemporary Art Museum & Garden Espresso Bar";
  let gift = "Artisan Single-Origin Coffee Beans + Handwritten Card";
  let dressCode = "Smart Casual — Tailored blazer, clean luxury sneakers";

  if (budget <= 20) {
    venue = "Scenic Botanical Gardens Walk + Organic Espresso Bar";
    gift = "Succulent Plant in Ceramic Pot";
    dressCode = "Casual Chic — Clean denim, comfortable loafers";
  } else if (budget <= 50) {
    venue = "Indie Bookstore & Speakeasy Jazz Lounge";
    gift = "First-Edition Paperback of a Shared Favorite Author";
    dressCode = "Smart Casual — Layered knit sweater or relaxed blazer";
  } else if (budget <= 100) {
    venue = "Contemporary Art Museum & Rooftop Cocktail Bar";
    gift = "Artisan Single-Origin Coffee Beans + Hand-poured Candle";
    dressCode = "Smart Luxury — Tailored suit jacket or elegant dress";
  } else {
    venue = "VIP Rooftop Fine Dining & Private Stargazing Deck";
    gift = "Custom Engraved Leather Journal + Gourmet Truffles";
    dressCode = "Formal Luxury — Tailored evening blazer / cocktail dress";
  }

  res.status(200).json({
    success: true,
    targetId,
    budget,
    recommendation: {
      venue,
      gift,
      dressCode,
      weatherForecast: "72°F — Clear Skies & Golden Hour Sunset",
      estimatedDuration: "2.5 Hours",
      trafficEstimate: "Light traffic (12 mins transit time)",
      confidenceScore: 96
    }
  });
});

export default router;
