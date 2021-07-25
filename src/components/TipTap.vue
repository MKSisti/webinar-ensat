<template>
  <div class="flex justify-start items-start space-y-5 flex-col h-full w-full">
    <div class="w-full relative">
      <bubble-menu
        class="flex justify-center items-center px-5 py-2 space-x-4 bg-black text-white bg-opacity-100 rounded-2xl shadow-2xl"
        :editor="editor"
        v-if="editor"
      >
        <!-- //!set bold -->
        <button
          @click="
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          "
          :class="{ 'is-active': editor.isActive('bold') }"
        >
          bold
        </button>
        <!-- //!set italic -->
        <button
          @click="
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          "
          :class="{ 'is-active': editor.isActive('italic') }"
        >
          italic
        </button>
        <!-- //!set striked -->
        <button
          @click="
            editor
              .chain()
              .focus()
              .toggleStrike()
              .run()
          "
          :class="{ 'is-active': editor.isActive('strike') }"
        >
          strike
        </button>
      </bubble-menu>
      <floating-menu
        class="flex justify-center items-center px-2 py-1 space-x-4 bg-black text-white rounded-xl shadow-2xl flex-shrink-0 w-96"
        :editor="editor"
        v-if="editor"
      >
        <!-- //!set paragraph -->
        <button
          @click="
            editor
              .chain()
              .focus()
              .setParagraph()
              .run()
          "
          :class="{ 'is-active': editor.isActive('normal') }"
        >
          paragraph
        </button>
        <!-- //!set h1 -->
        <button
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 1 })
              .run()
          "
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        >
          h1
        </button>
        <!-- //!set h2 -->
        <button
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()
          "
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        >
          h2
        </button>
        <!-- //!set h3 -->
        <button
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 3 })
              .run()
          "
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        >
          h3
        </button>
        <!-- //!set h4 -->
        <button
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 4 })
              .run()
          "
          :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
        >
          h4
        </button>
        <!-- //!set h5 -->
        <button
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 5 })
              .run()
          "
          :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
        >
          h5
        </button>
        <!-- //!set h6 -->
        <button
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 6 })
              .run()
          "
          :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
        >
          h6
        </button>
        <!-- //!set bullet points -->
        <button
          @click="
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          "
          :class="{ 'is-active': editor.isActive('bulletList') }"
        >
          bullet
        </button>
        <!-- //!set ordered list-->
        <button
          @click="
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          "
          :class="{ 'is-active': editor.isActive('orderedList') }"
        >
          list
        </button>
      </floating-menu>
    </div>
    <div
      v-if="editor"
      :class="{'toolbarFocus':focused}"
      class="toolbar flex flex-wrap justify-between items-center px-5 py-2 bg-black text-white rounded-2xl shadow-2xl mx-auto transition duration-300"
    >
      <!-- //!set bold -->
      <button
        @click="
          editor
            .chain()
            .focus()
            .toggleBold()
            .run()
        "
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        bold
      </button>
      <!-- //!set italic -->
      <button
        @click="
          editor
            .chain()
            .focus()
            .toggleItalic()
            .run()
        "
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        italic
      </button>
      <!-- //!set striked -->
      <button
        @click="
          editor
            .chain()
            .focus()
            .toggleStrike()
            .run()
        "
        :class="{ 'is-active': editor.isActive('strike') }"
      >
        strike
      </button>
      <!-- //!set code (?) -->
      <button
        @click="
          editor
            .chain()
            .focus()
            .toggleCode()
            .run()
        "
        :class="{ 'is-active': editor.isActive('code') }"
      >
        code
      </button>
      <!-- //!set paragraph -->
      <button
        @click="
          editor
            .chain()
            .focus()
            .setParagraph()
            .run()
        "
        :class="{ 'is-active': editor.isActive('paragraph') }"
      >
        paragraph
      </button>
      <!-- //!set h1 -->
      <button
        @click="
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 1 })
            .run()
        "
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      >
        h1
      </button>
      <!-- //!set h2 -->
      <button
        @click="
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 2 })
            .run()
        "
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      >
        h2
      </button>
      <!-- //!set h3 -->
      <button
        @click="
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 3 })
            .run()
        "
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      >
        h3
      </button>
      <!-- //!set h4 -->
      <button
        @click="
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 4 })
            .run()
        "
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
      >
        h4
      </button>
      <!-- //!set h5 -->
      <button
        @click="
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 5 })
            .run()
        "
        :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
      >
        h5
      </button>
      <!-- //!set h6 -->
      <button
        @click="
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 6 })
            .run()
        "
        :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
      >
        h6
      </button>
      <!-- //!set bullet points -->
      <button
        @click="
          editor
            .chain()
            .focus()
            .toggleBulletList()
            .run()
        "
        :class="{ 'is-active': editor.isActive('bulletList') }"
      >
        bullet list
      </button>
      <!-- //!set ordered list-->
      <button
        @click="
          editor
            .chain()
            .focus()
            .toggleOrderedList()
            .run()
        "
        :class="{ 'is-active': editor.isActive('orderedList') }"
      >
        ordered list
      </button>
      <!-- //!set code block -->
      <button
        @click="
          editor
            .chain()
            .focus()
            .toggleCodeBlock()
            .run()
        "
        :class="{ 'is-active': editor.isActive('codeBlock') }"
      >
        code block
      </button>
      <!-- //!set block quotes -->
      <button
        @click="
          editor
            .chain()
            .focus()
            .toggleBlockquote()
            .run()
        "
        :class="{ 'is-active': editor.isActive('blockquote') }"
      >
        blockquote
      </button>
      <!-- //!insert horizontal line-->
      <button
        @click="
          editor
            .chain()
            .focus()
            .setHorizontalRule()
            .run()
        "
      >
        horizontal rule
      </button>
      <!-- //!insert break-->
      <button
        @click="
          editor
            .chain()
            .focus()
            .setHardBreak()
            .run()
        "
      >
        hard break
      </button>
      <!-- //!undo -->
      <button
        @click="
          editor
            .chain()
            .focus()
            .undo()
            .run()
        "
      >
        undo
      </button>
      <!-- //!redo -->
      <button
        @click="
          editor
            .chain()
            .focus()
            .redo()
            .run()
        "
      >
        redo
      </button>
    </div>
    <editor-content
      @click="editor.chain().focus()"
      class="ring-2 ring-gray-300 w-full h-full cursor-text px-4 py-4 rounded-xl"
      :editor="editor"
    />
  </div>
