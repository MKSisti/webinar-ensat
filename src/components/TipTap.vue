<template>
  <div class="flex justify-start items-start flex-col h-full w-full">
    <div class="w-full relative">
      <bubble-menu
        class="flex justify-center select-none items-center px-5 py-2 space-x-5 bg-black text-white bg-opacity-100 rounded-2xl shadow-2xl"
        :editor="editor"
        v-if="editor && editable"
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
          <i class="fa fa-bold text-2xl" aria-hidden="true"></i>
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
          <i class="fa fa-italic text-2xl" aria-hidden="true"></i>
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
          <i class="fa fa-strikethrough text-2xl" aria-hidden="true"></i>
        </button>
      </bubble-menu>
    </div>
    <div
      v-if="editor"
      :class="{ toolbarFocus: focused, 'transform  pointer-events-none opacity-0': !editable, 'py-3': editable }"
      :style="{'max-height': editable ? '12rem' : '0rem'}"
      class="toolbar z-0 select-none flex flex-wrap justify-start items-center px-5 bg-black ring-2 ring-black text-white rounded-t-2xl shadow-2xl w-full h-auto transition-all duration-300 gap-5"
    >
      <!-- font block -->
      <div
        class="bg-white px-4 rounded-xl text-black flex flex-nowrap justify-start items-center h-12 space-x-2"
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
          <i class="fa fa-bold text-2xl" aria-hidden="true"></i>
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
          <i class="fa fa-italic text-2xl" aria-hidden="true"></i>
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
          <i class="fa fa-strikethrough text-2xl" aria-hidden="true"></i>
        </button>

        <!-- //!set code (?) -->
        <!-- <button
          @click="
            editor
              .chain()
              .focus()
              .toggleCode()
              .run()
          "
          :class="{ 'is-active': editor.isActive('code') }"
        >
          <i class="fa fa-code text-2xl" aria-hidden="true"></i>
        </button> -->
      </div>

      <!-- text size block -->
      <div
        class="bg-white px-4 rounded-xl text-black flex flex-nowrap justify-start items-end h-12 space-x-2"
      >
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
          <h1 class="text-4xl font-bold">H1</h1>
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
          <h1 class="font-bold text-3xl">H2</h1>
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
          <h1 class="font-semibold text-2xl">H3</h1>
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
          <h1 class="font-semibold text-xl">H4</h1>
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
          <h1 class="font-medium text-lg mt-px -mb-px">H5</h1>
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
          <h1 class="font-normal text-base">h6</h1>
        </button>
      </div>

      <!-- insert block -->
      <div
        class="bg-white px-4 rounded-xl text-black flex flex-nowrap justify-start items-center h-12 space-x-2"
      >
        <!-- //!insert bullet points -->
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
          <i class="fa fa-list-ul text-2xl" aria-hidden="true"></i>
        </button>

        <!-- //!insert ordered list-->
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
          <i class="fa fa-list-ol text-2xl" aria-hidden="true"></i>
        </button>

        <!-- //!insert code block -->
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
          <i class="fa fa-code text-2xl" aria-hidden="true"></i>
        </button>

        <!-- //!insert block quotes -->
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
          <i class="fa fa-quote-left text-2xl" aria-hidden="true"></i>
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
          <i class="fa fa-minus text-2xl" aria-hidden="true"></i>
        </button>
      </div>

      <!-- edit block -->
      <div
        class="bg-white px-4 rounded-xl text-black flex flex-nowrap justify-start items-center h-12 space-x-2"
      >
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
          <i class="fa fa-undo text-2xl" aria-hidden="true"></i>
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
          <i class="fa fa-repeat text-2xl" aria-hidden="true"></i>
        </button>
      </div>
    </div>
    <editor-content
      @click="editor.chain().focus()"
      :class="{'rounded-xl': !editable, 'ring-2': editable}"
      class="ring-black w-full h-full cursor-text px-4 py-4 rounded-b-xl z-20 transition-all duration-300"
      :editor="editor"
    />
  </div>
</template>

<script>
import {
  Editor,
  EditorContent,
  BubbleMenu /*FloatingMenu*/
} from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { debounce } from "../utils";

export default {
  props: ["modelValue", "editable"],
  emits: ["update:modelValue"],
  components: {
    EditorContent,
    BubbleMenu
    // FloatingMenu
  },

  data() {
    return {
      editor: null,
      focused: false
    };
  },

  watch: {
    editable: function(val) {
      console.log("edit mode",val);
      this.editor.setOptions({
        editable: val
      });
    }
  },

  mounted() {
    let proxy = this;
    let e = this.editable;
    this.editor = new Editor({
      content: this.modelValue,
      extensions: [
        StarterKit.configure({
          // Configure an included extension
          heading: {
            levels: [1, 2, 3, 4, 5, 6]
          }
        })
      ],
      editable: e,
    });

    this.editor.on("focus", () => {
      proxy.focused = true;
    });

    let emitModelEvt = debounce(async () => {
      proxy.$emit("update:modelValue", proxy.editor.getHTML());
    }, 200);

    this.editor.on("update", emitModelEvt);

    this.editor.on("blur", () => {
      proxy.focused = false;
    });
  },

  beforeUnmount() {
    this.editor.destroy();
  }
};
</script>
