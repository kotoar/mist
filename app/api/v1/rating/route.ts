import { supabase } from "@lib/shared/services/supabase";
import { z } from "zod";

const SubmitRatingSchema = z.object({
    game: z.enum(["case", "detect", "mist"]),
    target_id: z.string().min(1),
    score: z.number().int().min(1).max(5),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = SubmitRatingSchema.safeParse(body);

        if (!parsed.success) {
            return new Response(JSON.stringify({ error: "Invalid Request payload", details: parsed.error }), { status: 400 });
        }

        const { game, target_id, score } = parsed.data;

        const { error } = await supabase
            .from('mist_rating')
            .insert({
                game,
                target_id,
                score
            });

        if (error) {
            console.error("Error inserting rating:", error);
            return new Response(JSON.stringify({ error: "Failed to submit rating" }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Unexpected error submitting rating:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
