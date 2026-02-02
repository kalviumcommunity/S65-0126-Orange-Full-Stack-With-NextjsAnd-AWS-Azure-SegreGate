# S65-0126-Orange-Full-Stack-With-NextjsAnd-AWS-Azure-SegreGate

## Advanced Data Fetching & Rendering 

### Rendering Modes Used

| Page | Rendering Type | Reason |
|-----|---------------|--------|
| Home (`/`) | Static | Landing page, no dynamic data |
| About (`/about`) | SSG | Informational, rarely changes |
| Dashboard (`/dashboard`) | SSR | Real-time data per request |
| News (`/news`) | ISR | Semi-dynamic content |

### Why These Choices?

- Static rendering improves performance and reduces server cost
- SSR ensures real-time data for user-specific dashboards
- ISR balances freshness and speed by regenerating pages periodically

### Performance Reflection

If the app had **10x more users**, using SSR everywhere would:
- Increase server load
- Increase cloud costs
- Increase response latency

A better strategy would be:
- Static + ISR for most pages
- SSR only for user-specific data
