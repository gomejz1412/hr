import express from 'express';
import cors from 'cors';
import Replicate from 'replicate';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Authentication middleware
const authMiddleware = (req, res, next) => {
  // Skip auth check for login page
  if (req.path === '/login.html') {
    return next();
  }

  // Check if it's an API request
  if (req.path.startsWith('/api/')) {
    const auth = req.headers.authorization;
    // Check if the session token matches what we'd expect from the frontend
    if (auth === 'Bearer authenticated') {
      return next();
    }
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  next();
};

app.use(authMiddleware);

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// API endpoint for image generation
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, ...otherParams } = req.body;
    
    const output = await replicate.run(
      "gomejz1412/her:0701b1337f1c6e488b9b2b6990685aa8f63f8537be79e3fdb534c84e47ed6136",
      {
        input: {
          prompt,
          negative_prompt: "(worst quality, bad quality, low quality, normal quality:2), (bad-hands-5:1.2), (bad_prompt_version2:0.8), bad-artist, bad hands, accusatory, against, artists, bad anatomy, bad art, bad artwork, bad composition, bad lighting, bad perspective, bad shadow, badly drawn, broken leg, canvas frame, cartoon, censored, cloned face, cropped, crucified, deformed, deformed hands, disfigured, dismembered, disproportioned, distorted face, distorted hands, double image, drawing, duplicate, error, extra arms, extra fingers, extra hands, extra legs, extra limbs, failure, fat, fewer digits, fewer fingers, frame, frames, gradient background, gross, gross proportions, grunge, hand, hands, home, interlocked fingers, jpeg artifacts, kitsch, letters, logo, long neck, low resolution, lowres, malformed, malformed hands, misshapen, missing fingers, missing limb, mistake, morbid, multiple heads, mutated, mutated hands, mutation, nasty, nsfw, out of frame, oversaturated, poor quality, poorly drawn, poorly drawn face, poorly drawn hands, primary, realistic, signature, stacked torsos, text font ui, text user interface, textbox, title, ugly, username, warped, watermark, web address, website, words, writing, wrong anatomy, wrong face, wrong hand, wrong hands, wrong proportions)",
          model: otherParams.model || "schnell",
          go_fast: otherParams.go_fast || false,
          lora_scale: otherParams.lora_scale || 1,
          megapixels: otherParams.megapixels || "1",
          num_outputs: otherParams.num_outputs || 1,
          aspect_ratio: otherParams.aspect_ratio || "1:1",
          output_format: otherParams.output_format || "webp",
          guidance_scale: otherParams.guidance_scale || 7,  // Increased for better adherence to prompt
          output_quality: otherParams.output_quality || 100,  // Maximum quality
          prompt_strength: otherParams.prompt_strength || 0.8,
          extra_lora_scale: otherParams.extra_lora_scale || 1,
          num_inference_steps: otherParams.num_inference_steps || 40,  // Increased for better detail
          disable_safety_checker: true
        }
      }
    );

    res.json({ success: true, output });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to generate image' 
    });
  }
});

// DeepSeek prompt generation endpoint
app.post('/api/generate-prompt', async (req, res) => {
  try {
    const { theme } = req.body;
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{
          role: "user",
          content: `Generate a seductive and alluring prompt for an AI image generator. Theme: ${theme || 'beach sunset'}. Create a detailed prompt that:
1. Starts with "her" and creates a vivid scene
2. Describes attire from these options:
   - Beach: thong bikini, micro bikini, sheer cover-up, wet swimwear
   - Gym: tight sports bra, yoga pants, spandex shorts
   - Night out: bodycon dress, mini dress, form-fitting attire
   - Casual: crop top, tight shorts, sundress, sheer fabrics
3. Includes specific lighting:
   - Natural: golden hour, sunset glow, morning sun
   - Artificial: neon lights, club lighting, street lamps
   - Studio: rim lighting, backlight, silhouette
4. Describes pose and composition:
   - Walking, stretching, lounging, posing
   - Body curves, silhouette, figure emphasis
   - Natural, candid, caught-in-the-moment
5. Sets the mood with environment details:
   - Weather conditions
   - Background elements
   - Environmental atmosphere
Make it seductive yet tasteful, focusing on natural beauty and artistic presentation. Add details about body language and attitude. End with quality tags: masterpiece, best quality, realistic, photorealistic.`
        }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }

    const generatedPrompt = data.choices[0].message.content.trim();
    res.json({ success: true, prompt: generatedPrompt });
  } catch (error) {
    console.error('Prompt generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to generate prompt' 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
