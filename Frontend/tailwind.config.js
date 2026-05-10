import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: [
          'Lora',
          'Georgia',
          'Arial Hebrew',
          'Noto Sans Hebrew',
          'Times New Roman',
          'Times',
          'Hiragino Sans',
          'Yu Gothic',
          'Meiryo',
          'Noto Sans CJK JP',
          'PingFang TC',
          'Microsoft JhengHei',
          'Noto Sans CJK TC',
          'PingFang SC',
          'Microsoft YaHei',
          'Noto Sans CJK SC',
          'Apple SD Gothic Neo',
          'Malgun Gothic',
          'Noto Sans CJK KR',
          ...defaultTheme.fontFamily.serif,
        ],
      },
    },
  },
  plugins: [],
};
