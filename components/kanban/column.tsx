import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CardItem from "./CardItem";
import type { Column, ColumnType } from "./types";

const columnColors: Record<string, string> = {
  todo: "border-t-4 border-t-amber-500",
  inProgress: "border-t-4 border-t-blue-500",
  done: "border-t-4 border-t-emerald-500",
};

interface Props {
  column: Column;
  addCard: (columnId: ColumnType) => void;
  deleteCard: (cardId: string) => void;
  updateCardTitle: (cardId: string, title: string) => void;
}

export default function ColumnComponent({
  column,
  addCard,
  deleteCard,
  updateCardTitle,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-2xl shadow-lg p-5 flex flex-col min-h-[320px] w-full md:min-w-[280px] md:max-w-[320px] flex-shrink-0 transition-all duration-200 ${columnColors[column.id] ?? ""} ${isOver ? "ring-2 ring-blue-400 ring-offset-2 bg-blue-50/50" : ""}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-base text-gray-800 tracking-tight">
            {column.title}
          </h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
            {column.cards.length}
          </span>
        </div>
        <button
          onClick={() => addCard(column.id)}
          className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 active:scale-95 transition-all shadow-sm"
          aria-label="Add card"
        >
          +
        </button>
      </div>

      {/* Cards */}
      <SortableContext
        items={column.cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3 flex-1">
          {column.cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              deleteCard={deleteCard}
              updateCardTitle={updateCardTitle}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
