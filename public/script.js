document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('generateForm');
    const generateBtn = document.getElementById('generateBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const imageGallery = document.getElementById('imageGallery');
    const errorDisplay = document.getElementById('error');
    const promptInput = document.getElementById('prompt');
    const randomPromptBtn = document.getElementById('randomPrompt');

    // AI-powered prompt generation handler
    randomPromptBtn.addEventListener('click', async () => {
        randomPromptBtn.disabled = true;
        randomPromptBtn.textContent = 'Generating...';

        try {
            const themes = [
                'beach sunset', 'poolside lounging', 'gym workout',
                'night club', 'grocery shopping', 'yacht party',
                'summer beach', 'rooftop pool', 'hotel lobby',
                'beach volleyball', 'morning coffee', 'sunset drive',
                'beach walk', 'pool party', 'private beach',
                'downtown night', 'luxury mall', 'resort pool',
                'beach photoshoot', 'street candid'
            ];
            const randomTheme = themes[Math.floor(Math.random() * themes.length)];

            const response = await fetch('/api/generate-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer authenticated'
                },
                body: JSON.stringify({ theme: randomTheme })
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to generate prompt');
            }

            promptInput.value = result.prompt;
            promptInput.style.height = 'auto';
            promptInput.style.height = promptInput.scrollHeight + 'px';
        } catch (error) {
            console.error('Error:', error);
            errorDisplay.textContent = 'Failed to generate prompt. Please try again.';
            errorDisplay.classList.remove('hidden');
        } finally {
            randomPromptBtn.disabled = false;
            randomPromptBtn.textContent = 'Generate Random Prompt';
        }
    });

    // Auto-resize textarea as user types
    promptInput.addEventListener('input', () => {
        promptInput.style.height = 'auto';
        promptInput.style.height = promptInput.scrollHeight + 'px';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous results and errors
        imageGallery.innerHTML = '';
        errorDisplay.classList.add('hidden');
        errorDisplay.textContent = '';
        
        // Show loading state
        loadingIndicator.classList.remove('hidden');
        generateBtn.disabled = true;

        // Gather form data
        const formData = new FormData(form);
        const data = {
            prompt: formData.get('prompt'),
            model: formData.get('model'),
            aspect_ratio: formData.get('aspect_ratio'),
            num_outputs: parseInt(formData.get('num_outputs')),
            guidance_scale: parseFloat(formData.get('guidance_scale')),
            num_inference_steps: parseInt(formData.get('num_inference_steps')),
            go_fast: formData.get('go_fast') === 'on'
        };

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer authenticated'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to generate image');
            }

            // Display generated images
            result.output.forEach(imageUrl => {
                const container = document.createElement('div');
                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'image-wrapper';

                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = data.prompt;
                
                // Make image clickable for fullscreen
                img.addEventListener('click', () => {
                    const fullscreenDiv = document.createElement('div');
                    fullscreenDiv.className = 'fullscreen-overlay';
                    
                    const fullImg = document.createElement('img');
                    fullImg.src = imageUrl;
                    fullImg.alt = data.prompt;
                    
                    fullscreenDiv.appendChild(fullImg);
                    
                    // Close fullscreen on background click
                    fullscreenDiv.addEventListener('click', (e) => {
                        if (e.target === fullscreenDiv) {
                            fullscreenDiv.remove();
                        }
                    });
                    
                    document.body.appendChild(fullscreenDiv);
                });
                
                // Add wrapper for hover effects
                imgWrapper.appendChild(img);
                container.appendChild(imgWrapper);
                
                // Add download button
                const downloadBtn = document.createElement('a');
                downloadBtn.href = imageUrl;
                downloadBtn.download = `generated-image-${Date.now()}.webp`;
                downloadBtn.className = 'view-btn';
                downloadBtn.textContent = 'Download Image';
                container.appendChild(downloadBtn);
                
                imageGallery.appendChild(container);
            });

        } catch (error) {
            console.error('Error:', error);
            errorDisplay.textContent = error.message;
            errorDisplay.classList.remove('hidden');
        } finally {
            // Reset UI state
            loadingIndicator.classList.add('hidden');
            generateBtn.disabled = false;
        }
    });

    // Input validation
    const numOutputs = document.getElementById('num_outputs');
    const guidanceScale = document.getElementById('guidance_scale');
    const numInferenceSteps = document.getElementById('num_inference_steps');

    const validateNumberInput = (input, min, max) => {
        input.addEventListener('change', () => {
            const value = parseFloat(input.value);
            if (value < min) input.value = min;
            if (value > max) input.value = max;
        });
    };

    validateNumberInput(numOutputs, 1, 4);
    validateNumberInput(guidanceScale, 0, 10);
    validateNumberInput(numInferenceSteps, 1, 50);

    // Generate initial random prompt
    randomPromptBtn.click();
});
