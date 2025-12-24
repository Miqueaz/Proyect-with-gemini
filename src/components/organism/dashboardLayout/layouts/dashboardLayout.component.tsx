import { WidgetContent } from "../../../molecule/widgetContent";
import { WidgetContainer } from "../../../molecule/widgetContainer";
import type { DashboardLayoutProps } from "../interface/dashboardLayout.interface";
import '../styles/index.style.css'
import { useDashboardLogic } from "../hooks/dashboardLayout.hook";


const DashboardLayout: React.FC<DashboardLayoutProps> = (hook) => {

  const {
    widgets,
    showGrid,
    activeId,
    placeholder,
    handlers,
    removeWidget
  } = useDashboardLogic({ widgets: hook.widgets, setWidgets: hook.setWidgets });

  return (
    <div className="relative min-h-screen w-full ">
      <div
        className={`dashboard-grid ${showGrid ? 'grid-bg' : ''} rounded-3xl`}
      >
        {widgets.map((widget) => (
          <WidgetContainer
            key={widget.id}
            id={widget.id}
            title={widget.title}
            icon={widget.icon}
            width={widget.w}
            height={widget.h}
            x={widget.x}
            y={widget.y}
            isDragging={activeId === widget.id}
            onDragStart={(e) => handlers.onDragStart(e, widget)}
            onResizeStart={(e, dir) => handlers.onResizeStart(e, widget, dir)}
            onRemove={() => removeWidget(widget.id)}
          >
            <WidgetContent type={widget.type} data={widget.data} />
          </WidgetContainer>
        ))}

        {/* Placeholder de posición/tamaño actual */}
        {placeholder && (
          <div
            className="widget-placeholder"
            style={{
              gridColumn: `${placeholder.x + 1} / span ${placeholder.w}`,
              gridRow: `${placeholder.y + 1} / span ${placeholder.h}`
            }}
          />
        )}
      </div>
    </div>
  )
};

export { DashboardLayout };
