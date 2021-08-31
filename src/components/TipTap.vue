<template>
  <div class="flex justify-start items-start flex-col w-full">
    <div class="w-full relative">
      <bubble-menu
        v-if="editor && editable"
        class="select-none px-2.5 py-1.5 bg-black text-white bg-opacity-100 rounded-2xl shadow-2xl"
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
              class="fa fa-bold text-2xl"
              aria-hidden="true"
            />
          </button>

          <!-- //!set italic -->
          <button
            :class="{ 'is-active': editor.isActive('italic') }"
            @click="editor.chain().focus().toggleItalic().run()"
          >
            <i
              class="fa fa-italic text-2xl"
              aria-hidden="true"
            />
          </button>

          <!-- //!set striked -->
          <button
            :class="{ 'is-active': editor.isActive('strike') }"
            @click="editor.chain().focus().toggleStrike().run()"
          >
            <i
              class="fa fa-strikethrough text-2xl"
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
      :style="{ 'max-height': editable ? '10rem' : '0rem' }"
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
            class="fa fa-bold text-2xl"
            aria-hidden="true"
          />
        </button>

        <!-- //!set italic -->
        <button
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <i
            class="fa fa-italic text-2xl"
            aria-hidden="true"
          />
        </button>

        <!-- //!set striked -->
        <button
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="editor.chain().focus().toggleStrike().run()"
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
      <div class="bg-white px-2.5 rounded-xl text-black flex justify-start items-center h-10 ">
        <div class="flex flex-nowrap justify-start items-end space-x-2">
          <!-- //!set h1 -->
          <button
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          >
            <h1 class="text-2xl font-bold flex justify-center items-end">
              H1
            </h1>
          </button>

          <!-- //!set h2 -->
          <button
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          >
            <h1 class="font-bold text-xl flex justify-center items-end">
              H2
            </h1>
          </button>

          <!-- //!set h3 -->
          <button
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          >
            <h1 class="font-semibold text-lg flex justify-center items-end -mb-px">
              H3
            </h1>
          </button>

          <!-- //!set h4 -->
          <button
            :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
          >
            <h1 class="font-semibold text-base flex justify-center items-end">
              H4
            </h1>
          </button>

          <!-- //!set h5 -->
          <button
            :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
          >
            <h1 class="font-medium text-sm flex justify-center items-end mb-px">
              H5
            </h1>
          </button>

          <!-- //!set h6 -->
          <button
            :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
          >
            <h1 class="font-normal text-xs flex justify-center items-end mb-0.5 pb-px">
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
            class="fa fa-list-ul text-2xl"
            aria-hidden="true"
          />
        </button>

        <!-- //!insert ordered list-->
        <button
          :class="{ 'is-active': editor.isActive('orderedList') }"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <i
            class="fa fa-list-ol text-2xl"
            aria-hidden="true"
          />
        </button>

        <!-- //!insert code block -->
        <button
          :class="{ 'is-active': editor.isActive('codeBlock') }"
          @click="editor.chain().focus().toggleCodeBlock().run()"
        >
          <i
            class="fa fa-code text-2xl"
            aria-hidden="true"
          />
        </button>

        <!-- //!insert block quotes -->
        <button
          :class="{ 'is-active': editor.isActive('blockquote') }"
          @click="editor.chain().focus().toggleBlockquote().run()"
        >
          <i
            class="fa fa-quote-left text-2xl"
            aria-hidden="true"
          />
        </button>

        <!-- //!insert image -->
        <button @click="$refs.tiptapImg.click()">
          <i
            class="fa fa-image text-2xl"
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
            class="fa fa-minus text-2xl"
            aria-hidden="true"
          />
        </button>
      </div>

      <!-- edit block -->
      <div class="bg-white px-2.5 rounded-xl text-black flex flex-nowrap justify-start items-center h-10 space-x-2">
        <!-- //!undo -->
        <button @click="editor.chain().focus().undo().run()">
          <i
            class="fa fa-undo text-2xl"
            aria-hidden="true"
          />
        </button>
        <!-- //!redo -->
        <button @click="editor.chain().focus().redo().run()">
          <i
            class="fa fa-repeat text-2xl"
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
      }
    },
    watch: {
      editable: function (val) {
        this.editor.setOptions({
          editable: val,
        });
      },
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
          this.selectedImg = document.getElementById('ref-' + s.transaction.curSelection?.node.attrs.id);
          this.imgSel = true; 
          if(this.selectedImg.classList.contains('image-small')) this.selImgSize = 'small';
          else if(this.selectedImg.classList.contains('image-medium')) this.selImgSize = 'medium';
          else this.selImgSize = 'large';

          if(this.selectedImg.classList.contains('image-float-none')) this.selImgFloat = 'none';
          else if(this.selectedImg.classList.contains('image-float-left')) this.selImgFloat = 'left';
          else this.selImgFloat = 'right';
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
        this.selectedImg.classList.remove('image-small','image-large','image-medium');
        this.selectedImg.classList.add('image-' + size);
        this.selImgSize = size;
      },

      setFloat(float){
        if(this.selectedImg.classList.contains('image-float-' + float)){
          this.selectedImg.classList.remove('image-float-left','image-float-right');
          this.selectedImg.classList.add('image-float-none');
          this.selImgFloat = 'none';
        }
        else{
          this.selectedImg.classList.remove('image-float-none');
          this.selectedImg.classList.add('image-float-' + float);
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
