import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      widthCm = 120, 
      heightCm = 100, 
      baseColor = '#111111', 
      baseColorName = 'Negro Carbón',
      environment = 'corporate_lobby',
      logoDataUrl = ''
    } = body;

    // Validación de medidas mínimas
    if (Math.min(widthCm, heightCm) < 100 || Math.max(widthCm, heightCm) < 120) {
      return NextResponse.json({ 
        error: 'La medida mínima de fabricación es 120 × 100 cm.' 
      }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    // Entornos disponibles para el renderizado
    const envDescriptions: Record<string, string> = {
      corporate_lobby: 'un lobby corporativo moderno de lujo, piso de mármol pulido o porcelanato beige claro, puertas automáticas de cristal templado, luz natural diurna suave',
      luxury_hotel: 'la entrada principal de un hotel boutique de alta gama, iluminación arquitectónica cálida, acabados en madera de roble y bronce, piso de piedra natural',
      retail_store: 'el acceso frontal de una tienda comercial y boutique elegante, vista desde la acera hacia adentro con vidrieras limpias y piso de concreto pulido gris',
      executive_office: 'la antesala de una oficina de presidencia ejecutiva, diseño minimalista suizo, paneles acústicos oscuros y piso de madera noble'
    };

    const chosenEnv = envDescriptions[environment] || envDescriptions.corporate_lobby;

    // Si se tiene clave de API configurada, podemos invocar el modelo generativo
    if (geminiKey) {
      try {
        // En caso de que se configure Gemini Imagen
        const prompt = `Fotografía arquitectónica fotorrealista de alta definición de ${chosenEnv}. En el suelo, perfectamente colocada en la entrada, hay una alfombra atrapamugre troquelada de alta gama con dimensiones de ${widthCm}x${heightCm} cm. La alfombra tiene una base de color ${baseColorName} (${baseColor}) con borde biselado negro de 2.5 cm. Textura de rizo sintético visible y sombras de oclusión ambiental realistas en el piso. Ángulo en perspectiva frontal-superior de 35 grados. Estilo de revista Architectural Digest, iluminación realista de 8K.`;

        // Si se dispone del endpoint Imagen 3 de Google
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt }],
            parameters: { sampleCount: 1, aspectRatio: '16:9' }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const base64Img = data?.predictions?.[0]?.bytesBase64Encoded;
          if (base64Img) {
            return NextResponse.json({
              success: true,
              type: 'ai_generated',
              imageUrl: `data:image/png;base64,${base64Img}`,
              prompt
            });
          }
        }
      } catch (aiErr) {
        console.warn('Error llamando a Gemini Imagen, usando render sintético HD:', aiErr);
      }
    }

    // Respuesta con datos del render para composición fotográfica en el cliente
    return NextResponse.json({
      success: true,
      type: 'perspective_3d',
      environment,
      environmentDescription: chosenEnv,
      widthCm,
      heightCm,
      baseColor,
      baseColorName,
      hasCustomApiKey: Boolean(geminiKey || openAiKey),
      message: 'Render 3D en perspectiva generado con texturas de fibra y sombras ambientales.'
    });

  } catch (error) {
    console.error('Error en /api/generate-mat-render:', error);
    return NextResponse.json({ 
      error: 'Ocurrió un error al procesar la solicitud de render.' 
    }, { status: 500 });
  }
}
