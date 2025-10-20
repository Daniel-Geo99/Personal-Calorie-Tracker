// Supabase Edge Function

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CalorieEstimate {
  food: string;
  quantity: string;
  estimatedCalories: number;
  confidence: string;
  portionSuggestion: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { food, quantity } = await req.json();
    console.log('Estimating calories for:', food, quantity);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a nutrition expert with deep knowledge of Indian cuisine, especially Kerala dishes. 
Your task is to estimate calories for foods based on their name and quantity.

For Kerala dishes, be familiar with:
- Rice dishes: Puttu, Appam, Idiyappam, Kanji, Matta rice
- Curries: Avial, Olan, Thoran, Erissery, Sambar, Rasam
- Snacks: Unniyappam, Achappam, Pazham pori, Parippu vada, Ethakka appam
- Breakfast: Idli, Dosa, Upma, Poori
- Meat dishes: Chicken curry, Fish curry, Beef fry, Prawn roast
- Side dishes: Coconut chutney, Sambar, Pachadi, Pickle
- Desserts: Payasam (various types), Ada pradhaman, Palada payasam

Provide specific portion guidance like:
- For rice: "1 cup cooked" instead of just "1 serving"
- For curry: "1 medium katori" or "150ml"
- For snacks: "1 piece (medium size)" or "2 small pieces"`;

    const userPrompt = `Estimate the calories for: ${food}, quantity: ${quantity}

Provide your response with:
1. The estimated calorie count
2. Your confidence level (high/medium/low)
3. A better portion description if the quantity is vague

Be precise about Kerala dishes and provide accurate calorie estimates based on typical cooking methods.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "estimate_calories",
              description: "Return calorie estimation with portion details",
              parameters: {
                type: "object",
                properties: {
                  estimatedCalories: {
                    type: "number",
                    description: "Estimated calories as a number"
                  },
                  confidence: {
                    type: "string",
                    enum: ["high", "medium", "low"],
                    description: "Confidence level of the estimate"
                  },
                  portionSuggestion: {
                    type: "string",
                    description: "Better description of the portion size"
                  }
                },
                required: ["estimatedCalories", "confidence", "portionSuggestion"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "estimate_calories" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data, null, 2));

    const toolCall = data.choices[0].message.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const result = JSON.parse(toolCall.function.arguments);
    
    const estimate: CalorieEstimate = {
      food,
      quantity: result.portionSuggestion,
      estimatedCalories: Math.round(result.estimatedCalories),
      confidence: result.confidence,
      portionSuggestion: result.portionSuggestion
    };

    console.log('Calorie estimate:', estimate);

    return new Response(JSON.stringify(estimate), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in estimate-calories:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
