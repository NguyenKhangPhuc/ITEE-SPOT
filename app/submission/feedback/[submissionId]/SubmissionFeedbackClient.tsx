'use client'

import { SubmissionFeedback } from "@/app/types/submission_feedback"
import { tw } from "@/app/constants/design-tokens"

interface SubmissionFeedbackClientProps {
    submissionFeedbacks: Array<SubmissionFeedback>
}

export default function SubmissionFeedbackClient({ submissionFeedbacks }: SubmissionFeedbackClientProps) {
    if (!submissionFeedbacks || submissionFeedbacks.length === 0) {
        return (
            <div className={`w-full ${tw.bg.surfaceContainerLow} border ${tw.border.whiteSubtle} rounded-sm p-12 flex flex-col items-center justify-center gap-3 text-center`}>
                <div className="w-10 h-10 rounded-sm bg-[#00e0b3]/10 border border-[#00e0b3]/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#00e0b3] text-xl">forum</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className={`font-mono text-xs font-bold ${tw.text.onSurface} uppercase tracking-wider`}>
                        NO_FEEDBACK_YET
                    </span>
                    <span className={`font-mono text-[10px] ${tw.text.outline}`}>
                        There are no feedback comments submitted for this project submission.
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Header bar / metrics */}
            <div className="flex items-center justify-between select-none">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider">
                    <div className="w-[3px] h-3 bg-[#00e0b3]" />
                    <span>01_FEEDBACK_COMMENTS_LOG</span>
                </div>
                <span className={`font-mono text-[9px] ${tw.text.outline}`}>
                    TOTAL_COMMENTS: {submissionFeedbacks.length}
                </span>
            </div>

            {/* Feedbacks list container */}
            <div className={`w-full flex flex-col ${tw.bg.surfaceContainerLow} border ${tw.border.whiteSubtle} rounded-sm p-4 md:p-6 max-h-[70vh] overflow-y-auto`}>
                <div className="flex flex-col gap-4">
                    {submissionFeedbacks.map((feedback, index) => {
                        const displayName = feedback.display_name || "Anonymous User"
                        const initial = displayName.charAt(0).toUpperCase()
                        const formattedDate = feedback.created_at
                            ? new Date(feedback.created_at).toLocaleString('fi-FI', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })
                            : 'Vừa xong'

                        return (
                            <div
                                key={feedback.id || index}
                                className={`flex flex-col sm:flex-row gap-3 sm:gap-4 w-full p-4 ${tw.bg.surfaceContainerHigh} border ${tw.border.whiteSubtle} rounded-sm transition-colors hover:border-[#00e0b3]/20`}
                            >
                                {/* Avatar badge */}
                                <div className="w-9 h-9 rounded-sm bg-[#00e0b3]/10 border border-[#00e0b3]/20 flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold text-[#00e0b3] uppercase select-none">
                                    {initial}
                                </div>

                                {/* Content body */}
                                <div className="flex flex-col min-w-0 flex-1 gap-1.5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#3a4a44]/30 pb-2">
                                        <span className={`font-mono font-bold text-xs ${tw.text.onSurface} uppercase tracking-wider truncate`}>
                                            {displayName}
                                        </span>
                                        <span className={`font-mono text-[9px] ${tw.text.outline} shrink-0`}>
                                            {formattedDate}
                                        </span>
                                    </div>

                                    <div className={`font-mono text-xs ${tw.text.onSurfaceVariant} leading-relaxed break-words whitespace-pre-wrap pt-1`}>
                                        {feedback.content}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}