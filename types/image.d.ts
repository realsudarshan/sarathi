declare module "*.png"{
    const value:any;
    export default value;
}
declare module "*.jpg"{
    const value:any;
    export default value;
}
declare module "*.jpeg"{
    const value:any;
    export default value;
}
declare module "*.gif"{
    const value:any;
    export default value;
}
declare module "*.svg"{
    const value:any;
    export default value;
}
//TypeScript doesn't natively understand how to import non-code
//  assets like images (e.g., import logo from './logo.png';).
//  So you get an error unless you declare their types.