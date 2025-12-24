import { Layout } from './layouts/index.layout';
import useWidgets from './hooks/useWidgets.hook';

export default function App() {
  const { widgets, updateWidget } = useWidgets();

  return <Layout widgets={widgets} setWidgets={updateWidget} />
}
