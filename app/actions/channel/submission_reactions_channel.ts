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
        // Nếu đã có channel cũ đang chạy, hãy dọn dẹp trước khi tạo mới
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
                    console.log('Real-time update:', payload);
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log(`📡 Đã kết nối Real-time cho submission: ${submissionId}`);
                }
            });
    }

    /**
     * Ngắt kết nối và dọn dẹp channel
     */
    unsubscribe() {
        if (this.channel) {
            this.supabase.removeChannel(this.channel);
            this.channel = null;
            console.log('🔌 Đã ngắt kết nối Real-time');
        }
    }
}

export default SubmissionReactionChannel;