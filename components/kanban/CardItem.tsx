import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "./types";

interface Props {
  card: Card;
  deleteCard: (id: string) => void;
  updateCardTitle: (id: string, title: string) => void;
}

export default function CardItem({ card, deleteCard, updateCardTitle }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(card.title);

  const handleBlur = () => {
    updateCardTitle(card.id, value);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border border-gray-200/80 p-3 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200/60 transition-all duration-200 cursor-grab active:cursor-grabbing group"
    >
      {isEditing ? (
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === "Enter" && handleBlur()}
          autoFocus
        />
      ) : (
        <div className="flex justify-between items-start gap-2">
          <span
            className="text-gray-700 text-sm leading-relaxed flex-1 min-w-0 break-words"
            onDoubleClick={() => setIsEditing(true)}
          >
            {card.title}
          </span>

          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              deleteCard(card.id);
            }}
            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all text-sm flex-shrink-0 p-0.5 rounded hover:bg-red-50"
            aria-label="Delete card"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
