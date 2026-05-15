'use client'

import { Editor, useEditorState } from "@tiptap/react";

interface WordCounterProps {
    limit: number,
    editor: Editor | null,

}
const WordCounter = ({ limit, editor }: WordCounterProps) => {
    const editorState = useEditorState({
        editor,
        selector: (context): { charactersCount: number; wordsCount: number } => ({
            charactersCount: context.editor?.storage.characterCount.characters() ?? 0,
            wordsCount: context.editor?.storage.characterCount.words() ?? 0,
        }),
    })


    const charactersCount = editorState?.charactersCount ?? 0
    const wordsCount = editorState?.wordsCount ?? 0

    const percentage = limit > 0 ? Math.round((100 / limit) * charactersCount) : 0
    return (
        <div className={`character-count ${charactersCount === limit ? 'character-count--warning' : ''}`}>
            <svg height="20" width="20" viewBox="0 0 20 20">
                <circle r="10" cx="10" cy="10" fill="#e9ecef" />
                <circle
                    r="5"
                    cx="10"
                    cy="10"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
                    transform="rotate(-90) translate(-20)"
                />
                <circle r="6" cx="10" cy="10" fill="white" />
            </svg>
            {charactersCount} / {limit} characters
            <br />
            {wordsCount} words
        </div>
    )
}

export default WordCounter