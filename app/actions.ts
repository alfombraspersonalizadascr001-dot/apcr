'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateMatImage(formData: FormData) {
    const logoText = formData.get('logoText') as string;
    const industry = formData.get('industry') as string;
    const matColor = formData.get('matColor') as string;

    if (!logoText || !matColor) {
        return { error: 'Faltan datos requeridos.' };
    }

    try {
        const prompt = constructPrompt(industry, matColor, logoText);
        console.log('Generating with prompt:', prompt);

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "hd",
            style: "natural"
        });

        return { url: response.data[0].url };

    } catch (error: any) {
        console.error('OpenAI Error:', error);
        return { error: error.message || 'Error al generar imagen.' };
    }
}

function constructPrompt(industry: string, matColor: string, logoText: string) {
    const baseConstraints = "Photorealistic high-angle shot of a heavy-duty custom vinyl loop 'spaghetti' coil floor mat (3M Nomad style). Material is explicitly thick plastic PVC coils, NOT fibers, NOT fur, NOT hair, NOT soft carpet. It looks like a rubbery scraper mat.";

    const contexts: Record<string, string> = {
        'condo': "Placed at the elegant entrance of a luxury condominium building with stone pillars and glass doors.",
        'office': "Placed at the reception of a modern corporate office with polished floors.",
        'dentist': "Placed at the entrance of a pristine dental clinic with white tiles and bright lighting.",
        'gym': "Placed at the entrance of a modern gym with weights visible in background, energetic lighting.",
        'cafe': "Placed at the entrance of a cozy coffee shop with wooden floors and warm lighting.",
        'shop': "Placed at the entrance of a retail store inside a shopping mall.",
        'industrial': "Placed at the entrance of a factory or workshop, concrete floor, industrial vibe.",
        'outdoor': "Placed outdoors on a concrete step, natural daylight."
    };

    // Heuristics
    const lower = industry.toLowerCase();
    let sceneDescription = contexts['shop'];
    if (lower.includes('condo') || lower.includes('edificio')) sceneDescription = contexts['condo'];
    else if (lower.includes('dent') || lower.includes('medic')) sceneDescription = contexts['dentist'];
    else if (lower.includes('gym')) sceneDescription = contexts['gym'];
    else if (lower.includes('cafe')) sceneDescription = contexts['cafe'];
    else if (lower.includes('taller') || lower.includes('fabric')) sceneDescription = contexts['industrial'];

    const logoDescription = `The mat features a clear, high-contrast custom inlaid logo reading '${logoText}'. The logo material appears as DIFFERENT COLORED VINYL COILS embedded into the mat (inlaid work), strictly NOT painted on top. The mat has a 2.5cm plain black solid rubber beveled border (completely smooth, strict NO texture on border).`;

    return `${baseConstraints} ${sceneDescription} The mat is ${matColor}. ${logoDescription} Professional commercial photography, sharp focus, 8k resolution.`;
}
