"use client"
import './file-submission.scss'

import Document from '@tiptap/extension-document'
import FileHandler from '@tiptap/extension-file-handler'
import Heading from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import React from 'react'

export const FileSubmission = () => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            Document,
            Heading,
            Paragraph,
            Text,
            Image,
            FileHandler.configure({
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
                onDrop: (currentEditor, files, pos) => {
                    files.forEach(file => {
                        const fileReader = new FileReader()

                        fileReader.readAsDataURL(file)
                        fileReader.onload = () => {
                            currentEditor
                                .chain()
                                .insertContentAt(pos, {
                                    type: 'image',
                                    attrs: {
                                        src: fileReader.result,
                                    },
                                })
                                .focus()
                                .run()
                        }
                    })
                },
                onPaste: (currentEditor, files, htmlContent) => {
                    files.forEach(file => {
                        if (htmlContent) {

                            return false
                        }

                        const fileReader = new FileReader()

                        fileReader.readAsDataURL(file)
                        fileReader.onload = () => {
                            currentEditor
                                .chain()
                                .insertContentAt(currentEditor.state.selection.anchor, {
                                    type: 'image',
                                    attrs: {
                                        src: fileReader.result,
                                    },
                                })
                                .focus()
                                .run()
                        }
                    })
                },
            }),
        ],
        content: `
      <h1>
        Try to paste or drop files into this editor
      </h1>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
    `,
    })

    return <EditorContent editor={editor} />
}