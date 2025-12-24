import type { WidgetType } from "../../../components/molecule";

export interface WidgetsApi {
    id: string;
    type: WidgetType;
    title: string;
    x: number;
    y: number;
    w: number;
    h: number;
    data: any;
}