declare module "animejs" {
  export function animate(params: any): any
}

type TimelineEntry = {
  title: string;
  content: React.ReactNode;
};
