import type { CardProps } from "../../../types/Interfaces";

const Card: React.FC<CardProps> = ({ title, desc }) => (
  <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{desc}</p>
  </div>
);

export default Card;
