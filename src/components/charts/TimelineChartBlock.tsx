interface TimelineEvent {
  year: string;
  label: string;
  detail?: string;
  status?: 'completed' | 'in-progress' | 'planned';
}

interface TimelineChartBlockProps {
  title: string;
  description?: string;
  events: TimelineEvent[];
}

const NAVY = '#0e2e50';

const statusColor = (status?: string) => {
  switch (status) {
    case 'completed':
      return NAVY;
    case 'in-progress':
      return 'rgba(14,46,80,0.55)';
    case 'planned':
      return 'rgba(14,46,80,0.25)';
    default:
      return NAVY;
  }
};

const statusLabel = (status?: string) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'in-progress':
      return 'In Progress';
    case 'planned':
      return 'Planned';
    default:
      return '';
  }
};

export const TimelineChartBlock = ({
  title,
  description,
  events,
}: TimelineChartBlockProps) => {
  return (
    <div className="my-10 bg-white border border-border/40 rounded-lg p-6 md:p-8">
      <h4 className="text-sm font-semibold text-foreground tracking-tight mb-1">
        {title}
      </h4>
      {description && (
        <p className="text-xs text-muted-foreground/60 mb-6 max-w-lg">
          {description}
        </p>
      )}
      <div className="relative pl-6 md:pl-8">
        {/* Vertical line */}
        <div
          className="absolute left-[7px] md:left-[11px] top-1 bottom-1 w-px"
          style={{ backgroundColor: 'rgba(14,46,80,0.12)' }}
        />
        <div className="space-y-5">
          {events.map((event, index) => (
            <div key={index} className="relative flex items-start gap-4">
              {/* Dot */}
              <div
                className="absolute -left-6 md:-left-8 top-[5px] w-[9px] h-[9px] rounded-full border-2 border-white"
                style={{ backgroundColor: statusColor(event.status) }}
              />
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-xs font-semibold text-foreground tracking-tight">
                    {event.year}
                  </span>
                  <span className="text-xs text-foreground/80">
                    {event.label}
                  </span>
                  {event.status && (
                    <span
                      className="text-[9px] tracking-wider uppercase font-medium px-1.5 py-0.5 rounded-sm"
                      style={{
                        color: statusColor(event.status),
                        backgroundColor: `${statusColor(event.status)}11`,
                      }}
                    >
                      {statusLabel(event.status)}
                    </span>
                  )}
                </div>
                {event.detail && (
                  <p className="text-[11px] text-muted-foreground/50 mt-0.5 leading-relaxed">
                    {event.detail}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
