# AI Image Generator with Replicate API

A sophisticated web application for generating high-quality images using a custom-trained Stable Diffusion model optimized for intimate and artistic portrait generation.

## Model Information

This application uses a specialized Stable Diffusion model trained on a curated dataset to generate high-quality, intimate portraits. The model has been fine-tuned with the following specifications:

1. **Base Model**: Stable Diffusion
2. **Training Process**:
   - Fine-tuned on a specific individual's dataset
   - Optimized for realistic portrait generation
   - Enhanced for lighting and environmental details
   - Trigger word: "her"

3. **Model Setup on Replicate**:
   ```bash
   # Train the model on Replicate
   1. Create an account on replicate.com
   2. Upload your training dataset
   3. Use the following training parameters:
      - Base Model: Stable Diffusion v1.5
      - Learning Rate: 1e-6
      - Epochs: 100
      - Resolution: 512x512
      - Batch Size: 1
   4. After training, you'll get a model ID similar to:
      gomejz1412/her:0701b1337f1c6e488b9b2b6990685aa8f63f8537be79e3fdb534c84e47ed6136
   ```

4. **Local Model Setup**:
   ```bash
   # If you want to run the model locally instead of using Replicate:
   1. Install the required dependencies:
      pip install torch torchvision diffusers transformers
   
   2. Download the model:
      git lfs clone https://huggingface.co/runwayml/stable-diffusion-v1-5
   
   3. Apply the fine-tuning:
      python train.py \
        --pretrained_model_name_or_path="runwayml/stable-diffusion-v1-5" \
        --train_data_dir="./training_data" \
        --output_dir="./fine_tuned_model" \
        --resolution=512 \
        --train_batch_size=1 \
        --learning_rate=1e-6 \
        --max_train_steps=1000
   ```

5. **Optimal Generation Parameters**:
   - Guidance Scale: 7
   - Inference Steps: 40
   - Output Quality: 100
   - Model: schnell (for speed) or dev (for quality)

## Features

- AI-powered prompt generation
- High-quality image generation with optimized parameters
- Fullscreen image preview
- Download functionality
- Responsive design
- Real-time form validation
- Customizable generation parameters

## Prerequisites

- Node.js (v14 or higher)
- NPM (v6 or higher)
- Replicate API token
- DeepSeek API token
- (Optional) GPU for local model running

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd image-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory:
```bash
REPLICATE_API_TOKEN=your_replicate_token_here
DEEPSEEK_API_KEY=your_deepseek_token_here
```

## Project Structure

```
image-generator/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Styles
│   └── script.js       # Frontend JavaScript
├── server.js           # Express server
├── package.json        # Dependencies
└── .env               # Environment variables
```

## Building the Application

1. **Server Setup (server.js)**
   - Express server configuration
   - Replicate API integration
   - DeepSeek API integration for prompt generation
   - API endpoints for image generation and prompt creation

2. **Frontend Development**
   - HTML structure with form controls and image preview
   - CSS styling with responsive design
   - JavaScript for handling form submission and displaying results

3. **Key Features Implementation**
   - Prompt generation using DeepSeek API
   - Image generation with optimized parameters
   - Real-time form validation
   - Fullscreen image preview
   - Download functionality

## Running the Application

1. Development mode:
```bash
npm run dev
```

2. Production mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. **Generate Images**
   - Click "Generate Random Prompt" or enter your own prompt
   - Always start prompts with "her" (trigger word)
   - Adjust parameters:
     - Model: schnell (recommended) or dev
     - Aspect Ratio: 1:1 or 9:16
     - Guidance Scale: 7 (optimal)
     - Inference Steps: 40 (optimal)
   - Click "Generate Image"

2. **Optimal Settings**
   - Guidance Scale: 7 (better prompt adherence)
   - Inference Steps: 40 (more detail)
   - Output Quality: 100 (maximum)
   - Model: schnell (faster, optimized)

3. **View and Download**
   - Click images to view in fullscreen
   - Use the "Download Image" button to save images

## API Endpoints

- `POST /api/generate`: Generate images using Replicate API
- `POST /api/generate-prompt`: Generate prompts using DeepSeek API

## Environment Variables

```env
REPLICATE_API_TOKEN=your_replicate_token    # From replicate.com
DEEPSEEK_API_KEY=your_deepseek_token       # From deepseek.com
```

## Deployment

1. Choose a hosting platform (e.g., Heroku, DigitalOcean, AWS)
2. Set up environment variables on the platform
3. Deploy the application:
```bash
git push heroku main  # For Heroku
```

## Performance Optimization

- Optimized negative prompts for better quality
- Enhanced parameter defaults
- Efficient image loading and display
- Responsive design for all devices

## Best Practices

1. **Image Generation**
   - Use schnell model for faster generation
   - Maintain high inference steps (40) for quality
   - Use guidance scale 7 for optimal results
   - Choose aspect ratio based on desired composition

2. **Prompt Engineering**
   - Start prompts with "her" (required trigger word)
   - Include specific details about environment
   - Specify lighting and atmosphere
   - Add quality-focused tags

## Troubleshooting

- If images show deformities, increase guidance scale
- For better detail, increase inference steps
- Check API keys if generation fails
- Ensure proper network connectivity
- Verify model ID in server configuration

## Security Considerations

- API keys stored in environment variables
- Frontend validation implemented
- Error handling for API failures
- Safe image downloading implementation

## License

MIT License

## Support

For support, please raise an issue in the repository.
