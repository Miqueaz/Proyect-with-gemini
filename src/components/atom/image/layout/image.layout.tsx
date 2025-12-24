import type { ImageProps } from "../interface/image.interface";


const Image: React.FC<ImageProps> = ({ data }) => (
  <div className="w-full h-full rounded-xl md:rounded-2xl overflow-hidden shadow-inner bg-slate-100 relative group">
    <img src={data.url} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" alt="Viz" />
    <div className="absolute inset-0 bg-indigo-900/10" />
  </div>
);

export { Image };
