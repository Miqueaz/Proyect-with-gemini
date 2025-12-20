interface ListItem {
  task: string;
  time: string;
  urgent: boolean;
}

interface ListProps {
  data: ListItem[];
}

export type { ListProps, ListItem };
