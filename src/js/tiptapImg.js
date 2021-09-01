import Image from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';

export default Image.extend({
  name: 'image',

  addAttributes() {
    return {
      ...Image.config.addAttributes(),
      size: {
        default: 'small',
        parseHTML: (element) => {
          return {
            size: element.getAttribute('size'),
          };
        },
        // … and customize the HTML rendering.
        renderHTML: (attributes) => {
          return {
            size: attributes.size,
          };
        },
      },
      float: {
        default: 'none',
        parseHTML: (element) => {
          return {
            float: element.getAttribute('float'),
          };
        },
        // … and customize the HTML rendering.
        renderHTML: (attributes) => {
          return {
            float: attributes.float,
          };
        },
      },
      id: {
        default: 'img-1',
        parseHTML: (element) => {
          return {
            id: element.getAttribute('id'),
          };
        },
        // … and customize the HTML rendering.
        renderHTML: (attributes) => {
          return {
            id: attributes.id,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ tr, commands }) => {
          if (tr.selection?.node?.type?.name == 'image') {
            return commands.updateAttributes('image', options);
          } else {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          }
        },
    };
  },
});
