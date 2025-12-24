import type { WidgetsApi } from "./interface/widgets.api.interface";
import { api } from "./api/widgets.api";


const dummyData: Promise<WidgetsApi[]> = Promise.resolve([
    { id: 'w1', type: 'chart', title: 'Network Flow', x: 0, y: 0, w: 8, h: 4, data: [{ name: 'Ene', val: 45 }, { name: 'Feb', val: 78 }, { name: 'Mar', val: 56 }, { name: 'Abr', val: 90 }, { name: 'May', val: 65 }] },
    { id: 'w2', type: 'image', title: 'Security Nodes', x: 8, y: 0, w: 4, h: 4, data: { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=400' } },
    { id: 'w3', type: 'list', title: 'Critical Events', x: 0, y: 4, w: 4, h: 5, data: [{ task: 'Node Overflow', time: '5m', urgent: true }, { task: 'System Sync', time: '1h', urgent: false }, { task: 'Global Patch', time: '2h', urgent: false }] },
    { id: 'w4', type: 'table', title: 'Live Statistics', x: 4, y: 4, w: 8, h: 5, data: [{ id: 'COMPUTE-A', value: '85% CPU' }, { id: 'S3-BUCKET', value: '1.2 TB' }, { id: 'DB-MASTER', value: '99% UP' }] },
]);

export const getWidgets = async (): Promise<WidgetsApi[]> => {
    return dummyData;
    const { data, status } = await api.get<WidgetsApi[]>('/widgets')

    if (status === 200) {
        return data;
    }

    return [];
}
