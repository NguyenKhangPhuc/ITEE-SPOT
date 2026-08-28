'use client'

import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';

class SubmissionReactionChannel {
    private supabase: SupabaseClient;
    private channel: RealtimeChannel | null = null;

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    /**
     * @param submissionId
     * @param onUpdate 
     */
    subscribe(submissionId: string, onUpdate: () => void) {
        if (this.channel) {
            this.unsubscribe();
        }

        this.channel = this.supabase
            .channel(`reaction-submission-${submissionId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'submission_reaction',
                    filter: `submission_id=eq.${submissionId}`
                },
                (payload) => {

                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {

                }
            });
    }

    unsubscribe() {
        if (this.channel) {
            this.supabase.removeChannel(this.channel);
            this.channel = null;
        }
    }
}

export default SubmissionReactionChannel;