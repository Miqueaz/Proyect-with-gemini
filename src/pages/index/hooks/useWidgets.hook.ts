import type { Widget } from '../../../components/molecule';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWidgets } from '../../../api/widgets/get-witgets.widgets';
import { BarChart3, ImageIcon, ListIcon, TableIcon } from 'lucide-react';


const iconos = {
    chart: BarChart3,
    image: ImageIcon,
    list: ListIcon,
    table: TableIcon,
};

const useWidgets = () => {
    const queryClient = useQueryClient();

    const widgetsQuery = useQuery({
        queryKey: ['widgets'],
        queryFn: async () => {
            const widgets = await getWidgets()

            const newWidgets: Widget[] = widgets.map(widget => ({
                ...widget,
                icon: iconos[widget.type],
            }));

            return newWidgets;
        },
        initialData: [],
    });

    const mutation = useMutation({
        mutationFn: async (widgets: Widget[]) => {
            // Aquí iría tu fetch('/api/widgets', { method: 'PUT', ... })
            return widgets;
        },
        // Actualización Optimista: Cambia la UI antes de que responda el servidor
        onMutate: async (widgets: Widget[]) => {
            await queryClient.cancelQueries({ queryKey: ['widgets'] });
            const previousWidgets = queryClient.getQueryData(['widgets']);

            queryClient.setQueryData(['widgets'], widgets);

            return { previousWidgets };
        },
        onError: (err, newWidget, context) => {
            queryClient.setQueryData(['widgets'], context?.previousWidgets);
        },
    });


    return {
        widgets: widgetsQuery.data,
        updateWidget: mutation.mutate,
        isUpdating: mutation.isPending,
        isLoading: widgetsQuery.isLoading,
    };
};

export default useWidgets;