import {
  DashboardLayout,
  WidgetContainer,
  GhostWidget,
  WidgetContent,
} from '../../components/organism/index';
import { useDashboardLogic } from './hooks/dashboardLogic';
import './properties/style.css';

export default function App() {
  const {
    widgets,
    activeId,
    placeholder,
    handlers,
    showGrid,
    toggleGrid,
    removeWidget,
    cols
  } = useDashboardLogic();

  return (
    <div
      className="min-h-screen bg-slate-50 w-full overflow-x-hidden"
      style={{ '--cols': cols } as React.CSSProperties}
    >
      <DashboardLayout
        title="Admin Console (Bottom Corner Resize)"
        onToggleGrid={toggleGrid}
        showGrid={showGrid}
      >
        <div
          className={`dashboard-grid ${showGrid ? 'grid-bg' : ''}`}
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

        {/* Fantasma visual durante el arrastre */}
        {activeId && handlers.interactionType === 'drag' && (
          <GhostWidget
            widget={widgets.find(w => w.id === activeId)}
            position={handlers.mousePos}
          />
        )}
      </DashboardLayout>
    </div>
  );
}


