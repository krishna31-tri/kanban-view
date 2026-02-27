export type ColumnType = "todo" | "inProgress" | "done";

export interface Card {
  id: string;
  title: string;
}

export interface Column {
  id: ColumnType;
  title: string;
  cards: Card[];
}
