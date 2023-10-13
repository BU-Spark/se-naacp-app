declare module '*.jpg';
declare module '*.png';
declare module '*.woff2';
declare module '*.woff';
declare module '*.ttf';

// Tell the compiler how to handle svg extensions
declare module "*.svg" {
    const content: any;
    export default content;
}

