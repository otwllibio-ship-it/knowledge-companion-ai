import { createServerFn } from "@tanstack/react-start";

export type QuestionRow = {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  category: string;
  difficulty: string;
  time_limit: number;
};

async function db() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const listQuestions = createServerFn({ method: "POST" }).handler(async (): Promise<
  QuestionRow[]
> => {
  const supabase = await db();
  const { data, error } = await supabase
    .from("questions")
    .select(
      "id, question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty, time_limit",
    )
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

type QuestionInput = {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  category: string;
  time_limit: number;
};

function clean(data: QuestionInput): QuestionInput {
  return {
    question: String(data.question || "").trim().slice(0, 400),
    option_a: String(data.option_a || "").trim().slice(0, 200),
    option_b: String(data.option_b || "").trim().slice(0, 200),
    option_c: String(data.option_c || "").trim().slice(0, 200),
    option_d: String(data.option_d || "").trim().slice(0, 200),
    correct_answer: String(data.correct_answer || "A").toUpperCase().slice(0, 1),
    category: String(data.category || "Genel Kültür").trim().slice(0, 60),
    time_limit: Math.max(5, Math.min(120, Number(data.time_limit) || 20)),
  };
}

function validate(d: QuestionInput) {
  if (!d.question) throw new Error("Soru metni gerekli");
  if (!d.option_a || !d.option_b || !d.option_c || !d.option_d)
    throw new Error("Dört seçeneğin tamamını doldurun");
  if (!["A", "B", "C", "D"].includes(d.correct_answer))
    throw new Error("Doğru cevap A, B, C veya D olmalı");
}

export const addQuestion = createServerFn({ method: "POST" })
  .inputValidator((data: QuestionInput) => clean(data))
  .handler(async ({ data }) => {
    validate(data);
    const supabase = await db();
    const { error } = await supabase.from("questions").insert(data);
    if (error) throw new Error("Soru kaydedilemedi");
    return { ok: true };
  });

export const updateQuestion = createServerFn({ method: "POST" })
  .inputValidator((data: QuestionInput & { id: string }) => ({
    ...clean(data),
    id: String(data.id),
  }))
  .handler(async ({ data }) => {
    const { id, ...fields } = data;
    validate(fields);
    const supabase = await db();
    const { error } = await supabase.from("questions").update(fields).eq("id", id);
    if (error) throw new Error("Soru güncellenemedi");
    return { ok: true };
  });

export const deleteQuestion = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => ({ id: String(data.id) }))
  .handler(async ({ data }) => {
    const supabase = await db();
    const { error } = await supabase.from("questions").delete().eq("id", data.id);
    if (error) throw new Error("Soru silinemedi");
    return { ok: true };
  });
