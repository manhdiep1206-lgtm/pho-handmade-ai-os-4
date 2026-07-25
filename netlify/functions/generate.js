export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const apiKey = Netlify.env.get("OPENAI_API_KEY");
  const model = Netlify.env.get("OPENAI_MODEL") || "gpt-5-mini";

  if (!apiKey) {
    return new Response(JSON.stringify({
      error: "Chưa cấu hình OPENAI_API_KEY trong Netlify Environment Variables."
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  try {
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Thiếu nội dung yêu cầu." }), {
        status: 400, headers: { "Content-Type": "application/json" }
      });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        input: prompt
      })
    });

    const result = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({
        error: result?.error?.message || "OpenAI API trả về lỗi."
      }), { status: response.status, headers: { "Content-Type": "application/json" } });
    }

    const text = result.output_text ||
      result.output?.flatMap(item => item.content || [])
        .filter(item => item.type === "output_text")
        .map(item => item.text).join("\n") || "";

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Lỗi hệ thống." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
