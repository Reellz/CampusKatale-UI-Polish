import daisyui from "daisyui";

const config = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "office-green": "#177529",
        "yellow-green": "#97C040",
        "jonquil": "#F8C810",
        "rich-black": "#0C0D19",
        "white": "#FFFFFF",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};

export default config;

