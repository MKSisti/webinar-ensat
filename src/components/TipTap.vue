<template>
  <div class="flex justify-start items-start flex-col w-full">
    <div class="w-full relative">
      <bubble-menu
        v-if="editor && editable"
        class="px-2.5 py-1.5 bg-black text-white bg-opacity-100 rounded-2xl shadow-2xl"
        :editor="editor"
        :tippy-options="tippyConfig"
      >
        <div
          v-if="!imgSel"
          class="w-full h-full flex justify-center items-center space-x-5"
        >
          <!-- //!set bold -->
          <button
            :class="{ 'is-active': editor.isActive('bold') }"
            @click="editor.chain().focus().toggleBold().run()"
          >
            <i
              class="ri-bold text-2xl font-thin"
              aria-hidden="true"
            />
          </button>

          <!-- //!set italic -->
          <button
            :class="{ 'is-active': editor.isActive('italic') }"
            @click="editor.chain().focus().toggleItalic().run()"
          >
            <i
              class="ri-italic text-2xl font-thin"
              aria-hidden="true"
            />
          </button>

          <!-- //!set striked -->
          <button
            :class="{ 'is-active': editor.isActive('strike') }"
            @click="editor.chain().focus().toggleStrike().run()"
          >
            <i
              class="ri-strikethrough text-2xl font-thin"
              aria-hidden="true"
            />
          </button>
        </div>
        <div
          v-else
          class="w-full h-full flex justify-center items-center space-x-2"
        >
          <!-- //!set small -->
          <button
            :class="{ 'is-active': selImgSize == 'small' }"
            @click="setSize('small')"
          >
            small
          </button>

          <!-- //!set med -->
          <button
            :class="{ 'is-active': selImgSize == 'medium' }"
            @click="setSize('medium')"
          >
            medium
          </button>

          <!-- //!set large -->
          <button
            :class="{ 'is-active': selImgSize == 'large' }"
            @click="setSize('large')"
          >
            large
          </button>

          <div class="h-4 w-px bg-gray-500" />

          <!-- //!set float left -->
          <button
            :class="{ 'is-active': selImgFloat == 'left' }"
            @click="setFloat('left')"
          >
            float left
          </button>

          <!-- //!set float -->
          <button
            :class="{ 'is-active': selImgFloat == 'right' }"
            @click="setFloat('right')"
          >
            float right
          </button>
        </div>
      </bubble-menu>
    </div>
    <div
      v-if="editor"
      :class="{
        toolbarFocus: focused,
        'transform  pointer-events-none opacity-0': !editable,
        'py-2': editable,
      }"
      :style="{ 'max-height': editable ? '13rem' : '0rem' }"
      class="toolbar z-0 select-none flex flex-wrap justify-start items-center px-2.5 bg-black ring-2 ring-black text-white sm:rounded-t-2xl shadow-2xl w-full h-auto transition-all duration-300 gap-2.5"
    >
      <!-- font block -->
      <div class="bg-white px-2.5 rounded-xl text-black flex flex-nowrap justify-start items-center h-10 space-x-2">
        <!-- //!set bold -->
        <button
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <i
            class="ri-bold text-2xl font-thin"
            aria-hidden="true"
          />
        </button>

        <!-- //!set italic -->
        <button
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <i
            class="ri-italic text-2xl font-thin"
            aria-hidden="true"
          />
        </button>

        <!-- //!set striked -->
        <button
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="editor.chain().focus().toggleStrike().run()"
        >
          <i
            class="ri-strikethrough text-2xl font-thin"
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
          <i class="fa fa-code text-2xl font-thin" aria-hidden="true"></i>
        </button> -->
      </div>

      <!-- text size block -->
      <div 
        :class="{'opacity-50': disableHeading}"
        class="bg-white px-2.5 rounded-xl text-black flex justify-start items-center h-10 transition-opacity duration-300"
      >
        <div class="flex flex-nowrap justify-start items-end space-x-2">
          <!-- //!set h1 -->
          <button
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          >
            <h1 class="text-2xl flex justify-center items-end">
              H1
            </h1>
          </button>

          <!-- //!set h2 -->
          <button
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          >
            <h1 class="text-xl flex justify-center items-end">
              H2
            </h1>
          </button>

          <!-- //!set h3 -->
          <button
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          >
            <h1 class="text-lg flex justify-center items-end -mb-px">
              H3
            </h1>
          </button>

          <!-- //!set h4 -->
          <button
            :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
          >
            <h1 class="text-base flex justify-center items-end">
              H4
            </h1>
          </button>

          <!-- //!set h5 -->
          <button
            :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
          >
            <h1 class="text-sm flex justify-center items-end mb-px">
              H5
            </h1>
          </button>

          <!-- //!set h6 -->
          <button
            :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
          >
            <h1 class="text-xs flex justify-center items-end mb-0.5 pb-px">
              H6
            </h1>
          </button>
        </div>
      </div>

      <!-- insert block -->
      <div class="bg-white px-2.5 rounded-xl text-black flex flex-nowrap justify-start items-center h-10 space-x-2">
        <!-- //!insert bullet points -->
        <button
          :class="{ 'is-active': editor.isActive('bulletList') }"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <i
            class="ri-list-unordered text-2xl font-thin"
            aria-hidden="true"
          />
        </button>

        <!-- //!insert ordered list-->
        <button
          :class="{ 'is-active': editor.isActive('orderedList') }"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <i
            class="ri-list-ordered text-2xl font-thin"
            aria-hidden="true"
          />
        </button>

        <!-- //!insert code block -->
        <button
          :class="{ 'is-active': editor.isActive('codeBlock') }"
          @click="editor.chain().focus().toggleCodeBlock().run()"
        >
          <i
            class="ri-code-box-fill text-2xl font-thin"
            aria-hidden="true"
          />
        </button>

        <!-- //!insert block quotes -->
        <button
          :class="{ 'is-active': editor.isActive('blockquote') }"
          @click="editor.chain().focus().toggleBlockquote().run()"
        >
          <i
            class="ri-double-quotes-l text-2xl font-thin"
            aria-hidden="true"
          />
        </button>

        <!-- //!insert image -->
        <button @click="$refs.tiptapImg.click()">
          <i
            class="ri-image-fill text-2xl font-thin"
            aria-hidden="true"
          />
          <input
            ref="tiptapImg"
            type="file"
            accept="image/*"
            hidden
            @change="fileChange($event.target.files)"
          >
        </button>


        <!-- //!insert horizontal line-->
        <button @click="editor.chain().focus().setHorizontalRule().run()">
          <i
            class="ri-separator text-2xl font-thin"
            aria-hidden="true"
          />
        </button>
      </div>

      <!-- edit block -->
      <div class="bg-white px-2.5 rounded-xl text-black flex flex-nowrap justify-start items-center h-10 space-x-2">
        <!-- //!undo -->
        <button @click="editor.chain().focus().undo().run()">
          <i
            class="ri-arrow-go-back-fill text-2xl font-thin"
            aria-hidden="true"
          />
        </button>
        <!-- //!redo -->
        <button @click="editor.chain().focus().redo().run()">
          <i
            class="ri-arrow-go-forward-fill text-2xl font-thin"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
    <editor-content
      :class="{ 'rounded-xl': !editable, 'ring-2': editable }"
      style="min-height: 20rem;"
      class="ring-black w-full cursor-text px-5 py-5 sm:rounded-b-2xl z-20 transition-all duration-300"
      :editor="editor"
      @click="editor.chain().focus()"
      @keydown.tab.prevent="space()"
    />
  </div>
