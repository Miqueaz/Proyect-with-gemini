import type { WidgetContentProps } from "./widgetContent.interface";
import { BarChart, Table, List } from '../../index';
import { Image } from '../../../atom/image';


const WidgetContent: React.FC<WidgetContentProps> = ({ type, data }) => {
  switch (type) {
    case 'chart': return <BarChart data={data} />;
    case 'table': return <Table data={data} />;
    case 'list': return <List data={data} />;
    case 'image': return <Image data={data} />;
    default: return null;
  }
};

export { WidgetContent };
