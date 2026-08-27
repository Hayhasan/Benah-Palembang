"use client"

import { mergeAttributes, Node, Extension } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import React, { useState, useEffect, useRef } from 'react'

// ─── Resizable Media Component ───
const ResizableMediaComponent = ({ node, updateAttributes, selected }: any) => {
    const { src, mediaType, width, textAlign } = node.attrs
    const containerRef = useRef<HTMLDivElement>(null)
    const [isResizing, setIsResizing] = useState(false)
    const [initialWidth, setInitialWidth] = useState(0)
    const [startX, setStartX] = useState(0)

    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsResizing(true)
        setStartX(e.clientX)
        setInitialWidth(containerRef.current?.offsetWidth || 0)
    }

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!isResizing) return
            const deltaX = e.clientX - startX
            // Calculate new width (adjust scaling factor as needed)
            const newWidth = Math.max(100, initialWidth + deltaX)
            updateAttributes({ width: newWidth })
        }

        const onMouseUp = () => {
            setIsResizing(false)
        }

        if (isResizing) {
            window.addEventListener('mousemove', onMouseMove)
            window.addEventListener('mouseup', onMouseUp)
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [isResizing, startX, initialWidth, updateAttributes])



    return (
        <NodeViewWrapper className={`flex ${textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
            <div 
                ref={containerRef}
                className={`relative inline-block ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                style={{ width: width ? `${width}px` : 'auto', maxWidth: '100%' }}
            >
                {mediaType === 'video' ? (
                    <video src={src} controls className="block w-full h-auto rounded-md" />
                ) : (
                    <img src={src} alt="media" className="block w-full h-auto rounded-md" />
                )}
                
                {selected && (
                    <>
                        <div 
                            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize border-2 border-white z-10"
                            onMouseDown={onMouseDown}
                        />
                    </>
                )}
            </div>
        </NodeViewWrapper>
    )
}

export const ResizableMedia = Node.create({
    name: 'resizableMedia',
    group: 'block',
    draggable: true,
    
    addAttributes() {
        return {
            src: { default: null },
            mediaType: { default: 'image' }, // 'image' or 'video'
            width: { default: null }
        }
    },

    parseHTML() {
        return [
            { tag: 'img[src]', getAttrs: el => ({ src: el.getAttribute('src'), mediaType: 'image', width: el.getAttribute('width') }) },
            { tag: 'video[src]', getAttrs: el => ({ src: el.getAttribute('src'), mediaType: 'video', width: el.getAttribute('width') }) }
        ]
    },

    renderHTML({ HTMLAttributes }) {
        const { mediaType, textAlign, ...attrs } = HTMLAttributes
        const style = textAlign === 'center' ? 'margin-left: auto; margin-right: auto;' : textAlign === 'right' ? 'margin-left: auto;' : ''
        
        if (mediaType === 'video') {
            return ['video', mergeAttributes(attrs, { controls: true, style: `display: block; ${style}` })]
        }
        return ['img', mergeAttributes(attrs, { style: `display: block; ${style}` })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ResizableMediaComponent)
    }
})


// ─── Indent Extension ───
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        indent: {
            indent: () => ReturnType
            outdent: () => ReturnType
        }
    }
}

export const Indent = Extension.create({
    name: 'indent',

    addOptions() {
        return {
            types: ['paragraph', 'heading'],
            indentLevels: [0, 24, 48, 72, 96, 120, 144, 168],
            defaultLevel: 0,
        }
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    indent: {
                        default: this.options.defaultLevel,
                        parseHTML: element => {
                            const paddingLeft = element.style.marginLeft
                            return paddingLeft ? parseInt(paddingLeft, 10) : 0
                        },
                        renderHTML: attributes => {
                            if (!attributes.indent) return {}
                            return { style: `margin-left: ${attributes.indent}px` }
                        }
                    }
                }
            }
        ]
    },

    addCommands() {
        return {
            indent: () => ({ tr, state, dispatch }) => {
                const { selection } = state
                tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
                    if (this.options.types.includes(node.type.name)) {
                        const currentIndent = node.attrs.indent || 0
                        const nextLevelIndex = this.options.indentLevels.findIndex((lvl: number) => lvl > currentIndent)
                        const newIndent = nextLevelIndex !== -1 ? this.options.indentLevels[nextLevelIndex] : currentIndent
                        if (newIndent !== currentIndent) {
                            tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: newIndent })
                        }
                    }
                })
                if (dispatch) dispatch(tr)
                return true
            },
            outdent: () => ({ tr, state, dispatch }) => {
                const { selection } = state
                tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
                    if (this.options.types.includes(node.type.name)) {
                        const currentIndent = node.attrs.indent || 0
                        const prevLevelIndex = this.options.indentLevels.slice().reverse().findIndex((lvl: number) => lvl < currentIndent)
                        const newIndent = prevLevelIndex !== -1 ? this.options.indentLevels.slice().reverse()[prevLevelIndex] : 0
                        if (newIndent !== currentIndent) {
                            tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: newIndent })
                        }
                    }
                })
                if (dispatch) dispatch(tr)
                return true
            }
        }
    }
})