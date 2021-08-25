<template>
  <div class="flex justify-start items-start flex-col h-full w-full">
    <div class="w-full relative">
      <bubble-menu
        v-if="editor && editable"
        class="
          flex
          justify-center
          select-none
          items-center
          px-5
          py-2
          space-x-5
          bg-black
          text-white
          bg-opacity-100
          rounded-2xl
          shadow-2xl
        "
        :editor="editor"
      >
        <!-- //!set bold -->
        <button
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          "
        >
          <i
            class="fa fa-bold text-2xl"
            aria-hidden="true"
          />
        </button>

        <!-- //!set italic -->
        <button
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          "
        >
          <i
            class="fa fa-italic text-2xl"
            aria-hidden="true"
          />
        </button>

        <!-- //!set striked -->
        <button
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleStrike()
              .run()
          "
        >
          <i
            class="fa fa-strikethrough text-2xl"
            aria-hidden="true"
          />
        </button>
      </bubble-menu>
    </div>
    <div
      v-if="editor"
      :class="{
        toolbarFocus: focused,
        'transform  pointer-events-none opacity-0': !editable,
        'py-3': editable
      }"
      :style="{ 'max-height': editable ? '12rem' : '0rem' }"
      class="
        toolbar
        z-0
        select-none
        flex flex-wrap
        justify-start
        items-center
        px-5
        bg-black
        ring-2 ring-black
        text-white
        rounded-t-2xl
        shadow-2xl
        w-full
        h-auto
        transition-all
        duration-300
        gap-5
      "
    >
      <!-- font block -->
      <div
        class="
          bg-white
          px-4
          rounded-xl
          text-black
          flex flex-nowrap
          justify-start
          items-center
          h-12
          space-x-2
        "
      >
        <!-- //!set bold -->
        <button
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          "
        >
          <i
            class="fa fa-bold text-2xl"
            aria-hidden="true"
          />
        </button>

        <!-- //!set italic -->
        <button
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          "
        >
          <i
            class="fa fa-italic text-2xl"
            aria-hidden="true"
          />
        </button>

        <!-- //!set striked -->
        <button
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleStrike()
              .run()
          "
        >
          <i
            class="fa fa-strikethrough text-2xl"
            aria-hidden="true"
          />
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
        class="
          bg-white
          px-4
          rounded-xl
          text-black
          flex flex-nowrap
          justify-start
          items-end
          h-12
          space-x-2
        "
      >
        <!-- //!set h1 -->
        <button
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 1 })
              .run()
          "
        >
          <h1 class="text-4xl font-bold">
            H1
          </h1>
        </button>

        <!-- //!set h2 -->
        <button
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()
          "
        >
          <h1 class="font-bold text-3xl">
            H2
          </h1>
        </button>

        <!-- //!set h3 -->
        <button
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 3 })
              .run()
          "
        >
          <h1 class="font-semibold text-2xl">
            H3
          </h1>
        </button>

        <!-- //!set h4 -->
        <button
          :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 4 })
              .run()
          "
        >
          <h1 class="font-semibold text-xl">
            H4
          </h1>
        </button>

        <!-- //!set h5 -->
        <button
          :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 5 })
              .run()
          "
        >
          <h1 class="font-medium text-lg mt-px -mb-px">
            H5
          </h1>
        </button>

        <!-- //!set h6 -->
        <button
          :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 6 })
              .run()
          "
        >
          <h1 class="font-normal text-base">
            h6
          </h1>
        </button>
      </div>

      <!-- insert block -->
      <div
        class="
          bg-white
          px-4
          rounded-xl
          text-black
          flex flex-nowrap
          justify-start
          items-center
          h-12
          space-x-2
        "
      >
        <!-- //!insert bullet points -->
        <button
          :class="{ 'is-active': editor.isActive('bulletList') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          "
        >
          <i
            class="fa fa-list-ul text-2xl"
            aria-hidden="true"
          />
        </button>

        <!-- //!insert ordered list-->
        <button
          :class="{ 'is-active': editor.isActive('orderedList') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          "
        >
          <i
            class="fa fa-list-ol text-2xl"
            aria-hidden="true"
          />
        </button>

        <!-- //!insert code block -->
        <button
          :class="{ 'is-active': editor.isActive('codeBlock') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleCodeBlock()
              .run()
          "
        >
          <i
            class="fa fa-code text-2xl"
            aria-hidden="true"
          />
        </button>

        <!-- //!insert block quotes -->
        <button
          :class="{ 'is-active': editor.isActive('blockquote') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleBlockquote()
              .run()
          "
        >
          <i
            class="fa fa-quote-left text-2xl"
            aria-hidden="true"
          />
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
          <i
            class="fa fa-minus text-2xl"
            aria-hidden="true"
          />
        </button>
      </div>

      <!-- edit block -->
      <div
        class="
          bg-white
          px-4
          rounded-xl
          text-black
          flex flex-nowrap
          justify-start
          items-center
          h-12
          space-x-2
        "
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
          <i
            class="fa fa-undo text-2xl"
            aria-hidden="true"
          />
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
          <i
            class="fa fa-repeat text-2xl"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
    <editor-content
      :class="{ 'rounded-xl': !editable, 'ring-2': editable }"
      class="
        ring-black
        w-full
        h-full
        cursor-text
        px-4
        py-4
        rounded-b-xl
        z-20
        transition-all
        duration-300
      "
      :editor="editor"
      @click="editor.chain().focus()"
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
  components: {
    EditorContent,
    BubbleMenu
    // FloatingMenu
  },
  props: ["modelValue", "editable"],
  emits: ["update:modelValue"],

  data() {
    return {
      editor: null,
      focused: false
    };
  },

  watch: {
    editable: function(val) {
      console.log("edit mode", val);
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
      editable: e
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
