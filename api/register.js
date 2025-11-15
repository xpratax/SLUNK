// /api/register.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, instagram, cats } = req.body;
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  // cria usuário básico
  const { data, error } = await supabase
    .from("users")
    .insert([{ username: name, instagram, categories: cats, followers: 0, likes: 0 }])
    .select();

  if (error) return res.status(400).json({ error });

  // chama sync instagram
  await fetch(`${process.env.BASE_URL}/api/syncInstagram?id=${data[0].id}`);

  return res.json({ ok: true, id: data[0].id });
}