</template>

<script>
import { Editor, EditorContent, BubbleMenu, FloatingMenu } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

export default {
  components: {
    EditorContent,
    BubbleMenu,
    FloatingMenu
  },

  data() {
    return {
      editor: null,
      focused: false
    };
  },

  mounted() {
    let proxy = this;

    this.editor = new Editor({
      content: `
        <h1>This is a test</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam, blanditiis aut? Corporis sapiente, cum quia nam iure necessitatibus dolore esse illo veniam accusantium hic laborum ducimus sed odit fugiat iusto!
        </p>
        <p></p>
      `,
      extensions: [
        StarterKit.configure({
          // Configure an included extension
          heading: {
            levels: [1, 2, 3, 4, 5, 6]
          }
        })
      ]
    });

    this.editor.on("focus", () => {
      proxy.focused = true;
    });

    this.editor.on("blur", () => {
      proxy.focused = false;
    });
  },

  beforeUnmount() {
    this.editor.destroy();
  }
};
</script>

<style lang="scss">
/* Basic editor styles */

.toolbar button {
  @apply px-1 rounded-md whitespace-nowrap transition-all duration-300;
}

// .toolbarFocus button{
//   @apply opacity-0 w-0;
// }

.toolbarFocus{
  @apply opacity-20;
}

.ProseMirror:focus {
  @apply outline-none;
}

.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  h1 {
    @apply font-bold text-4xl;
  }

  h2 {
    @apply font-bold text-3xl;
  }

  h3 {
    @apply font-semibold text-2xl;
  }
  h4 {
    @apply font-semibold text-xl;
  }

  h5 {
    @apply font-medium text-lg;
  }

  h6 {
    @apply font-normal text-base;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0d0d0d;
    color: #fff;
    font-family: "JetBrainsMono", monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0d0d0d, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0d0d0d, 0.1);
    margin: 2rem 0;
  }
}
</style>