</template>

<script>
  import { Editor, EditorContent, BubbleMenu /*FloatingMenu*/ } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';
  import { debounce } from '../utils';
  import { fileHandler } from '../js/dbActions';
  import Image from '../js/tiptapImg'

  let selectedImg = null;

  export default {
    components: {
      EditorContent,
      BubbleMenu,
      // FloatingMenu
    },
    props: ['modelValue', 'editable'],
    emits: ['update:modelValue'],

    data() {
      return {
        editor: null,
        focused: false,
        imgSel: false,
        selectedImg: null,
        selImgSize: 'small',
        selImgFloat: 'none'
      };
    },
    computed:{
      tippyConfig(){
        return {
          placement:'bottom'
        }
      },
      disableHeading(){
        return this.editor.isActive('bulletList') || this.editor.isActive('orderedList');
      }
    },
    watch: {
      editable: function (val) {
        this.editor.setOptions({
          editable: val,
        });
      },
      selectedImg: {
        handler:function(val){
          console.log(val)
        },
        deep: true
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
              levels: [1, 2, 3, 4, 5, 6],
            },
          }),
          Image,
        ],
        editable: e,
      });

      this.editor.on('focus', () => {
        proxy.focused = true;
      });

      this.editor.on('selectionUpdate', (s) => {
        // console.log(s.transaction.curSelection?.node);
        if(s.transaction.curSelection?.node?.type?.name == 'image') {
          selectedImg = s.transaction.curSelection.node.type;
          this.imgSel = true;
        }
        else{
          this.imgSel = false;
        }
      });

      let emitModelEvt = debounce(async () => {
        proxy.$emit('update:modelValue', proxy.editor.getHTML());
      }, 200);

      this.editor.on('update', emitModelEvt);

      this.editor.on('blur', () => {
        proxy.focused = false;
      });
    },

    beforeUnmount() {
      this.editor.destroy();
    },

    methods:{
      async fileChange(f) {
        const [fileToUpload,cover] = await fileHandler(f, 2);
        this.editor.chain().focus().setImage({ src: cover, id: 'img-' + Date.now()}).run()
      },

      setSize(size){
        this.editor.commands.updateAttributes(selectedImg, { size });
        this.selImgSize = size;
      },

      setFloat(float){
        if(float == this.selImgFloat){
          this.editor.commands.updateAttributes(selectedImg, { float: 'none' });
          this.selImgFloat = 'none';
        }
        else{
          this.editor.commands.updateAttributes(selectedImg, { float });
          this.selImgFloat = float;
        }
      },

      space(){
        const transaction = this.editor.state.tr.insertText('    ');
        this.editor.view.dispatch(transaction);
      }
    },
  };
</script>
