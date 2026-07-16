import { mapSubmissionFinalScore } from "../helpers/ParseScoreResponse";
import { createClient } from "../utils/supabase/server";


export async function getSubmissionFinalScores(eventId: string) {

    const supabase = await createClient()
    const { data, error } = await supabase
        .from('submission_final_scores')
        .select('*')
        .eq('event_id', eventId);

    if (error) {
        return { error: 'Fail to fetch final score' }
    };
    return { data: data.map(mapSubmissionFinalScore), error };
}