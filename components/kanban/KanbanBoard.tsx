import { useState } from "react";
import { DndContext, closestCorners, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { v4 as uuid } from "uuid";
import ColumnComponent from "./column";
import type { Column, ColumnType } from "./types";

const initialData: Column[] = [
  {
    id: "todo",
    title: "Todo",
    cards: [
      { id: uuid(), title: "Create initial project plan" },
      { id: uuid(), title: "Design landing page" },
    ],
  },
  {
    id: "inProgress",
    title: "In Progress",
    cards: [{ id: uuid(), title: "Implement authentication" }],
  },
  {
    id: "done",
    title: "Done",
    cards: [{ id: uuid(), title: "Organize repository" }],
  },
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>(initialData);

  const findColumnByCardId = (cardId: string) => {
    return columns.find((col) => col.cards.some((card) => card.id === cardId));
  };

  const findColumnById = (columnId: string) => {
    return columns.find((col) => col.id === columnId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceColumn = findColumnByCardId(activeId);
    let destinationColumn = findColumnByCardId(overId);
    if (!destinationColumn) {
      destinationColumn = findColumnById(overId) ?? undefined;
    }

    if (!sourceColumn || !destinationColumn) return;

    if (sourceColumn.id === destinationColumn.id) {
      const oldIndex = sourceColumn.cards.findIndex((c) => c.id === activeId);
      const newIndex = destinationColumn.cards.findIndex(
        (c) => c.id === overId,
      );

      const updatedCards = arrayMove(sourceColumn.cards, oldIndex, newIndex);

      setColumns((prev) =>
        prev.map((col) =>
          col.id === sourceColumn.id ? { ...col, cards: updatedCards } : col,
        ),
      );
    } else {
      const activeCard = sourceColumn.cards.find((c) => c.id === activeId);
      if (!activeCard) return;

      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === sourceColumn.id) {
            return {
              ...col,
              cards: col.cards.filter((c) => c.id !== activeId),
            };
          }

          if (col.id === destinationColumn.id) {
            const overIndex = col.cards.findIndex((c) => c.id === overId);
            const insertIndex = overIndex >= 0 ? overIndex : col.cards.length;
            const newCards = [...col.cards];
            newCards.splice(insertIndex, 0, activeCard);
            return { ...col, cards: newCards };
          }

          return col;
        }),
      );
    }
  };

  const addCard = (columnId: ColumnType) => {
    const title = prompt("Enter card title");
    if (!title) return;

    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: [...col.cards, { id: uuid(), title }],
            }
          : col,
      ),
    );
  };

  const deleteCard = (cardId: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.filter((c) => c.id !== cardId),
      })),
    );
  };

  const updateCardTitle = (cardId: string, newTitle: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.map((card) =>
          card.id === cardId ? { ...card, title: newTitle } : card,
        ),
      })),
    );
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Kanban Board
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Drag cards between columns • Double-click to edit
          </p>
        </header>
        <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <ColumnComponent
              key={column.id}
              column={column}
              addCard={addCard}
              deleteCard={deleteCard}
              updateCardTitle={updateCardTitle}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
};
export default KanbanBoard;
