"use client"

import { useState, useRef, useEffect } from 'react'
import type { Editor } from '@tiptap/core'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Youtube, { isValidYoutubeUrl } from '@tiptap/extension-youtube'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import Link from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { 
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
    Heading1, Heading2, Heading3, Type, Indent as IndentIcon, Outdent as OutdentIcon,
    List, ListOrdered, Undo, Redo, Link as LinkIcon, Image as ImageIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify, Video as VideoIcon,
    Table as TableIcon, Plus, Loader2, MinusSquare, MonitorPlay as YoutubeIcon
} from 'lucide-react'
import { toast } from "sonner"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  getImageUploadErrorMessage,
  type ImageUploadScope,
  uploadImageToCloudinary,
  validateImageUpload,
} from "@/lib/cloudinary/upload-image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ResizableMedia, Indent, TableDeleteShortcut, CustomTableCell, CustomTableHeader } from './TiptapExtensions'

const MenuBar = ({
  editor,
  isUploadingMedia,
  onUploadMedia,
}: {
  editor: Editor
  isUploadingMedia: boolean
  onUploadMedia: (file: File) => void
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileInputVideoRef = useRef<HTMLInputElement>(null)
  const [linkModalOpen, setLinkModalOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [youtubeModalOpen, setYoutubeModalOpen] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState("")

  if (!editor) return null

  const addImage = () => fileInputRef.current?.click()
  const addVideo = () => fileInputVideoRef.current?.click()
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (fileInputVideoRef.current) fileInputVideoRef.current.value = ""
    if (file) onUploadMedia(file)
  }

  const openYoutubeModal = () => {
    setYoutubeUrl("")
    setYoutubeModalOpen(true)
  }

  const insertYoutube = () => {
    const trimmed = youtubeUrl.trim()
    if (!trimmed) {
      toast.error("Masukkan URL video YouTube terlebih dahulu.")
      return
    }

    if (!isValidYoutubeUrl(trimmed)) {
      toast.error("Format URL YouTube tidak valid. Gunakan link YouTube (misal: https://www.youtube.com/watch?v=... atau https://youtu.be/...).")
      return
    }

    editor.commands.setYoutubeVideo({ src: trimmed })
    toast.success("Video YouTube berhasil disematkan ke dalam konten.")
    setYoutubeModalOpen(false)
  }

  const openLinkModal = () => {
    const previousUrl = editor.getAttributes('link').href
    setLinkUrl(previousUrl || "")
    setLinkModalOpen(true)
  }

  const saveLink = () => {
    const trimmed = linkUrl.trim()
    if (trimmed === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: trimmed, target: '_blank' }).run()
    }
    setLinkModalOpen(false)
  }

  const addTable = () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()

  return (
    <>
      <div className="flex flex-col border-b bg-muted/50 rounded-t-md overflow-hidden relative">
        <div className="flex flex-nowrap overflow-x-auto no-scrollbar items-center gap-1 p-2 [&>*]:shrink-0 touch-pan-x cursor-grab active:cursor-grabbing">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <input type="file" accept="video/*" ref={fileInputVideoRef} onChange={handleFileChange} className="hidden" />
            
            {/* Basic Text Formatting */}
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black' : ''} title="Tebal (Ctrl+B)"><Bold className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black' : ''} title="Miring (Ctrl+I)"><Italic className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black' : ''} title="Garis Bawah (Ctrl+U)"><UnderlineIcon className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black' : ''} title="Coret"><Strikethrough className="size-4" /></Button>

            <div className="mx-1 h-6 w-[1px] bg-border" />

            {/* Headings & Body */}
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black' : ''} title="Heading 1"><Heading1 className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black' : ''} title="Heading 2"><Heading2 className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black' : ''} title="Heading 3"><Heading3 className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black' : ''} title="Paragraf Normal"><Type className="size-4" /></Button>

            <div className="mx-1 h-6 w-[1px] bg-border" />

            {/* Alignments & Indent */}
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black' : ''} title="Rata Kiri"><AlignLeft className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black' : ''} title="Rata Tengah"><AlignCenter className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black' : ''} title="Rata Kanan"><AlignRight className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black' : ''} title="Rata Kanan-Kiri"><AlignJustify className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().outdent().run()} title="Kurangi Indentasi"><OutdentIcon className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().indent().run()} title="Tambah Indentasi"><IndentIcon className="size-4" /></Button>

            <div className="mx-1 h-6 w-[1px] bg-border" />

            {/* Lists */}
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black' : ''} title="Daftar Poin"><List className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black' : ''} title="Daftar Angka"><ListOrdered className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Garis Pembatas Seksi"><MinusSquare className="size-4" /></Button>

            <div className="mx-1 h-6 w-[1px] bg-border" />

            {/* Media & Embeds */}
            <Button type="button" variant="ghost" size="icon" onClick={openLinkModal} className={editor.isActive('link') ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black' : ''} title="Sisipkan Tautan"><LinkIcon className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={addImage} disabled={isUploadingMedia} aria-label={isUploadingMedia ? "Mengunggah media" : "Tambahkan gambar"} title="Sisipkan Gambar">{isUploadingMedia ? <Loader2 className="size-4 animate-spin" /> : <ImageIcon className="size-4" />}</Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon" disabled={isUploadingMedia} aria-label="Tambahkan Video" title="Tambahkan Video">
                  {isUploadingMedia ? <Loader2 className="size-4 animate-spin" /> : <VideoIcon className="size-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={addVideo} className="cursor-pointer">
                  <VideoIcon className="mr-2 h-4 w-4" />
                  <span>Upload File Video</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openYoutubeModal} className="cursor-pointer">
                  <YoutubeIcon className="mr-2 h-4 w-4" />
                  <span>Sematkan YouTube</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button type="button" variant="ghost" size="icon" onClick={addTable} title="Sisipkan Tabel"><TableIcon className="size-4" /></Button>

            <div className="mx-1 h-6 w-[1px] bg-border" />

            {/* Undo/Redo */}
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} title="Urungkan (Ctrl+Z)"><Undo className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} title="Ulangi (Ctrl+Y)"><Redo className="size-4" /></Button>

            {/* Color Pickers (Always Visible) */}
            <div className="flex items-center gap-3 ml-auto pl-2 border-l border-border h-6">
                <div className="flex items-center gap-1.5" title="Warna Teks">
                   <span className="text-[10px] font-semibold text-muted-foreground uppercase">Teks</span>
                   <input 
                      type="color" 
                      value={editor.getAttributes('textStyle').color || '#000000'}
                      onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                      className="w-6 h-6 p-0 border border-border shadow-sm rounded-full cursor-pointer shrink-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full"
                   />
                </div>
                <div className="flex items-center gap-1.5" title={typeof (editor.state.selection as any).isColSelection === 'function' ? "Warna Latar Tabel" : "Warna Latar Teks"}>
                   <span className="text-[10px] font-semibold text-muted-foreground uppercase">{typeof (editor.state.selection as any).isColSelection === 'function' ? 'Tabel' : 'Latar'}</span>
                   <input 
                      type="color" 
                      value={
                         typeof (editor.state.selection as any).isColSelection === 'function'
                           ? editor.getAttributes('tableCell').backgroundColor || editor.getAttributes('tableHeader').backgroundColor || '#ffffff' 
                           : editor.getAttributes('highlight').color || '#ffffff'
                      }
                      onChange={(e) => {
                         const color = e.target.value
                         if (typeof (editor.state.selection as any).isColSelection === 'function') {
                            editor.chain().focus().setCellAttribute('backgroundColor', color).run()
                         } else {
                            editor.chain().focus().setHighlight({ color }).run()
                         }
                      }}
                      className="w-6 h-6 p-0 border border-border shadow-sm rounded-full cursor-pointer shrink-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full"
                   />
                </div>
            </div>
        </div>
      </div>

      {/* Link Dialog */}
      <Dialog open={linkModalOpen} onOpenChange={setLinkModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Masukkan URL Tautan</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkModalOpen(false)}>Batal</Button>
            <Button onClick={saveLink} className="bg-palembang-red text-white hover:bg-palembang-red/90">Simpan Tautan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* YouTube Video Dialog */}
      <Dialog open={youtubeModalOpen} onOpenChange={setYoutubeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sematkan Video YouTube</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-xs text-muted-foreground">
              Masukkan tautan video YouTube dari browser atau aplikasi YouTube (misal: https://www.youtube.com/watch?v=... atau https://youtu.be/...).
            </p>
            <Input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setYoutubeModalOpen(false)}>Batal</Button>
            <Button onClick={insertYoutube} className="bg-palembang-red text-white hover:bg-palembang-red/90">Sematkan Video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

const TableControlsOverlay = ({ editor }: { editor: Editor }) => {
  const [colBtn, setColBtn] = useState<{ x: number, y: number, cell: HTMLElement, action: 'before' | 'after' } | null>(null)
  const [rowBtn, setRowBtn] = useState<{ x: number, y: number, cell: HTMLElement, action: 'before' | 'after' } | null>(null)

  useEffect(() => {
    if (!editor.isEditable || !editor.view) return
    const wrapper = editor.view.dom.parentElement
    if (!wrapper) return

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Keep button alive if hovering over the button itself
      if (target.closest('.table-col-btn') || target.closest('.table-row-btn')) return

      const td = target.closest('td, th') as HTMLElement
      // Hide if not hovering a cell within this editor
      if (!td || !wrapper.contains(td)) {
        setColBtn(null)
        setRowBtn(null)
        return
      }

      const rect = td.getBoundingClientRect()
      const THRESHOLD = 12

      if (Math.abs(e.clientX - rect.left) < THRESHOLD) {
        setColBtn({ x: rect.left, y: rect.top + rect.height / 2, cell: td, action: 'before' })
      } else if (Math.abs(e.clientX - rect.right) < THRESHOLD) {
        setColBtn({ x: rect.right, y: rect.top + rect.height / 2, cell: td, action: 'after' })
      } else {
        setColBtn(null)
      }

      if (Math.abs(e.clientY - rect.top) < THRESHOLD) {
        setRowBtn({ x: rect.left + rect.width / 2, y: rect.top, cell: td, action: 'before' })
      } else if (Math.abs(e.clientY - rect.bottom) < THRESHOLD) {
        setRowBtn({ x: rect.left + rect.width / 2, y: rect.bottom, cell: td, action: 'after' })
      } else {
        setRowBtn(null)
      }
    }

    const handleScroll = () => {
      setColBtn(null)
      setRowBtn(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, true)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [editor, editor.isEditable, editor.view])

  const addColumn = () => {
    if (!colBtn) return
    const pos = editor.view.posAtDOM(colBtn.cell, 0)
    if (pos >= 0) {
      if (colBtn.action === 'before') {
        editor.chain().focus().setTextSelection(pos).addColumnBefore().run()
      } else {
        editor.chain().focus().setTextSelection(pos).addColumnAfter().run()
      }
      setColBtn(null)
    }
  }

  const addRow = () => {
    if (!rowBtn) return
    const pos = editor.view.posAtDOM(rowBtn.cell, 0)
    if (pos >= 0) {
      if (rowBtn.action === 'before') {
        editor.chain().focus().setTextSelection(pos).addRowBefore().run()
      } else {
        editor.chain().focus().setTextSelection(pos).addRowAfter().run()
      }
      setRowBtn(null)
    }
  }

  return (
    <>
      {colBtn && (
        <button
          className="table-col-btn pointer-events-auto fixed flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:scale-110 transition-transform z-50"
          style={{ top: colBtn.y, left: colBtn.x, transform: 'translate(-50%, -50%)' }}
          onClick={addColumn}
          title="Tambah Kolom"
        >
          <Plus className="w-3 h-3" />
        </button>
      )}
      {rowBtn && (
        <button
          className="table-row-btn pointer-events-auto fixed flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:scale-110 transition-transform z-50"
          style={{ top: rowBtn.y, left: rowBtn.x, transform: 'translate(-50%, -50%)' }}
          onClick={addRow}
          title="Tambah Baris"
        >
          <Plus className="w-3 h-3" />
        </button>
      )}
    </>
  )
}

export const TiptapEditor = ({ content, onChange, editable = true, imageUploadScope, onUploadingChange }: { content: string, onChange?: (content: string) => void, editable?: boolean, imageUploadScope?: ImageUploadScope, onUploadingChange?: (isUploading: boolean) => void }) => {
  const [isUploadingMedia, setIsUploadingMedia] = useState(false)
  const editor = useEditor({
    editable,
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Youtube.configure({
        inline: false,
        nocookie: true,
        HTMLAttributes: {
          class: 'aspect-video w-full rounded-[4px] my-4 shadow-sm',
        },
      }),
      ResizableMedia,
      Indent,
      TextAlign.configure({ types: ['heading', 'paragraph', 'resizableMedia'] }),
      Table.configure({ resizable: editable }),
      TableRow,
      CustomTableHeader,
      CustomTableCell,
      TableDeleteShortcut,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
        attributes: {
            class: `article-body prose prose-zinc max-w-none text-black dark:text-white prose-headings:font-sans prose-headings:font-bold prose-headings:text-black dark:prose-headings:text-white prose-p:font-serif prose-p:text-[15px] sm:prose-p:text-base prose-p:leading-[1.6] prose-p:text-black dark:prose-p:text-white prose-strong:text-black dark:prose-strong:text-white [&_p]:!mt-0 [&_p]:!mb-2 [&_ol>li::marker]:font-serif [&_ol>li::marker]:text-black dark:[&_ol>li::marker]:text-white [&_ul>li::marker]:text-black dark:[&_ul>li::marker]:text-white [&_a]:text-blue-600 hover:[&_a]:text-blue-800 font-serif focus:outline-none p-4 sm:p-6 min-h-[360px] w-full max-w-full break-words [overflow-wrap:anywhere] [word-break:break-word] whitespace-pre-wrap dark:prose-invert prose-td:border prose-td:border-zinc-300 prose-td:p-2 prose-th:border prose-th:border-zinc-300 prose-th:p-2 prose-th:bg-zinc-100 dark:prose-th:bg-zinc-800 prose-table:border-collapse prose-img:m-0 prose-video:m-0 ${!editable ? 'bg-muted/10 cursor-default select-text' : ''}`,
        },
    },
  })

  // Synchronize external content updates (e.g., when editing existing article/event data is loaded)
  useEffect(() => {
    if (editor && content !== undefined && content !== editor.getHTML()) {
      editor.commands.setContent(content || "", { emitUpdate: false })
    }
  }, [content, editor])

  // Synchronize editable prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable)
    }
  }, [editable, editor])

  const uploadMedia = async (file: File, view?: any, event?: any) => {
    if (!editor) return

    const isVideo = file.type.startsWith('video/')
    const mediaType = isVideo ? 'video' : 'image'

    const validationMessage = validateImageUpload(file, 'media')
    if (validationMessage) {
      toast.error(validationMessage)
      return
    }

    if (view && event) {
        const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
        if (coordinates) {
            editor.chain().focus().setTextSelection(coordinates.pos).run()
        }
    }

    if (!imageUploadScope) {
      const url = URL.createObjectURL(file)
      editor.chain().focus().insertContent({ type: 'resizableMedia', attrs: { src: url, mediaType } }).run()
      return
    }

    setIsUploadingMedia(true)
    onUploadingChange?.(true)
    try {
      const url = await uploadImageToCloudinary(file, file.name, imageUploadScope, 'media')
      editor.chain().focus().insertContent({ type: 'resizableMedia', attrs: { src: url, mediaType } }).run()
      toast.success(`${isVideo ? 'Video' : 'Gambar'} berhasil diunggah.`)
    } catch (error) {
      console.error(`Upload failed:`, error)
      toast.error(getImageUploadErrorMessage(error))
    } finally {
      setIsUploadingMedia(false)
      onUploadingChange?.(false)
    }
  }

  // Handle drag and drop
  useEffect(() => {
    if (!editor || !editable) return
    editor.setOptions({
      editorProps: {
        ...editor.options.editorProps,
        handleDrop: (view, event, slice, moved) => {
          if (moved || !event.dataTransfer || !event.dataTransfer.files || !event.dataTransfer.files.length) {
            return false
          }
          const file = event.dataTransfer.files[0]
          if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
            event.preventDefault()
            uploadMedia(file, view, event)
            return true
          }
          return false
        }
      }
    })
  }, [editor, editable, imageUploadScope]) // react-hooks/exhaustive-deps intentionally omitted for uploadMedia dependency to avoid looping

  return (
    <div className={`w-full min-w-0 max-w-full border rounded-md overflow-hidden bg-background ${!editable ? 'bg-muted/5' : ''}`}>
      {editable && editor && <MenuBar editor={editor} isUploadingMedia={isUploadingMedia} onUploadMedia={uploadMedia} />}
      <EditorContent editor={editor} className="w-full min-w-0 max-w-full overflow-x-auto" />
      {editable && editor && <TableControlsOverlay editor={editor} />}
    </div>
  )
}
