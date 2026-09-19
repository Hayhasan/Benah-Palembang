"use client"

import { mergeAttributes, Node, Extension } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import React, { useState, useEffect, useRef } from 'react'

import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'

export const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: element => element.getAttribute('data-background-color') || element.style.backgroundColor,
        renderHTML: attributes => {
          if (!attributes.backgroundColor) {
            return {}
          }
          return {
            'data-background-color': attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          }
        },
      },
    }
  },
})

export const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: element => element.getAttribute('data-background-color') || element.style.backgroundColor,
        renderHTML: attributes => {
          if (!attributes.backgroundColor) {
            return {}
          }
          return {
            'data-background-color': attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          }
        },
      },
    }
  },
})

// ─── Resizable Media Component ───
const ResizableMediaComponent = ({ node, updateAttributes, selected }: any) => {
    const { src, mediaType, width, textAlign } = node.attrs
    const containerRef = useRef<HTMLDivElement>(null)
    const [isResizing, setIsResizing] = useState(false)
    const [resizingHandle, setResizingHandle] = useState<string | null>(null)
    const [initialWidth, setInitialWidth] = useState(0)
    const [startX, setStartX] = useState(0)

    const onMouseDown = (e: React.MouseEvent, handle: string) => {
        e.preventDefault()
        e.stopPropagation()
        setIsResizing(true)
        setResizingHandle(handle)
        setStartX(e.clientX)
        setInitialWidth(containerRef.current?.offsetWidth || 0)
    }

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!isResizing || !resizingHandle) return
            const deltaX = e.clientX - startX
            const multiplier = (resizingHandle === 'tl' || resizingHandle === 'bl') ? -1 : 1
            const newWidth = Math.max(100, initialWidth + deltaX * multiplier)
            updateAttributes({ width: newWidth })
        }

        const onMouseUp = () => {
            setIsResizing(false)
            setResizingHandle(null)
        }

        if (isResizing) {
            window.addEventListener('mousemove', onMouseMove)
            window.addEventListener('mouseup', onMouseUp)
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [isResizing, startX, initialWidth, resizingHandle, updateAttributes])

    return (
        <NodeViewWrapper className={`flex py-2 ${textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
            <div 
                ref={containerRef}
                className={`relative inline-block p-1 rounded-lg transition-all ${selected ? 'bg-blue-50/50 ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-zinc-200'}`}
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
                            className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-blue-500 rounded-full cursor-nwse-resize border-2 border-white z-10 shadow-sm"
                            onMouseDown={(e) => onMouseDown(e, 'tl')}
                        />
                        <div 
                            className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-500 rounded-full cursor-nesw-resize border-2 border-white z-10 shadow-sm"
                            onMouseDown={(e) => onMouseDown(e, 'tr')}
                        />
                        <div 
                            className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-blue-500 rounded-full cursor-nesw-resize border-2 border-white z-10 shadow-sm"
                            onMouseDown={(e) => onMouseDown(e, 'bl')}
                        />
                        <div 
                            className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-500 rounded-full cursor-nwse-resize border-2 border-white z-10 shadow-sm"
                            onMouseDown={(e) => onMouseDown(e, 'br')}
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
        const { mediaType, textAlign, width, ...attrs } = HTMLAttributes
        const alignStyle = textAlign === 'center' ? 'margin-left: auto; margin-right: auto;' : textAlign === 'right' ? 'margin-left: auto;' : ''
        const widthStyle = width ? `width: ${width}px; max-width: 100%;` : 'max-width: 100%;'
        const combinedStyle = `display: block; ${alignStyle} ${widthStyle}`.trim()
        
        if (mediaType === 'video') {
            return ['video', mergeAttributes(attrs, { controls: true, style: combinedStyle, width })]
        }
        return ['img', mergeAttributes(attrs, { style: combinedStyle, width })]
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
            types: ['paragraph', 'heading', 'blockquote', 'listItem'],
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
                            const indent = element.style.marginLeft || element.style.paddingLeft
                            return indent ? parseInt(indent, 10) : 0
                        },
                        renderHTML: attributes => {
                            if (!attributes.indent) return {}
                            return { style: `margin-left: ${attributes.indent}px !important;` }
                        }
                    }
                }
            }
        ]
    },

    addCommands() {
        return {
            indent: () => ({ tr, state, dispatch }: any) => {
                const { selection } = state
                let hasChanges = false
                tr.doc.nodesBetween(selection.from, selection.to, (node: any, pos: number, parent: any) => {
                    // If paragraph is inside a listItem, let the listItem handle the indentation
                    if (node.type.name === 'paragraph' && parent?.type?.name === 'listItem') {
                        return
                    }

                    if (this.options.types.includes(node.type.name)) {
                        const currentIndent = node.attrs.indent || 0
                        const nextLevelIndex = this.options.indentLevels.findIndex((lvl: number) => lvl > currentIndent)
                        const newIndent = nextLevelIndex !== -1 ? this.options.indentLevels[nextLevelIndex] : currentIndent
                        if (newIndent !== currentIndent) {
                            tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: newIndent })
                            hasChanges = true
                        }
                    }
                })
                if (dispatch && hasChanges) dispatch(tr)
                return hasChanges || true
            },
            outdent: () => ({ tr, state, dispatch }: any) => {
                const { selection } = state
                let hasChanges = false
                tr.doc.nodesBetween(selection.from, selection.to, (node: any, pos: number, parent: any) => {
                    // If paragraph is inside a listItem, let the listItem handle the indentation
                    if (node.type.name === 'paragraph' && parent?.type?.name === 'listItem') {
                        return
                    }

                    if (this.options.types.includes(node.type.name)) {
                        const currentIndent = node.attrs.indent || 0
                        const prevLevelIndex = this.options.indentLevels.slice().reverse().findIndex((lvl: number) => lvl < currentIndent)
                        const newIndent = prevLevelIndex !== -1 ? this.options.indentLevels.slice().reverse()[prevLevelIndex] : 0
                        if (newIndent !== currentIndent) {
                            tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: newIndent })
                            hasChanges = true
                        }
                    }
                })
                if (dispatch && hasChanges) dispatch(tr)
                return hasChanges || true
            }
        }
    },

    addKeyboardShortcuts() {
        return {
            Tab: () => {
                if (this.editor.isActive('table')) {
                    return false
                }
                return this.editor.commands.indent()
            },
            'Shift-Tab': () => {
                if (this.editor.isActive('table')) {
                    return false
                }
                return this.editor.commands.outdent()
            }
        }
    }
})

// ─── Table Delete Shortcut ───
export const TableDeleteShortcut = Extension.create({
  name: 'tableDeleteShortcut',
  addKeyboardShortcuts() {
    const deleteSelected = () => {
      const { selection } = this.editor.state
      
      if (selection && selection.constructor.name === 'CellSelection') {
         const isRow = (selection as any).isRowSelection?.()
         const isCol = (selection as any).isColSelection?.()
         
         if (isCol && isRow) {
           return this.editor.chain().deleteTable().run()
         } else if (isCol) {
           return this.editor.chain().deleteColumn().run()
         } else if (isRow) {
           return this.editor.chain().deleteRow().run()
         }
      }
      return false
    }

    return {
      Backspace: deleteSelected,
      Delete: deleteSelected,
    }
  }
})