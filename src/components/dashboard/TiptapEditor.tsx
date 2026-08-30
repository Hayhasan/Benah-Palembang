import { useState, useRef, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { 
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
    Heading1, Heading2, Heading3, Type, Indent as IndentIcon, Outdent as OutdentIcon,
    List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon, Image as ImageIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify, Video as VideoIcon,
    Table as TableIcon, Trash2, Plus, Minus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ResizableMedia, Indent } from './TiptapExtensions'

interface ToolbarProps {
  editor: any
}

const MenuBar = ({ editor }: ToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [linkModalOpen, setLinkModalOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")

  if (!editor) return null

  const addImage = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      editor.chain().focus().insertContent({ type: 'resizableMedia', attrs: { src: url, mediaType: 'image' } }).run()
      toast.success("Gambar berhasil disisipkan!")
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const addVideo = () => {
    videoInputRef.current?.click()
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      editor.chain().focus().insertContent({ type: 'resizableMedia', attrs: { src: url, mediaType: 'video' } }).run()
      toast.success("Video berhasil disisipkan!")
    }
    if (videoInputRef.current) videoInputRef.current.value = ""
  }

  const openLinkModal = () => {
    const previousUrl = editor.getAttributes('link').href
    setLinkUrl(previousUrl || "")
    setLinkModalOpen(true)
  }

  const saveLink = () => {
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      toast.success("Tautan berhasil dihapus!")
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
      toast.success("Tautan berhasil disimpan!")
    }
    setLinkModalOpen(false)
  }

  const addTable = () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()

  return (
    <>
      <div className="flex flex-col border-b bg-muted/50 rounded-t-md">
        <div className="flex flex-wrap items-center gap-1 p-2">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
            <input type="file" accept="video/*" ref={videoInputRef} onChange={handleVideoChange} className="hidden" />
            
            {/* Basic Text Formatting */}
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-muted' : ''}><Bold className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-muted' : ''}><Italic className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'bg-muted' : ''}><UnderlineIcon className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'bg-muted' : ''}><Strikethrough className="size-4" /></Button>

            <div className="mx-1 h-6 w-[1px] bg-border" />

            {/* Headings & Body */}
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'bg-muted' : ''}><Type className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}><Heading1 className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}><Heading2 className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}><Heading3 className="size-4" /></Button>

            <div className="mx-1 h-6 w-[1px] bg-border" />

            {/* Alignments & Indent */}
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}><AlignLeft className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}><AlignCenter className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}><AlignRight className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'bg-muted' : ''}><AlignJustify className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().outdent().run()}><OutdentIcon className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().indent().run()}><IndentIcon className="size-4" /></Button>

            <div className="mx-1 h-6 w-[1px] bg-border" />

            {/* Lists & Quote */}
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-muted' : ''}><List className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-muted' : ''}><ListOrdered className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'bg-muted' : ''}><Quote className="size-4" /></Button>

            <div className="mx-1 h-6 w-[1px] bg-border" />

            {/* Media & Embeds */}
            <Button type="button" variant="ghost" size="icon" onClick={openLinkModal} className={editor.isActive('link') ? 'bg-muted' : ''}><LinkIcon className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={addImage}><ImageIcon className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={addVideo}><VideoIcon className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={addTable}><TableIcon className="size-4" /></Button>

            <div className="mx-1 h-6 w-[1px] bg-border" />

            {/* Undo/Redo */}
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}><Undo className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}><Redo className="size-4" /></Button>
        </div>
      </div>

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
    </>
  )
}

export const TiptapEditor = ({ content, onChange, editable = true }: { content: string, onChange?: (content: string) => void, editable?: boolean }) => {
  const editor = useEditor({
    editable,
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      ResizableMedia,
      Indent,
      Link.configure({ openOnClick: !editable }),
      TextAlign.configure({ types: ['heading', 'paragraph', 'resizableMedia'] }),
      Table.configure({ resizable: editable }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
        attributes: {
            class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 min-h-[300px] max-w-none dark:prose-invert prose-td:border prose-th:border prose-table:border-collapse prose-img:m-0 prose-video:m-0 ${!editable ? 'bg-muted/10 cursor-default select-text' : ''}`,
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

  return (
    <div className={`border rounded-md overflow-hidden bg-background ${!editable ? 'bg-muted/5' : ''}`}>
      {editable && <MenuBar editor={editor} />}
      {editable && editor && (
        <BubbleMenu editor={editor} shouldShow={({ editor }: { editor: any }) => editor.isActive('table')}>
            <div className="flex flex-wrap items-center gap-1 p-1 bg-white dark:bg-zinc-900 border shadow-lg rounded-md text-xs">
                <span className="font-semibold px-2 text-muted-foreground hidden sm:inline">Tabel:</span>
                <Button type="button" variant="outline" size="sm" onClick={() => editor.chain().focus().addColumnBefore().run()} className="h-7"><Plus className="size-3 mr-1" /> Kol Kiri</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => editor.chain().focus().addColumnAfter().run()} className="h-7"><Plus className="size-3 mr-1" /> Kol Kanan</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => editor.chain().focus().deleteColumn().run()} className="h-7 text-red-500 hover:text-red-600"><Minus className="size-3" /></Button>
                <div className="h-4 w-[1px] bg-border mx-1" />
                <Button type="button" variant="outline" size="sm" onClick={() => editor.chain().focus().addRowBefore().run()} className="h-7"><Plus className="size-3 mr-1" /> Bar Atas</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => editor.chain().focus().addRowAfter().run()} className="h-7"><Plus className="size-3 mr-1" /> Bar Bawah</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => editor.chain().focus().deleteRow().run()} className="h-7 text-red-500 hover:text-red-600"><Minus className="size-3" /></Button>
                <div className="h-4 w-[1px] bg-border mx-1" />
                <Button type="button" variant="destructive" size="sm" onClick={() => editor.chain().focus().deleteTable().run()} className="h-7"><Trash2 className="size-3" /></Button>
            </div>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}

